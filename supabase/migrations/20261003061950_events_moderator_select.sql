-- El moderador debe ver borradores y eventos ocultos para listar y gobernar.
-- Antes, hidden_at is null envolvía is_moderator() y escondía lo reportado.

drop policy events_select_auth on public.events;

create policy events_select_auth on public.events
  for select to authenticated
  using (
    (select public.is_moderator())
    or (
      hidden_at is null
      and (
        organizer_id = (select auth.uid())
        or status in ('public', 'completed')
        or (
          status = 'published'
          and exists (
            select 1
            from public.profile_roles r
            where r.profile_id = (select auth.uid())
              and r.role in ('venue_sponsor', 'local_sponsor', 'moderator')
          )
        )
      )
    )
  );
