create type public.venue_support_mode as enum ('free', 'depends', 'rental_only');

create table public.venues (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  city public.city not null,
  zone text not null check (char_length(zone) between 2 and 120),
  capacity integer not null check (capacity > 0 and capacity <= 100000),
  equipment text not null check (char_length(equipment) between 2 and 2000),
  support_mode public.venue_support_mode not null,
  description text not null check (char_length(description) between 10 and 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index venues_owner_id_idx on public.venues (owner_id);
create index venues_city_idx on public.venues (city);

alter table public.events
  add constraint events_venue_id_fkey foreign key (venue_id) references public.venues (id);

create or replace function public.set_venue_slug()
returns trigger
language plpgsql
as $$
begin
  if new.id is null then
    new.id := gen_random_uuid();
  end if;
  if new.slug is null or new.slug = '' then
    new.slug := public.slugify(new.name) || '-' || left(replace(new.id::text, '-', ''), 6);
  end if;
  return new;
end;
$$;

create trigger venues_slug
  before insert on public.venues
  for each row execute function public.set_venue_slug();

create trigger venues_updated_at
  before update on public.venues
  for each row execute function public.set_updated_at();

alter table public.venues enable row level security;
alter table public.venues force row level security;

create policy venues_select on public.venues
  for select to anon, authenticated
  using (
    owner_id = (select auth.uid())
    or (select public.is_moderator())
    or exists (
      select 1 from public.profiles p
      where p.id = owner_id and p.disaffiliated_at is null and p.hidden_at is null
    )
  );

create policy venues_insert_own on public.venues
  for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.profile_roles r
      where r.profile_id = (select auth.uid()) and r.role = 'venue_sponsor'
    )
    and exists (
      select 1 from public.registration_commitments c
      where c.profile_id = (select auth.uid())
    )
  );

create policy venues_update_own on public.venues
  for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

grant select on public.venues to anon, authenticated;
grant insert, update on public.venues to authenticated;

create or replace function public.sponsor_completed_count(p_profile_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(distinct e.id)::integer
  from public.events e
  join public.venues v on v.id = e.venue_id
  where e.status = 'completed'
    and e.hidden_at is null
    and v.owner_id = p_profile_id;
$$;

grant execute on function public.sponsor_completed_count(uuid) to anon, authenticated;
