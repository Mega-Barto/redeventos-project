create type public.offer_status as enum ('pending', 'accepted', 'rejected', 'cancelled');
create type public.match_status as enum ('accepted', 'completed', 'breached', 'cancelled');

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  event_need_id uuid not null references public.event_needs (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade,
  proposer_id uuid not null references public.profiles (id),
  recipient_id uuid not null references public.profiles (id),
  venue_id uuid references public.venues (id),
  quantity numeric(12, 2) not null check (quantity > 0),
  offer_on date not null,
  note text not null check (char_length(note) between 3 and 1000),
  status public.offer_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint offers_distinct_parties check (proposer_id <> recipient_id)
);

create index offers_event_id_idx on public.offers (event_id);
create index offers_need_id_idx on public.offers (event_need_id);
create index offers_proposer_id_idx on public.offers (proposer_id);
create index offers_recipient_id_idx on public.offers (recipient_id);
create index offers_venue_day_idx on public.offers (venue_id, offer_on) where venue_id is not null;

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null unique references public.offers (id),
  event_need_id uuid not null references public.event_needs (id),
  event_id uuid not null references public.events (id),
  organizer_id uuid not null references public.profiles (id),
  sponsor_id uuid not null references public.profiles (id),
  status public.match_status not null default 'accepted',
  created_at timestamptz not null default now()
);

create index matches_event_id_idx on public.matches (event_id);
create index matches_organizer_id_idx on public.matches (organizer_id);
create index matches_sponsor_id_idx on public.matches (sponsor_id);

create table public.match_commitments (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null unique references public.matches (id) on delete cascade,
  what text not null,
  quantity numeric(12, 2) not null check (quantity > 0),
  when_on date not null,
  accepted_at timestamptz not null default now()
);

create trigger offers_updated_at
  before update on public.offers
  for each row execute function public.set_updated_at();

create or replace function public.accept_offer(p_offer_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_offer public.offers%rowtype;
  v_need public.event_needs%rowtype;
  v_event public.events%rowtype;
  v_match_id uuid;
  v_next numeric(12, 2);
  v_status public.need_status;
  v_organizer uuid;
  v_sponsor uuid;
begin
  if auth.uid() is null then
    raise exception 'Debes entrar para aceptar una propuesta';
  end if;

  select * into v_offer from public.offers where id = p_offer_id for update;
  if not found then
    raise exception 'Propuesta no encontrada';
  end if;
  if v_offer.status <> 'pending' then
    raise exception 'La propuesta ya no está pendiente';
  end if;
  if v_offer.recipient_id <> auth.uid() then
    raise exception 'Solo quien recibe la propuesta puede aceptarla';
  end if;

  select * into v_need from public.event_needs where id = v_offer.event_need_id for update;
  select * into v_event from public.events where id = v_offer.event_id for update;
  if v_event.status not in ('published', 'public') or v_need.status not in ('open', 'partial') then
    raise exception 'Esa necesidad ya no está abierta';
  end if;
  if v_offer.quantity > (v_need.quantity_requested - v_need.quantity_covered) then
    raise exception 'La cantidad supera lo que falta por cubrir';
  end if;

  perform set_config('redeventos.coverage_write', '1', true);

  v_next := v_need.quantity_covered + v_offer.quantity;
  if v_next >= v_need.quantity_requested then
    v_status := 'covered';
  elsif v_next > 0 then
    v_status := 'partial';
  else
    v_status := 'open';
  end if;

  if v_event.organizer_id = v_offer.proposer_id then
    v_organizer := v_offer.proposer_id;
    v_sponsor := v_offer.recipient_id;
  else
    v_organizer := v_offer.recipient_id;
    v_sponsor := v_offer.proposer_id;
  end if;

  update public.offers set status = 'accepted' where id = v_offer.id;
  update public.event_needs
    set quantity_covered = v_next, status = v_status
    where id = v_need.id;

  insert into public.matches (offer_id, event_need_id, event_id, organizer_id, sponsor_id)
  values (v_offer.id, v_need.id, v_event.id, v_organizer, v_sponsor)
  returning id into v_match_id;

  insert into public.match_commitments (match_id, what, quantity, when_on)
  values (v_match_id, v_need.description, v_offer.quantity, v_offer.offer_on);

  return v_match_id;
end;
$$;

create or replace function public.reject_offer(p_offer_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_offer public.offers%rowtype;
begin
  select * into v_offer from public.offers where id = p_offer_id for update;
  if not found then
    raise exception 'Propuesta no encontrada';
  end if;
  if v_offer.recipient_id <> auth.uid() then
    raise exception 'Solo quien recibe la propuesta puede rechazarla';
  end if;
  if v_offer.status <> 'pending' then
    raise exception 'La propuesta ya no está pendiente';
  end if;
  update public.offers set status = 'rejected' where id = v_offer.id;
end;
$$;

create or replace function public.cancel_offer(p_offer_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_offer public.offers%rowtype;
begin
  select * into v_offer from public.offers where id = p_offer_id for update;
  if not found then
    raise exception 'Propuesta no encontrada';
  end if;
  if v_offer.proposer_id <> auth.uid() then
    raise exception 'Solo quien envió la propuesta puede cancelarla';
  end if;
  if v_offer.status <> 'pending' then
    raise exception 'La propuesta ya no está pendiente';
  end if;
  update public.offers set status = 'cancelled' where id = v_offer.id;
end;
$$;

create or replace function public.sponsor_completed_count(p_profile_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(distinct e.id)::integer
  from public.events e
  where e.status = 'completed'
    and e.hidden_at is null
    and (
      exists (
        select 1 from public.venues v
        where v.id = e.venue_id and v.owner_id = p_profile_id
      )
      or exists (
        select 1
        from public.matches m
        where m.event_id = e.id
          and m.sponsor_id = p_profile_id
          and m.status in ('accepted', 'completed')
      )
    );
$$;

drop policy direct_select on public.profile_direct_contacts;
create policy direct_select on public.profile_direct_contacts
  for select to authenticated
  using (
    profile_id = (select auth.uid())
    or (select public.is_moderator())
    or exists (
      select 1
      from public.matches m
      where m.status in ('accepted', 'completed')
        and (
          (m.organizer_id = (select auth.uid()) and m.sponsor_id = profile_id)
          or (m.sponsor_id = (select auth.uid()) and m.organizer_id = profile_id)
        )
    )
  );

alter table public.offers enable row level security;
alter table public.offers force row level security;
alter table public.matches enable row level security;
alter table public.matches force row level security;
alter table public.match_commitments enable row level security;
alter table public.match_commitments force row level security;

create policy offers_select on public.offers
  for select to authenticated
  using (
    proposer_id = (select auth.uid())
    or recipient_id = (select auth.uid())
    or (select public.is_moderator())
    or exists (
      select 1 from public.events e
      where e.id = event_id and e.organizer_id = (select auth.uid())
    )
  );

create policy offers_insert on public.offers
  for insert to authenticated
  with check (
    proposer_id = (select auth.uid())
    and status = 'pending'
    and exists (
      select 1
      from public.event_needs n
      join public.events e on e.id = n.event_id
      where n.id = event_need_id
        and e.id = event_id
        and e.status in ('published', 'public')
        and e.hidden_at is null
        and n.status in ('open', 'partial')
        and exists (
          select 1 from public.registration_commitments c
          where c.profile_id = (select auth.uid())
        )
        and (
          (
            e.organizer_id = (select auth.uid())
            and recipient_id <> e.organizer_id
          )
          or (
            e.organizer_id = recipient_id
            and exists (
              select 1 from public.profile_roles r
              where r.profile_id = (select auth.uid())
                and r.role in ('venue_sponsor', 'local_sponsor')
            )
          )
        )
    )
  );

create policy matches_select on public.matches
  for select to authenticated
  using (
    organizer_id = (select auth.uid())
    or sponsor_id = (select auth.uid())
    or (select public.is_moderator())
  );

create policy commitments_select on public.match_commitments
  for select to authenticated
  using (
    exists (
      select 1 from public.matches m
      where m.id = match_id
        and (
          m.organizer_id = (select auth.uid())
          or m.sponsor_id = (select auth.uid())
          or (select public.is_moderator())
        )
    )
  );

create view public.venue_calendar_days
with (security_invoker = false) as
select venue_id, offer_on as day, 'negotiating'::text as kind
from public.offers
where venue_id is not null and status = 'pending'
union
select o.venue_id, o.offer_on as day, 'committed'::text as kind
from public.offers o
join public.matches m on m.offer_id = o.id
where o.venue_id is not null and m.status in ('accepted', 'completed');

grant select, insert on public.offers to authenticated;
grant select on public.matches to authenticated;
grant select on public.match_commitments to authenticated;
grant select on public.venue_calendar_days to anon, authenticated;
grant execute on function public.accept_offer(uuid) to authenticated;
grant execute on function public.reject_offer(uuid) to authenticated;
grant execute on function public.cancel_offer(uuid) to authenticated;
