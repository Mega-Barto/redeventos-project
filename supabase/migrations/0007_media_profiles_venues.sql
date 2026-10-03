-- Imágenes de perfil, espacios y evidencia pública.
-- Bucket evidence pasa a public=true; la barrera sigue siendo RLS + is_public.

alter table public.profiles
  add column avatar_storage_path text;

alter table public.venues
  add column cover_storage_path text;

alter table public.event_media
  add column kind text not null default 'evidence',
  add column is_public boolean not null default false;

alter table public.event_media
  add constraint event_media_kind_check check (kind in ('evidence', 'case_highlight'));

create unique index event_media_storage_path_uidx on public.event_media (storage_path);
create index event_media_public_event_id_idx on public.event_media (event_id) where is_public;

create table public.venue_media (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues (id) on delete cascade,
  storage_path text not null,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  unique (storage_path)
);

create index venue_media_venue_sort_idx on public.venue_media (venue_id, sort_order);

alter table public.venue_media enable row level security;
alter table public.venue_media force row level security;

create policy venue_media_select on public.venue_media
  for select to anon, authenticated
  using (
    exists (
      select 1
      from public.venues v
      join public.profiles p on p.id = v.owner_id
      where v.id = venue_id
        and p.disaffiliated_at is null
        and p.hidden_at is null
    )
    or exists (
      select 1
      from public.venues v
      where v.id = venue_id
        and v.owner_id = (select auth.uid())
    )
    or (select public.is_moderator())
  );

create policy venue_media_insert on public.venue_media
  for insert to authenticated
  with check (
    exists (
      select 1
      from public.venues v
      where v.id = venue_id
        and v.owner_id = (select auth.uid())
    )
  );

create policy venue_media_update on public.venue_media
  for update to authenticated
  using (
    exists (
      select 1
      from public.venues v
      where v.id = venue_id
        and v.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.venues v
      where v.id = venue_id
        and v.owner_id = (select auth.uid())
    )
  );

create policy venue_media_delete on public.venue_media
  for delete to authenticated
  using (
    exists (
      select 1
      from public.venues v
      where v.id = venue_id
        and v.owner_id = (select auth.uid())
    )
  );

drop policy media_select on public.event_media;

create policy media_select_own on public.event_media
  for select to authenticated
  using (
    (select public.is_moderator())
    or exists (
      select 1
      from public.events e
      where e.id = event_id
        and e.organizer_id = (select auth.uid())
    )
  );

create policy media_select_public on public.event_media
  for select to anon, authenticated
  using (
    is_public
    and exists (
      select 1
      from public.evidence ev
      join public.events e on e.id = ev.event_id
      where ev.event_id = event_media.event_id
        and ev.status = 'approved'
        and e.status = 'completed'
        and e.hidden_at is null
    )
  );

create or replace function public.review_evidence(
  p_evidence_id uuid,
  p_decision public.evidence_status,
  p_note text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_evidence public.evidence%rowtype;
begin
  if not public.is_moderator() then
    raise exception 'Solo el moderador revisa evidencias';
  end if;
  if p_decision not in ('approved', 'rejected') then
    raise exception 'Decisión inválida';
  end if;
  if p_decision = 'rejected' and char_length(coalesce(p_note, '')) < 3 then
    raise exception 'Explica por qué se rechaza';
  end if;

  select * into v_evidence from public.evidence where id = p_evidence_id for update;
  if not found then
    raise exception 'Evidencia no encontrada';
  end if;
  if v_evidence.status <> 'submitted' then
    raise exception 'Esa evidencia ya fue revisada';
  end if;

  update public.evidence
    set status = p_decision,
        review_note = nullif(p_note, ''),
        reviewed_by = auth.uid()
    where id = v_evidence.id;

  if p_decision = 'approved' then
    update public.events set status = 'completed' where id = v_evidence.event_id and status = 'public';
    update public.matches
      set status = 'completed'
      where event_id = v_evidence.event_id and status = 'accepted';
    update public.event_media
      set is_public = true
      where event_id = v_evidence.event_id
        and kind = 'evidence';
  end if;
end;
$$;

create or replace function public.clear_unpublished_event_media()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status = 'rejected' and new.status = 'submitted' then
    delete from public.event_media
    where event_id = new.event_id
      and is_public = false;
  end if;
  return new;
end;
$$;

create trigger evidence_clear_unpublished_media
  after update of status on public.evidence
  for each row
  execute function public.clear_unpublished_event_media();

-- La URL /object/public/ no aplica RLS de descarga. La barrera pre-aprobación
-- es no filtrar event_media.storage_path. No hay SELECT anon de listado.

update storage.buckets
set public = true
where id = 'evidence';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'profiles',
    'profiles',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'venues',
    'venues',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy profiles_storage_select on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'profiles');

create policy profiles_storage_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'profiles'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy profiles_storage_update on storage.objects
  for update to authenticated
  using (
    bucket_id = 'profiles'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'profiles'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy profiles_storage_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'profiles'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy venues_storage_select on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'venues');

create policy venues_storage_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'venues'
    and (storage.foldername(name))[1] in (
      select v.id::text
      from public.venues v
      where v.owner_id = (select auth.uid())
    )
  );

create policy venues_storage_update on storage.objects
  for update to authenticated
  using (
    bucket_id = 'venues'
    and (storage.foldername(name))[1] in (
      select v.id::text
      from public.venues v
      where v.owner_id = (select auth.uid())
    )
  )
  with check (
    bucket_id = 'venues'
    and (storage.foldername(name))[1] in (
      select v.id::text
      from public.venues v
      where v.owner_id = (select auth.uid())
    )
  );

create policy venues_storage_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'venues'
    and (storage.foldername(name))[1] in (
      select v.id::text
      from public.venues v
      where v.owner_id = (select auth.uid())
    )
  );

drop view if exists public.public_cases;

create view public.public_cases
with (security_invoker = false) as
select
  e.id,
  e.slug,
  e.title,
  e.category,
  e.city,
  e.starts_on,
  e.place_name,
  e.audience,
  e.sponsor_benefit,
  ev.attendance_count,
  ev.venue_note,
  ev.contributions_note,
  (
    select em.storage_path
    from public.event_media em
    where em.event_id = e.id
      and em.is_public
    order by em.created_at
    limit 1
  ) as cover_path
from public.events e
join public.evidence ev on ev.event_id = e.id
where e.status = 'completed'
  and e.hidden_at is null
  and ev.status = 'approved';

create view public.public_case_covers
with (security_invoker = true) as
select distinct on (em.event_id)
  em.event_id,
  e.slug as event_slug,
  em.storage_path,
  em.created_at
from public.event_media em
join public.events e on e.id = em.event_id
where em.is_public
order by em.event_id, em.created_at;

create view public.public_case_media
with (security_invoker = true) as
select
  e.id as event_id,
  e.slug as event_slug,
  em.storage_path,
  em.created_at,
  row_number() over (partition by e.id order by em.created_at)::integer as sort_order
from public.event_media em
join public.events e on e.id = em.event_id
where em.is_public;

grant select, insert, update, delete on public.venue_media to authenticated;
grant select on public.venue_media to anon;
grant select on public.public_cases to anon, authenticated;
grant select on public.public_case_covers to anon, authenticated;
grant select on public.public_case_media to anon, authenticated;
grant select on public.event_media to anon, authenticated;
