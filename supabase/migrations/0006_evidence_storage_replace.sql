-- El organizador puede reemplazar fotos de evidencia del propio evento.
-- La lectura del moderador ya está en 0005 (evidence_storage_select).

create policy evidence_storage_update on storage.objects
  for update to authenticated
  using (
    bucket_id = 'evidence'
    and (storage.foldername(name))[1] in (
      select e.id::text
      from public.events e
      where e.organizer_id = (select auth.uid())
    )
  )
  with check (
    bucket_id = 'evidence'
    and (storage.foldername(name))[1] in (
      select e.id::text
      from public.events e
      where e.organizer_id = (select auth.uid())
    )
  );

create policy evidence_storage_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'evidence'
    and (storage.foldername(name))[1] in (
      select e.id::text
      from public.events e
      where e.organizer_id = (select auth.uid())
    )
  );

create policy media_delete on public.event_media
  for delete to authenticated
  using (
    exists (
      select 1
      from public.events e
      where e.id = event_id
        and e.organizer_id = (select auth.uid())
    )
  );

grant delete on public.event_media to authenticated;
