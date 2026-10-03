-- Población de prueba SOLO local.
-- La corre `supabase db reset` (script `bun run db:seed:local`).
-- No es una migración: `supabase db push` no la aplica al proyecto remoto.
-- No ejecutar este archivo contra una base enlazada o de producción.
-- Contraseña de las cuatro cuentas: piloto-local
--
-- Perfiles (no existe rol `admin`; la administración es el rol `moderator`):
--   ana.organizadora@local.redeventos.test — organizer
--   leo.espacio@local.redeventos.test — venue_sponsor
--   luz.aliada@local.redeventos.test — local_sponsor
--   moda.red@local.redeventos.test — moderator (evidencias, reportes, desafiliación; /app/moderation)
--
-- Fotos: `scripts/seed-local-media.ts` las baja de https://picsum.photos/ y las
-- sube a Storage local (avatares, Casa de Leo, evidencia de Lectura en el centro).

create extension if not exists pgcrypto with schema extensions;

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  email_change_token_current,
  reauthentication_token,
  is_sso_user,
  is_anonymous
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-4111-8111-111111111111',
    'authenticated',
    'authenticated',
    'ana.organizadora@local.redeventos.test',
    extensions.crypt('piloto-local', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Ana Organizadora"}',
    now(),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    false,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-8222-222222222222',
    'authenticated',
    'authenticated',
    'leo.espacio@local.redeventos.test',
    extensions.crypt('piloto-local', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Leo Espacio"}',
    now(),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    false,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-4333-8333-333333333333',
    'authenticated',
    'authenticated',
    'luz.aliada@local.redeventos.test',
    extensions.crypt('piloto-local', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Luz Aliada"}',
    now(),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    false,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '44444444-4444-4444-8444-444444444444',
    'authenticated',
    'authenticated',
    'moda.red@local.redeventos.test',
    extensions.crypt('piloto-local', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Moda Moderadora"}',
    now(),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    false,
    false
  );

insert into auth.identities (user_id, provider, provider_id, identity_data, last_sign_in_at, created_at, updated_at)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'email',
    '11111111-1111-4111-8111-111111111111',
    '{"sub":"11111111-1111-4111-8111-111111111111","email":"ana.organizadora@local.redeventos.test"}',
    now(),
    now(),
    now()
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'email',
    '22222222-2222-4222-8222-222222222222',
    '{"sub":"22222222-2222-4222-8222-222222222222","email":"leo.espacio@local.redeventos.test"}',
    now(),
    now(),
    now()
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'email',
    '33333333-3333-4333-8333-333333333333',
    '{"sub":"33333333-3333-4333-8333-333333333333","email":"luz.aliada@local.redeventos.test"}',
    now(),
    now(),
    now()
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'email',
    '44444444-4444-4444-8444-444444444444',
    '{"sub":"44444444-4444-4444-8444-444444444444","email":"moda.red@local.redeventos.test"}',
    now(),
    now(),
    now()
  );

update public.profiles
set
  city = 'pereira',
  instagram = 'anaorganizadora'
where id = '11111111-1111-4111-8111-111111111111';

update public.profiles
set city = 'pereira'
where id = '22222222-2222-4222-8222-222222222222';

update public.profiles
set
  city = 'dosquebradas',
  contribution_types = array['food']::public.need_type[],
  contribution_description = 'Almuerzo sencillo para encuentros de hasta cuarenta personas.'
where id = '33333333-3333-4333-8333-333333333333';

update public.profiles
set city = 'pereira'
where id = '44444444-4444-4444-8444-444444444444';

update public.profile_direct_contacts
set whatsapp = '+573001112233', phone = '+576061112233'
where profile_id = '11111111-1111-4111-8111-111111111111';

update public.profile_direct_contacts
set whatsapp = '+573004445566', phone = '+576064445566'
where profile_id = '22222222-2222-4222-8222-222222222222';

update public.profile_direct_contacts
set whatsapp = '+573007778899', phone = '+576067778899'
where profile_id = '33333333-3333-4333-8333-333333333333';

insert into public.profile_roles (profile_id, role)
values
  ('11111111-1111-4111-8111-111111111111', 'organizer'),
  ('22222222-2222-4222-8222-222222222222', 'venue_sponsor'),
  ('33333333-3333-4333-8333-333333333333', 'local_sponsor'),
  ('44444444-4444-4444-8444-444444444444', 'moderator');

insert into public.registration_commitments (profile_id, privacy_version, commitment_version)
values
  ('11111111-1111-4111-8111-111111111111', '2026-09', '2026-09'),
  ('22222222-2222-4222-8222-222222222222', '2026-09', '2026-09'),
  ('33333333-3333-4333-8333-333333333333', '2026-09', '2026-09'),
  ('44444444-4444-4444-8444-444444444444', '2026-09', '2026-09');

insert into public.venues (id, owner_id, name, slug, city, zone, capacity, equipment, support_mode, description)
values (
  '99999999-9999-4999-8999-999999999999',
  '22222222-2222-4222-8222-222222222222',
  'Casa de Leo',
  'casa-de-leo',
  'pereira',
  'Centro',
  40,
  'Sillas, mesas y un proyector.',
  'free',
  'Sala en el centro de Pereira para encuentros gratuitos de hasta cuarenta personas.'
);

insert into public.events (
  id,
  organizer_id,
  title,
  slug,
  category,
  city,
  starts_on,
  expected_attendees,
  description,
  audience,
  sponsor_benefit,
  rsvp_url,
  place_name,
  venue_id,
  status
)
values (
  '55555555-5555-4555-8555-555555555555',
  '11111111-1111-4111-8111-111111111111',
  'Lectura en el centro',
  'lectura-en-el-centro',
  'literatura',
  'pereira',
  '2026-11-14',
  40,
  'Encuentro de lectura en voz alta para la comunidad del centro de Pereira.',
  'Personas lectoras del centro, sin costo de entrada.',
  'Mención en la apertura y en la ficha pública del evento.',
  'https://example.com/rsvp-lectura',
  'Casa de Leo',
  '99999999-9999-4999-8999-999999999999',
  'public'
);

insert into public.events (
  id,
  organizer_id,
  title,
  slug,
  category,
  city,
  date_range_label,
  expected_attendees,
  description,
  audience,
  sponsor_benefit,
  rsvp_url,
  status
)
values (
  '66666666-6666-4666-8666-666666666666',
  '11111111-1111-4111-8111-111111111111',
  'Taller de cuento',
  'taller-de-cuento',
  'literatura',
  'dosquebradas',
  'Noviembre 2026',
  20,
  'Borrador de un taller corto de cuento, todavía sin fecha concreta ni lugar.',
  'Jóvenes que escriben en Dosquebradas.',
  'Crédito como aliado cuando el taller tenga ficha pública.',
  'https://example.com/rsvp-cuento',
  'draft'
);

insert into public.event_needs (
  id,
  event_id,
  type,
  description,
  quantity_requested,
  quantity_covered,
  unit,
  status
)
values
  (
    '77777777-7777-4777-8777-777777777777',
    '55555555-5555-4555-8555-555555555555',
    'venue',
    'Sala para cuarenta personas',
    1,
    1,
    'espacio',
    'covered'
  ),
  (
    '88888888-8888-4888-8888-888888888888',
    '55555555-5555-4555-8555-555555555555',
    'food',
    'Refrigerio para quienes asistan',
    40,
    0,
    'porciones',
    'open'
  );

insert into public.offers (
  id,
  event_need_id,
  event_id,
  proposer_id,
  recipient_id,
  venue_id,
  quantity,
  offer_on,
  note,
  status
)
values
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '77777777-7777-4777-8777-777777777777',
    '55555555-5555-4555-8555-555555555555',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    '99999999-9999-4999-8999-999999999999',
    1,
    '2026-11-14',
    'La sala del centro, sin costo para este encuentro.',
    'accepted'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '88888888-8888-4888-8888-888888888888',
    '55555555-5555-4555-8555-555555555555',
    '33333333-3333-4333-8333-333333333333',
    '11111111-1111-4111-8111-111111111111',
    null,
    40,
    '2026-11-14',
    'Cuarenta porciones de refrigerio para la lectura.',
    'pending'
  );

insert into public.matches (id, offer_id, event_need_id, event_id, organizer_id, sponsor_id, status)
values (
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  '77777777-7777-4777-8777-777777777777',
  '55555555-5555-4555-8555-555555555555',
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
  'accepted'
);

insert into public.match_commitments (match_id, what, quantity, when_on)
values (
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  'Sala para cuarenta personas',
  1,
  '2026-11-14'
);

insert into public.evidence (event_id, submitted_by, attendance_count, venue_note, contributions_note, status)
values (
  '55555555-5555-4555-8555-555555555555',
  '11111111-1111-4111-8111-111111111111',
  36,
  'La lectura ocurrió en Casa de Leo, en el centro.',
  'El espacio lo cubrió Leo. El refrigerio sigue pendiente de confirmar.',
  'submitted'
);
