-- Eventos y necesidades. venue_id queda sin llave foránea hasta 0003.

create type public.event_category as enum (
  'tecnologia',
  'literatura',
  'cine',
  'musica',
  'educacion',
  'emprendimiento',
  'cultura',
  'comunidades',
  'networking'
);

create type public.event_status as enum ('draft', 'published', 'public', 'completed', 'cancelled');
create type public.need_status as enum ('open', 'partial', 'covered', 'cancelled');

create table public.events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 3 and 150),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category public.event_category not null,
  city public.city not null,
  starts_on date,
  date_range_label text check (date_range_label is null or char_length(date_range_label) between 3 and 120),
  expected_attendees integer not null check (expected_attendees > 0 and expected_attendees <= 100000),
  description text not null check (char_length(description) between 10 and 5000),
  audience text not null check (char_length(audience) between 3 and 1000),
  sponsor_benefit text not null check (char_length(sponsor_benefit) between 3 and 1000),
  rsvp_url text not null check (rsvp_url ~* '^https?://'),
  place_name text check (place_name is null or char_length(place_name) between 2 and 160),
  venue_id uuid,
  status public.event_status not null default 'draft',
  hidden_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_date_present check (starts_on is not null or date_range_label is not null)
);

create index events_organizer_id_idx on public.events (organizer_id);
create index events_status_idx on public.events (status);
create index events_city_idx on public.events (city);

create table public.event_needs (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  type public.need_type not null,
  description text not null check (char_length(description) between 3 and 500),
  quantity_requested numeric(12, 2) not null check (quantity_requested > 0),
  quantity_covered numeric(12, 2) not null default 0 check (quantity_covered >= 0),
  unit text not null check (char_length(unit) between 1 and 40),
  status public.need_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index event_needs_event_id_idx on public.event_needs (event_id);
create index event_needs_open_idx on public.event_needs (event_id) where status in ('open', 'partial');

create or replace function public.set_event_slug()
returns trigger
language plpgsql
as $$
begin
  if new.id is null then
    new.id := gen_random_uuid();
  end if;
  if new.slug is null or new.slug = '' then
    new.slug := public.slugify(new.title) || '-' || left(replace(new.id::text, '-', ''), 6);
  end if;
  return new;
end;
$$;

create trigger events_slug
  before insert on public.events
  for each row execute function public.set_event_slug();

create trigger events_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

create or replace function public.protect_need_coverage()
returns trigger
language plpgsql
as $$
begin
  if current_setting('redeventos.coverage_write', true) = '1' then
    return new;
  end if;
  if new.status = 'cancelled' and old.status in ('open', 'partial') then
    new.quantity_covered := old.quantity_covered;
    new.quantity_requested := old.quantity_requested;
    return new;
  end if;
  new.quantity_covered := old.quantity_covered;
  new.status := old.status;
  return new;
end;
$$;

create trigger event_needs_updated_at
  before update on public.event_needs
  for each row execute function public.set_updated_at();

create trigger event_needs_protect_coverage
  before update on public.event_needs
  for each row execute function public.protect_need_coverage();

create or replace function public.enforce_event_transition()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_moderator() then
    new.hidden_at := old.hidden_at;
    new.organizer_id := old.organizer_id;
  end if;

  if new.status is distinct from old.status then
    if old.status = 'draft' and new.status <> 'published' then
      raise exception 'Un borrador solo puede publicarse para sponsors';
    elsif old.status = 'published' and new.status not in ('public', 'cancelled') then
      raise exception 'Desde published solo se abre la ficha pública o se cancela';
    elsif old.status = 'public' and new.status not in ('completed', 'cancelled') then
      raise exception 'Un evento público solo puede completarse o cancelarse';
    elsif old.status in ('completed', 'cancelled') then
      raise exception 'Ese estado del evento es final';
    end if;

    if new.status = 'public' and (new.starts_on is null or (new.place_name is null and new.venue_id is null)) then
      raise exception 'La ficha pública exige fecha concreta y lugar';
    end if;

    if new.status = 'completed' and not public.is_moderator() then
      raise exception 'Solo el moderador marca un evento como realizado';
    end if;
  end if;

  return new;
end;
$$;

create trigger events_enforce_transition
  before update on public.events
  for each row execute function public.enforce_event_transition();

create or replace function public.owns_event(p_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.events
    where id = p_event_id and organizer_id = auth.uid()
  );
$$;

alter table public.events enable row level security;
alter table public.events force row level security;
alter table public.event_needs enable row level security;
alter table public.event_needs force row level security;

create policy events_select_anon on public.events
  for select to anon
  using (hidden_at is null and status in ('public', 'completed'));

create policy events_select_auth on public.events
  for select to authenticated
  using (
    hidden_at is null
    and (
      organizer_id = (select auth.uid())
      or status in ('public', 'completed')
      or (
        status = 'published'
        and exists (
          select 1 from public.profile_roles r
          where r.profile_id = (select auth.uid())
            and r.role in ('venue_sponsor', 'local_sponsor', 'moderator')
        )
      )
      or (select public.is_moderator())
    )
  );

create policy events_insert_own on public.events
  for insert to authenticated
  with check (
    organizer_id = (select auth.uid())
    and status = 'draft'
    and hidden_at is null
    and exists (
      select 1 from public.registration_commitments c
      where c.profile_id = (select auth.uid())
    )
    and exists (
      select 1 from public.profile_roles r
      where r.profile_id = (select auth.uid()) and r.role = 'organizer'
    )
  );

create policy events_update_own on public.events
  for update to authenticated
  using (organizer_id = (select auth.uid()) or (select public.is_moderator()))
  with check (organizer_id = (select auth.uid()) or (select public.is_moderator()));

create policy needs_select_anon on public.event_needs
  for select to anon
  using (
    exists (
      select 1 from public.events e
      where e.id = event_id and e.hidden_at is null and e.status in ('public', 'completed')
    )
  );

create policy needs_select_auth on public.event_needs
  for select to authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = event_id
        and e.hidden_at is null
        and (
          e.organizer_id = (select auth.uid())
          or e.status in ('published', 'public', 'completed')
          or (select public.is_moderator())
        )
    )
  );

create policy needs_write_own on public.event_needs
  for all to authenticated
  using (public.owns_event(event_id))
  with check (public.owns_event(event_id));

grant select on public.events to anon, authenticated;
grant insert, update on public.events to authenticated;
grant select on public.event_needs to anon, authenticated;
grant insert, update, delete on public.event_needs to authenticated;
grant execute on function public.owns_event(uuid) to authenticated;
