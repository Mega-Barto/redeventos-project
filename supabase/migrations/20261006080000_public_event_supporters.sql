-- Ficha pública: mención de venue y local sponsors sin abrir offers/matches a anon.
-- security_invoker = false: la vista proyecta solo filas de eventos public/completed no ocultos.

create view public.public_event_supporters
with (security_invoker = false) as
with public_events as (
  select e.id, e.slug, e.organizer_id, e.venue_id, e.place_name
  from public.events e
  where e.status in ('public', 'completed')
    and e.hidden_at is null
),
venue_need as (
  select distinct on (n.event_id)
    n.event_id,
    n.id as need_id,
    n.description,
    n.status
  from public.event_needs n
  where n.type = 'venue'
    and n.status <> 'cancelled'
  order by n.event_id, n.created_at
),
venue_rows as (
  select
    pe.id as event_id,
    pe.slug as event_slug,
    vn.need_id,
    'venue'::public.need_type as need_type,
    coalesce(vn.description, v.description) as need_description,
    'venue'::text as party_kind,
    v.name as party_name,
    v.slug as party_slug,
    ('/venues/' || v.slug) as party_href,
    owner.display_name as person_name,
    case
      when vn.status = 'covered'
        or exists (
          select 1
          from public.matches m
          where m.event_id = pe.id
            and (vn.need_id is null or m.event_need_id = vn.need_id)
            and m.status in ('accepted', 'completed')
            and exists (
              select 1 from public.event_needs en
              where en.id = m.event_need_id and en.type = 'venue'
            )
        )
        then 'confirmed'
      when exists (
        select 1
        from public.offers o
        where o.event_id = pe.id
          and o.status = 'pending'
          and (
            (vn.need_id is not null and o.event_need_id = vn.need_id)
            or (vn.need_id is null and o.venue_id = v.id)
          )
      )
        then 'requested'
      when pe.venue_id is not null then 'confirmed'
      else 'pending'
    end as support_status,
    10 as sort_rank
  from public_events pe
  join public.venues v on v.id = pe.venue_id
  join public.profiles owner on owner.id = v.owner_id
  left join venue_need vn on vn.event_id = pe.id
  where owner.disaffiliated_at is null
    and owner.hidden_at is null
),
local_confirmed as (
  select
    pe.id as event_id,
    pe.slug as event_slug,
    n.id as need_id,
    n.type as need_type,
    n.description as need_description,
    'local_sponsor'::text as party_kind,
    p.display_name as party_name,
    p.slug as party_slug,
    ('/sponsors/' || p.slug) as party_href,
    p.display_name as person_name,
    'confirmed'::text as support_status,
    20 as sort_rank
  from public_events pe
  join public.matches m
    on m.event_id = pe.id
   and m.status in ('accepted', 'completed')
  join public.event_needs n on n.id = m.event_need_id
  join public.profiles p on p.id = m.sponsor_id
  where n.type <> 'venue'
    and n.status <> 'cancelled'
    and p.disaffiliated_at is null
    and p.hidden_at is null
),
local_requested as (
  select
    pe.id as event_id,
    pe.slug as event_slug,
    n.id as need_id,
    n.type as need_type,
    n.description as need_description,
    'local_sponsor'::text as party_kind,
    p.display_name as party_name,
    p.slug as party_slug,
    ('/sponsors/' || p.slug) as party_href,
    p.display_name as person_name,
    'requested'::text as support_status,
    30 as sort_rank
  from public_events pe
  join public.offers o
    on o.event_id = pe.id
   and o.status = 'pending'
  join public.event_needs n on n.id = o.event_need_id
  join public.profiles p on p.id = case
    when o.proposer_id = pe.organizer_id then o.recipient_id
    else o.proposer_id
  end
  where n.type <> 'venue'
    and n.status <> 'cancelled'
    and p.disaffiliated_at is null
    and p.hidden_at is null
    and not exists (
      select 1 from public.matches m where m.offer_id = o.id
    )
),
local_pending as (
  select
    pe.id as event_id,
    pe.slug as event_slug,
    n.id as need_id,
    n.type as need_type,
    n.description as need_description,
    'local_sponsor'::text as party_kind,
    null::text as party_name,
    null::text as party_slug,
    null::text as party_href,
    null::text as person_name,
    'pending'::text as support_status,
    40 as sort_rank
  from public_events pe
  join public.event_needs n on n.event_id = pe.id
  where n.type <> 'venue'
    and n.status in ('open', 'partial')
    and not exists (
      select 1
      from public.offers o
      where o.event_need_id = n.id
        and o.status = 'pending'
    )
    and not exists (
      select 1
      from public.matches m
      where m.event_need_id = n.id
        and m.status in ('accepted', 'completed')
    )
)
select * from venue_rows
union all
select * from local_confirmed
union all
select * from local_requested
union all
select * from local_pending;

grant select on public.public_event_supporters to anon, authenticated;
