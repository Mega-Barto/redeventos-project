create type public.evidence_status as enum ('submitted', 'approved', 'rejected');

create table public.evidence (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null unique references public.events (id) on delete cascade,
  submitted_by uuid not null references public.profiles (id),
  attendance_count integer not null check (attendance_count > 0),
  venue_note text not null check (char_length(venue_note) between 3 and 2000),
  contributions_note text not null check (char_length(contributions_note) between 3 and 2000),
  status public.evidence_status not null default 'submitted',
  review_note text,
  reviewed_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index evidence_status_idx on public.evidence (status);

create table public.event_media (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index event_media_event_id_idx on public.event_media (event_id);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id),
  target_type text not null check (target_type in ('event', 'profile')),
  target_id uuid not null,
  reason text not null check (char_length(reason) between 10 and 1000),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index reports_target_idx on public.reports (target_type, target_id);

create trigger evidence_updated_at
  before update on public.evidence
  for each row execute function public.set_updated_at();

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
  end if;
end;
$$;

create or replace function public.hide_target(p_type text, p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_moderator() then
    raise exception 'Solo el moderador oculta contenido';
  end if;
  if p_type = 'event' then
    update public.events set hidden_at = now() where id = p_id;
  elsif p_type = 'profile' then
    update public.profiles set hidden_at = now() where id = p_id;
  else
    raise exception 'Tipo de reporte inválido';
  end if;
  update public.reports
    set resolved_at = now()
    where target_type = p_type and target_id = p_id and resolved_at is null;
end;
$$;

create or replace function public.disaffiliate_profile(p_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_moderator() then
    raise exception 'Solo el moderador desafilia';
  end if;
  if p_profile_id = auth.uid() then
    raise exception 'No puedes desafiliarte a ti mismo';
  end if;
  update public.profiles set disaffiliated_at = now() where id = p_profile_id;
  update public.matches
    set status = 'breached'
    where status = 'accepted'
      and (organizer_id = p_profile_id or sponsor_id = p_profile_id);
end;
$$;

alter table public.evidence enable row level security;
alter table public.evidence force row level security;
alter table public.event_media enable row level security;
alter table public.event_media force row level security;
alter table public.reports enable row level security;
alter table public.reports force row level security;

create policy evidence_select on public.evidence
  for select to authenticated
  using (
    submitted_by = (select auth.uid())
    or (select public.is_moderator())
    or exists (
      select 1 from public.events e
      where e.id = event_id and e.organizer_id = (select auth.uid())
    )
  );

create policy evidence_insert on public.evidence
  for insert to authenticated
  with check (
    submitted_by = (select auth.uid())
    and status = 'submitted'
    and exists (
      select 1 from public.events e
      where e.id = event_id and e.organizer_id = (select auth.uid()) and e.status = 'public'
    )
  );

create policy evidence_update_resubmit on public.evidence
  for update to authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = event_id and e.organizer_id = (select auth.uid())
    )
    and status = 'rejected'
  )
  with check (status = 'submitted');

create policy media_select on public.event_media
  for select to authenticated
  using (
    (select public.is_moderator())
    or exists (
      select 1 from public.events e
      where e.id = event_id and e.organizer_id = (select auth.uid())
    )
  );

create policy media_insert on public.event_media
  for insert to authenticated
  with check (
    exists (
      select 1 from public.events e
      where e.id = event_id and e.organizer_id = (select auth.uid())
    )
  );

create policy reports_insert on public.reports
  for insert to authenticated
  with check (reporter_id = (select auth.uid()));

create policy reports_select on public.reports
  for select to authenticated
  using (reporter_id = (select auth.uid()) or (select public.is_moderator()));

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
  ev.contributions_note
from public.events e
join public.evidence ev on ev.event_id = e.id
where e.status = 'completed'
  and e.hidden_at is null
  and ev.status = 'approved';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'evidence',
  'evidence',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

create policy evidence_storage_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'evidence'
    and (storage.foldername(name))[1] in (
      select e.id::text from public.events e where e.organizer_id = auth.uid()
    )
  );

create policy evidence_storage_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'evidence'
    and (
      (storage.foldername(name))[1] in (
        select e.id::text from public.events e where e.organizer_id = auth.uid()
      )
      or public.is_moderator()
    )
  );

grant select, insert, update on public.evidence to authenticated;
grant select, insert on public.event_media to authenticated;
grant select, insert on public.reports to authenticated;
grant select on public.public_cases to anon, authenticated;
grant execute on function public.review_evidence(uuid, public.evidence_status, text) to authenticated;
grant execute on function public.hide_target(text, uuid) to authenticated;
grant execute on function public.disaffiliate_profile(uuid) to authenticated;
