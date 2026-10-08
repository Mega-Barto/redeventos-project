-- Listado público de eventos que buscan apoyo (/events).
-- La ficha pública con fecha y lugar sigue en status = public (/agenda, /events/[slug]).

drop policy events_select_anon on public.events;

create policy events_select_anon on public.events
  for select to anon
  using (hidden_at is null and status in ('published', 'public', 'completed'));

drop policy events_select_auth on public.events;

create policy events_select_auth on public.events
  for select to authenticated
  using (
    (select public.is_moderator())
    or (
      hidden_at is null
      and (
        organizer_id = (select auth.uid())
        or status in ('published', 'public', 'completed')
      )
    )
  );

drop policy needs_select_anon on public.event_needs;

create policy needs_select_anon on public.event_needs
  for select to anon
  using (
    exists (
      select 1 from public.events e
      where e.id = event_id
        and e.hidden_at is null
        and e.status in ('published', 'public', 'completed')
    )
  );
