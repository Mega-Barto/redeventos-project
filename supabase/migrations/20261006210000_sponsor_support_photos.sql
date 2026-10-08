-- Fotos de identidad por tipo de apoyo (venue / local sponsor) en ficha pública.

alter table public.profiles
  add column venue_sponsor_photo_path text,
  add column local_sponsor_photo_path text;

comment on column public.profiles.venue_sponsor_photo_path is
  'Foto del espacio/apoyo venue sponsor; bucket profiles.';
comment on column public.profiles.local_sponsor_photo_path is
  'Foto del aporte/emprendimiento local sponsor; bucket profiles.';
