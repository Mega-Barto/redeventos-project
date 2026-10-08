-- Preferencias de avisos. Sin fila, el envío usa defaults de la app
-- (email ON en offer_received, offer_accepted, evidence_submitted, evidence_reviewed).

create type public.notification_event_key as enum (
  'offer_received',
  'offer_accepted',
  'offer_rejected',
  'offer_cancelled',
  'evidence_submitted',
  'evidence_reviewed',
  'report_created',
  'content_hidden',
  'disaffiliated',
  'case_completed'
);

create type public.notification_channel as enum ('email', 'whatsapp');

create table public.notification_preferences (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  event_key public.notification_event_key not null,
  channel public.notification_channel not null,
  enabled boolean not null,
  updated_at timestamptz not null default now(),
  primary key (profile_id, event_key, channel)
);

create index notification_preferences_profile_id_idx
  on public.notification_preferences (profile_id);

create trigger notification_preferences_updated_at
  before update on public.notification_preferences
  for each row execute function public.set_updated_at();

alter table public.notification_preferences enable row level security;
alter table public.notification_preferences force row level security;

create policy notification_preferences_select_own on public.notification_preferences
  for select to authenticated
  using (profile_id = (select auth.uid()));

create policy notification_preferences_insert_own on public.notification_preferences
  for insert to authenticated
  with check (profile_id = (select auth.uid()));

create policy notification_preferences_update_own on public.notification_preferences
  for update to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

create policy notification_preferences_delete_own on public.notification_preferences
  for delete to authenticated
  using (profile_id = (select auth.uid()));

grant select, insert, update, delete on public.notification_preferences to authenticated;
