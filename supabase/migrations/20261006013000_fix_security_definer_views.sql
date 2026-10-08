-- Advisor 0010: vistas SECURITY DEFINER en public eluden RLS.
-- public_cases → security_invoker + lectura pública acotada de evidence aprobada.
-- venue_calendar_days → tabla proyectada (evita abrir offers/matches a anon).

-- ---------------------------------------------------------------------------
-- evidence: casos públicos (solo filas approved + evento completed visible)
-- ---------------------------------------------------------------------------
create policy evidence_select_public_case on public.evidence
  for select to anon, authenticated
  using (
    status = 'approved'
    and exists (
      select 1
      from public.events e
      where e.id = event_id
        and e.status = 'completed'
        and e.hidden_at is null
    )
  );

-- Quitar SELECT de tabla (auto-expose) y dejar solo columnas de caso público.
revoke select on table public.evidence from anon;
grant select (
  event_id,
  attendance_count,
  venue_note,
  contributions_note,
  status
) on public.evidence to anon;

alter view public.public_cases set (security_invoker = true);

-- ---------------------------------------------------------------------------
-- venue_calendar_days: de vista DEFINER a tabla con RLS de solo lectura
-- ---------------------------------------------------------------------------
drop view if exists public.venue_calendar_days;

create table public.venue_calendar_days (
  venue_id uuid not null references public.venues (id) on delete cascade,
  day date not null,
  kind text not null check (kind in ('negotiating', 'committed')),
  primary key (venue_id, day, kind)
);

create index venue_calendar_days_venue_id_idx
  on public.venue_calendar_days (venue_id);

alter table public.venue_calendar_days enable row level security;
alter table public.venue_calendar_days force row level security;

create policy venue_calendar_days_select on public.venue_calendar_days
  for select to anon, authenticated
  using (true);

create or replace function public.sync_venue_calendar_days(p_venue_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_venue_id is null then
    return;
  end if;

  delete from public.venue_calendar_days where venue_id = p_venue_id;

  insert into public.venue_calendar_days (venue_id, day, kind)
  select distinct o.venue_id, o.offer_on, 'negotiating'::text
  from public.offers o
  where o.venue_id = p_venue_id
    and o.status = 'pending'
  union
  select distinct o.venue_id, o.offer_on, 'committed'::text
  from public.offers o
  join public.matches m on m.offer_id = o.id
  where o.venue_id = p_venue_id
    and m.status in ('accepted', 'completed');
end;
$$;

revoke all on function public.sync_venue_calendar_days(uuid) from public;

create or replace function public.trg_offers_sync_venue_calendar()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform public.sync_venue_calendar_days(old.venue_id);
    return old;
  end if;

  perform public.sync_venue_calendar_days(new.venue_id);

  if tg_op = 'UPDATE' and old.venue_id is distinct from new.venue_id then
    perform public.sync_venue_calendar_days(old.venue_id);
  end if;

  return new;
end;
$$;

revoke all on function public.trg_offers_sync_venue_calendar() from public;

create or replace function public.trg_matches_sync_venue_calendar()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_venue_id uuid;
  v_offer_id uuid;
begin
  v_offer_id := case when tg_op = 'DELETE' then old.offer_id else new.offer_id end;

  select o.venue_id into v_venue_id
  from public.offers o
  where o.id = v_offer_id;

  perform public.sync_venue_calendar_days(v_venue_id);

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function public.trg_matches_sync_venue_calendar() from public;

create trigger offers_sync_venue_calendar
  after insert or update or delete on public.offers
  for each row execute function public.trg_offers_sync_venue_calendar();

create trigger matches_sync_venue_calendar
  after insert or update or delete on public.matches
  for each row execute function public.trg_matches_sync_venue_calendar();

-- Backfill desde el estado actual de offers/matches
do $$
declare
  r record;
begin
  for r in
    select distinct venue_id
    from public.offers
    where venue_id is not null
  loop
    perform public.sync_venue_calendar_days(r.venue_id);
  end loop;
end;
$$;

grant select on public.venue_calendar_days to anon, authenticated;
revoke insert, update, delete, truncate, references, trigger
  on public.venue_calendar_days from anon, authenticated;
