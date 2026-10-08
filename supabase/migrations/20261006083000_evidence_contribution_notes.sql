-- Notas de evidencia por aporte (necesidad), además del resumen en contributions_note.

alter table public.evidence
  add column contribution_notes jsonb not null default '[]'::jsonb;

alter table public.evidence
  add constraint evidence_contribution_notes_is_array
  check (jsonb_typeof(contribution_notes) = 'array');

comment on column public.evidence.contribution_notes is
  'Array JSON [{ need_id, note }] con el comentario del organizador por cada aporte.';
