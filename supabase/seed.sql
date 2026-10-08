-- Población de prueba SOLO local (visión primer mes: docs/summary.md).
-- La corre `supabase db reset` / `bun run db:seed:local`.
-- No es una migración: `supabase db push` no la aplica al remoto.
-- Contraseña de todas las cuentas: piloto-local
--
-- Objetivos del seed (primer mes):
--   ~10 eventos en pipeline (published / public / completed)
--   5 venues activos
--   ≥3 local sponsors
--   4 eventos realizados con evidencia aprobada (+ 1 evidencia pendiente de moderación)
--
-- Cuentas:
--   ana.organizadora@local.redeventos.test     organizer
--   camilo.organizador@local.redeventos.test   organizer
--   diana.organizadora@local.redeventos.test   organizer
--   leo.espacio@local.redeventos.test          venue_sponsor (2 espacios)
--   sofia.espacio@local.redeventos.test        venue_sponsor
--   mateo.espacio@local.redeventos.test        venue_sponsor
--   valentina.espacio@local.redeventos.test    venue_sponsor
--   luz.aliada@local.redeventos.test           local_sponsor (food)
--   nora.aliada@local.redeventos.test          local_sponsor (products, diffusion)
--   andres.aliado@local.redeventos.test        local_sponsor (equipment, services)
--   moda.red@local.redeventos.test             moderator
--
-- Fotos: `scripts/seed-local-media.ts` (Picsum → Storage local).

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Auth users
-- ---------------------------------------------------------------------------
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  email_change_token_current, reauthentication_token, is_sso_user, is_anonymous
)
values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-4111-8111-111111111111', 'authenticated', 'authenticated',
   'ana.organizadora@local.redeventos.test', extensions.crypt('piloto-local', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"display_name":"Ana Organizadora"}', now(), now(),
   '', '', '', '', '', '', false, false),
  ('00000000-0000-0000-0000-000000000000', 'a1111111-1111-4111-8111-111111111112', 'authenticated', 'authenticated',
   'camilo.organizador@local.redeventos.test', extensions.crypt('piloto-local', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"display_name":"Camilo Organizador"}', now(), now(),
   '', '', '', '', '', '', false, false),
  ('00000000-0000-0000-0000-000000000000', 'a1111111-1111-4111-8111-111111111113', 'authenticated', 'authenticated',
   'diana.organizadora@local.redeventos.test', extensions.crypt('piloto-local', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"display_name":"Diana Organizadora"}', now(), now(),
   '', '', '', '', '', '', false, false),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-4222-8222-222222222222', 'authenticated', 'authenticated',
   'leo.espacio@local.redeventos.test', extensions.crypt('piloto-local', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"display_name":"Leo Espacio"}', now(), now(),
   '', '', '', '', '', '', false, false),
  ('00000000-0000-0000-0000-000000000000', 'b2222222-2222-4222-8222-222222222223', 'authenticated', 'authenticated',
   'sofia.espacio@local.redeventos.test', extensions.crypt('piloto-local', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"display_name":"Sofía Espacio"}', now(), now(),
   '', '', '', '', '', '', false, false),
  ('00000000-0000-0000-0000-000000000000', 'b2222222-2222-4222-8222-222222222224', 'authenticated', 'authenticated',
   'mateo.espacio@local.redeventos.test', extensions.crypt('piloto-local', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"display_name":"Mateo Espacio"}', now(), now(),
   '', '', '', '', '', '', false, false),
  ('00000000-0000-0000-0000-000000000000', 'b2222222-2222-4222-8222-222222222225', 'authenticated', 'authenticated',
   'valentina.espacio@local.redeventos.test', extensions.crypt('piloto-local', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"display_name":"Valentina Espacio"}', now(), now(),
   '', '', '', '', '', '', false, false),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-4333-8333-333333333333', 'authenticated', 'authenticated',
   'luz.aliada@local.redeventos.test', extensions.crypt('piloto-local', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"display_name":"Luz Aliada"}', now(), now(),
   '', '', '', '', '', '', false, false),
  ('00000000-0000-0000-0000-000000000000', 'c3333333-3333-4333-8333-333333333334', 'authenticated', 'authenticated',
   'nora.aliada@local.redeventos.test', extensions.crypt('piloto-local', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"display_name":"Nora Aliada"}', now(), now(),
   '', '', '', '', '', '', false, false),
  ('00000000-0000-0000-0000-000000000000', 'c3333333-3333-4333-8333-333333333335', 'authenticated', 'authenticated',
   'andres.aliado@local.redeventos.test', extensions.crypt('piloto-local', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"display_name":"Andrés Aliado"}', now(), now(),
   '', '', '', '', '', '', false, false),
  ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-8444-444444444444', 'authenticated', 'authenticated',
   'moda.red@local.redeventos.test', extensions.crypt('piloto-local', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"display_name":"Moda Moderadora"}', now(), now(),
   '', '', '', '', '', '', false, false);

insert into auth.identities (user_id, provider, provider_id, identity_data, last_sign_in_at, created_at, updated_at)
select
  u.id,
  'email',
  u.id::text,
  jsonb_build_object('sub', u.id::text, 'email', u.email),
  now(),
  now(),
  now()
from auth.users u
where u.email like '%@local.redeventos.test';

-- ---------------------------------------------------------------------------
-- Perfiles, contactos, roles, compromiso
-- ---------------------------------------------------------------------------
update public.profiles set city = 'pereira', instagram = 'anaorganizadora'
where id = '11111111-1111-4111-8111-111111111111';
update public.profiles set city = 'pereira', instagram = 'camilo.events'
where id = 'a1111111-1111-4111-8111-111111111112';
update public.profiles set city = 'dosquebradas', instagram = 'diana.cultura'
where id = 'a1111111-1111-4111-8111-111111111113';
update public.profiles set city = 'pereira', website = 'https://example.com/casa-de-leo'
where id = '22222222-2222-4222-8222-222222222222';
update public.profiles set city = 'dosquebradas', website = 'https://example.com/cafe-sofia'
where id = 'b2222222-2222-4222-8222-222222222223';
update public.profiles set city = 'pereira', website = 'https://example.com/salon-mateo'
where id = 'b2222222-2222-4222-8222-222222222224';
update public.profiles set city = 'dosquebradas', website = 'https://example.com/terraza-valentina'
where id = 'b2222222-2222-4222-8222-222222222225';
update public.profiles set
  city = 'dosquebradas',
  contribution_types = array['food']::public.need_type[],
  contribution_description = 'Refrigerios y almuerzo sencillo para encuentros de hasta cuarenta personas.'
where id = '33333333-3333-4333-8333-333333333333';
update public.profiles set
  city = 'pereira',
  contribution_types = array['products', 'diffusion']::public.need_type[],
  contribution_description = 'Materiales impresos, stickers y difusión en Instagram local.'
where id = 'c3333333-3333-4333-8333-333333333334';
update public.profiles set
  city = 'pereira',
  contribution_types = array['equipment', 'services']::public.need_type[],
  contribution_description = 'Sonido portátil, proyector y apoyo técnico el día del evento.'
where id = 'c3333333-3333-4333-8333-333333333335';
update public.profiles set city = 'pereira'
where id = '44444444-4444-4444-8444-444444444444';

update public.profile_direct_contacts set whatsapp = '+573001112233', phone = '+576061112233'
where profile_id = '11111111-1111-4111-8111-111111111111';
update public.profile_direct_contacts set whatsapp = '+573001112234', phone = '+576061112234'
where profile_id = 'a1111111-1111-4111-8111-111111111112';
update public.profile_direct_contacts set whatsapp = '+573001112235', phone = '+576061112235'
where profile_id = 'a1111111-1111-4111-8111-111111111113';
update public.profile_direct_contacts set whatsapp = '+573004445566', phone = '+576064445566'
where profile_id = '22222222-2222-4222-8222-222222222222';
update public.profile_direct_contacts set whatsapp = '+573004445567', phone = '+576064445567'
where profile_id = 'b2222222-2222-4222-8222-222222222223';
update public.profile_direct_contacts set whatsapp = '+573004445568', phone = '+576064445568'
where profile_id = 'b2222222-2222-4222-8222-222222222224';
update public.profile_direct_contacts set whatsapp = '+573004445569', phone = '+576064445569'
where profile_id = 'b2222222-2222-4222-8222-222222222225';
update public.profile_direct_contacts set whatsapp = '+573007778899', phone = '+576067778899'
where profile_id = '33333333-3333-4333-8333-333333333333';
update public.profile_direct_contacts set whatsapp = '+573007778800', phone = '+576067778800'
where profile_id = 'c3333333-3333-4333-8333-333333333334';
update public.profile_direct_contacts set whatsapp = '+573007778801', phone = '+576067778801'
where profile_id = 'c3333333-3333-4333-8333-333333333335';

insert into public.profile_roles (profile_id, role)
values
  ('11111111-1111-4111-8111-111111111111', 'organizer'),
  ('a1111111-1111-4111-8111-111111111112', 'organizer'),
  ('a1111111-1111-4111-8111-111111111113', 'organizer'),
  ('22222222-2222-4222-8222-222222222222', 'venue_sponsor'),
  ('b2222222-2222-4222-8222-222222222223', 'venue_sponsor'),
  ('b2222222-2222-4222-8222-222222222224', 'venue_sponsor'),
  ('b2222222-2222-4222-8222-222222222225', 'venue_sponsor'),
  ('33333333-3333-4333-8333-333333333333', 'local_sponsor'),
  ('c3333333-3333-4333-8333-333333333334', 'local_sponsor'),
  ('c3333333-3333-4333-8333-333333333335', 'local_sponsor'),
  ('44444444-4444-4444-8444-444444444444', 'moderator');

insert into public.registration_commitments (profile_id, privacy_version, commitment_version)
select id, '2026-09', '2026-09'
from public.profiles
where email like '%@local.redeventos.test';

-- ---------------------------------------------------------------------------
-- 5 venues activos
-- ---------------------------------------------------------------------------
insert into public.venues (id, owner_id, name, slug, city, zone, capacity, equipment, support_mode, description)
values
  (
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
  ),
  (
    'd9999999-9999-4999-8999-999999999991',
    '22222222-2222-4222-8222-222222222222',
    'Patio Leo',
    'patio-leo',
    'pereira',
    'Cuba',
    60,
    'Sonido básico y luces de patio.',
    'depends',
    'Patio techado para jams, cine al aire libre y ferias pequeñas.'
  ),
  (
    'd9999999-9999-4999-8999-999999999992',
    'b2222222-2222-4222-8222-222222222223',
    'Café Sofía',
    'cafe-sofia',
    'dosquebradas',
    'La Popa',
    30,
    'Mesas, wifi y una pantalla.',
    'free',
    'Café de barrio en Dosquebradas para charlas y networking.'
  ),
  (
    'd9999999-9999-4999-8999-999999999993',
    'b2222222-2222-4222-8222-222222222224',
    'Salón Mateo',
    'salon-mateo',
    'pereira',
    'El Lago',
    80,
    'Proyector, micrófonos y aire acondicionado.',
    'depends',
    'Salón para meetups de tecnología y talleres de medio día.'
  ),
  (
    'd9999999-9999-4999-8999-999999999994',
    'b2222222-2222-4222-8222-222222222225',
    'Terraza Valentina',
    'terraza-valentina',
    'dosquebradas',
    'Santa Isabel',
    50,
    'Pantalla exterior y cableado para proyector.',
    'free',
    'Terraza con vista para cine, música acústica y encuentros culturales.'
  );

-- ---------------------------------------------------------------------------
-- Eventos (~10 en pipeline + 1 borrador)
-- ---------------------------------------------------------------------------
insert into public.events (
  id, organizer_id, title, slug, category, city, starts_on, date_range_label,
  expected_attendees, description, audience, sponsor_benefit, rsvp_url,
  place_name, venue_id, status
)
values
  -- 1) public + evidencia pendiente (cola de moderación)
  (
    '55555555-5555-4555-8555-555555555555',
    '11111111-1111-4111-8111-111111111111',
    'Lectura en el centro',
    'lectura-en-el-centro',
    'literatura',
    'pereira',
    '2026-10-04',
    null,
    40,
    'Encuentro de lectura en voz alta para la comunidad del centro de Pereira.',
    'Personas lectoras del centro, sin costo de entrada.',
    'Mención en la apertura y en la ficha pública del evento.',
    'https://example.com/rsvp-lectura',
    'Casa de Leo',
    '99999999-9999-4999-8999-999999999999',
    'public'
  ),
  -- 2–5) completed con evidencia aprobada (casos de éxito)
  (
    'e5555555-5555-4555-8555-555555555501',
    'a1111111-1111-4111-8111-111111111112',
    'Meetup Tech Pereira',
    'meetup-tech-pereira',
    'tecnologia',
    'pereira',
    '2026-09-20',
    null,
    55,
    'Charlas cortas sobre desarrollo web y comunidad tech en Pereira.',
    'Desarrolladores y estudiantes de tecnología.',
    'Logo en pantalla de apertura y mención en redes del meetup.',
    'https://example.com/rsvp-meetup-tech',
    'Salón Mateo',
    'd9999999-9999-4999-8999-999999999993',
    'completed'
  ),
  (
    'e5555555-5555-4555-8555-555555555502',
    'a1111111-1111-4111-8111-111111111113',
    'Cine al atardecer',
    'cine-al-atardecer',
    'cine',
    'dosquebradas',
    '2026-09-27',
    null,
    45,
    'Proyección gratuita de un cortometraje colombiano en terraza.',
    'Vecinos de Dosquebradas y amantes del cine independiente.',
    'Crédito en la cartelería y en la ficha pública.',
    'https://example.com/rsvp-cine',
    'Terraza Valentina',
    'd9999999-9999-4999-8999-999999999994',
    'completed'
  ),
  (
    'e5555555-5555-4555-8555-555555555503',
    '11111111-1111-4111-8111-111111111111',
    'Networking emprendedores',
    'networking-emprendedores',
    'emprendimiento',
    'dosquebradas',
    '2026-09-13',
    null,
    30,
    'Ronda de presentaciones de emprendimientos locales en un café.',
    'Emprendedores en etapa temprana de Dosquebradas.',
    'Mesa de materiales del aliado y mención en el cierre.',
    'https://example.com/rsvp-networking',
    'Café Sofía',
    'd9999999-9999-4999-8999-999999999992',
    'completed'
  ),
  (
    'e5555555-5555-4555-8555-555555555504',
    'a1111111-1111-4111-8111-111111111112',
    'Jam de patio',
    'jam-de-patio',
    'musica',
    'pereira',
    '2026-09-06',
    null,
    50,
    'Sesión abierta de improvisación musical en patio techado.',
    'Músicos aficionados y público general sin costo.',
    'Presencia de marca en el escenario improvisado.',
    'https://example.com/rsvp-jam',
    'Patio Leo',
    'd9999999-9999-4999-8999-999999999991',
    'completed'
  ),
  -- 6) public con match de espacio; aporte local aún abierto
  (
    'e5555555-5555-4555-8555-555555555506',
    'a1111111-1111-4111-8111-111111111113',
    'Taller de cuento',
    'taller-de-cuento',
    'literatura',
    'dosquebradas',
    '2026-10-18',
    null,
    20,
    'Taller corto de cuento para jóvenes que escriben en Dosquebradas.',
    'Jóvenes que escriben en Dosquebradas.',
    'Crédito como aliado en la ficha pública.',
    'https://example.com/rsvp-cuento',
    'Café Sofía',
    'd9999999-9999-4999-8999-999999999992',
    'public'
  ),
  -- 7–10) published buscando aportes
  (
    'e5555555-5555-4555-8555-555555555507',
    'a1111111-1111-4111-8111-111111111112',
    'Hackatón comunitaria',
    'hackaton-comunitaria',
    'tecnologia',
    'pereira',
    null,
    'Octubre 2026',
    70,
    'Hackatón de un día para prototipar soluciones barriales con datos abiertos.',
    'Equipos mixtos de estudiantes y vecinos.',
    'Stand de aliados y mención en el demo day.',
    'https://example.com/rsvp-hackaton',
    null,
    null,
    'published'
  ),
  (
    'e5555555-5555-4555-8555-555555555508',
    '11111111-1111-4111-8111-111111111111',
    'Conversatorio de comunidades',
    'conversatorio-comunidades',
    'comunidades',
    'pereira',
    null,
    'Noviembre 2026',
    35,
    'Mesa redonda sobre trabajo comunitario en Pereira y Dosquebradas.',
    'Líderes barriales y colectivos locales.',
    'Logo en el programa impreso.',
    'https://example.com/rsvp-conversatorio',
    null,
    null,
    'published'
  ),
  (
    'e5555555-5555-4555-8555-555555555509',
    'a1111111-1111-4111-8111-111111111113',
    'Charla de educación popular',
    'charla-educacion-popular',
    'educacion',
    'dosquebradas',
    null,
    'Noviembre 2026',
    40,
    'Charla abierta sobre prácticas de educación popular en el Eje Cafetero.',
    'Docentes, estudiantes y familias.',
    'Mención en la invitación y en redes del evento.',
    'https://example.com/rsvp-educacion',
    null,
    null,
    'published'
  ),
  (
    'e5555555-5555-4555-8555-555555555510',
    'a1111111-1111-4111-8111-111111111112',
    'Showcase cultural Cuba',
    'showcase-cultural-cuba',
    'cultura',
    'pereira',
    null,
    'Fin de octubre 2026',
    60,
    'Muestra de colectivos culturales del sector Cuba con stands y mini-conciertos.',
    'Vecinos del sector Cuba y visitantes de la ciudad.',
    'Espacio de activación para el aliado local.',
    'https://example.com/rsvp-showcase',
    null,
    null,
    'published'
  ),
  -- borrador
  (
    '66666666-6666-4666-8666-666666666666',
    '11111111-1111-4111-8111-111111111111',
    'Club de lectura infantil',
    'club-lectura-infantil',
    'literatura',
    'pereira',
    null,
    'Por definir 2026',
    25,
    'Borrador de un club de lectura para niños; aún sin fecha ni lugar.',
    'Familias del centro de Pereira.',
    'Crédito como aliado cuando tenga ficha pública.',
    'https://example.com/rsvp-club-infantil',
    null,
    null,
    'draft'
  );

-- ---------------------------------------------------------------------------
-- Necesidades
-- ---------------------------------------------------------------------------
insert into public.event_needs (
  id, event_id, type, description, quantity_requested, quantity_covered, unit, status
)
values
  -- Lectura (public, evidencia pendiente): espacio cubierto, refrigerio no cubierto
  ('77777777-7777-4777-8777-777777777777', '55555555-5555-4555-8555-555555555555',
   'venue', 'Sala para cuarenta personas', 1, 1, 'espacio', 'covered'),
  ('88888888-8888-4888-8888-888888888888', '55555555-5555-4555-8555-555555555555',
   'food', 'Refrigerio para quienes asistan', 40, 0, 'porciones', 'open'),

  -- Meetup Tech (completed)
  ('15555555-5555-4555-8555-555555555701', 'e5555555-5555-4555-8555-555555555501',
   'venue', 'Salón para cincuenta personas', 1, 1, 'espacio', 'covered'),
  ('15555555-5555-4555-8555-555555555702', 'e5555555-5555-4555-8555-555555555501',
   'equipment', 'Proyector y micrófono', 1, 1, 'kit', 'covered'),
  ('15555555-5555-4555-8555-555555555703', 'e5555555-5555-4555-8555-555555555501',
   'food', 'Café y galletas', 55, 55, 'porciones', 'covered'),

  -- Cine (completed)
  ('15555555-5555-4555-8555-555555555704', 'e5555555-5555-4555-8555-555555555502',
   'venue', 'Terraza con proyector', 1, 1, 'espacio', 'covered'),
  ('15555555-5555-4555-8555-555555555705', 'e5555555-5555-4555-8555-555555555502',
   'diffusion', 'Historas impresas del cortometraje', 80, 80, 'flyers', 'covered'),

  -- Networking (completed)
  ('15555555-5555-4555-8555-555555555706', 'e5555555-5555-4555-8555-555555555503',
   'venue', 'Café para treinta personas', 1, 1, 'espacio', 'covered'),
  ('15555555-5555-4555-8555-555555555707', 'e5555555-5555-4555-8555-555555555503',
   'products', 'Stickers y material de mesa', 30, 30, 'kits', 'covered'),

  -- Jam (completed)
  ('15555555-5555-4555-8555-555555555708', 'e5555555-5555-4555-8555-555555555504',
   'venue', 'Patio techado para jam', 1, 1, 'espacio', 'covered'),
  ('15555555-5555-4555-8555-555555555709', 'e5555555-5555-4555-8555-555555555504',
   'equipment', 'Sonido portátil', 1, 1, 'kit', 'covered'),
  ('15555555-5555-4555-8555-555555555710', 'e5555555-5555-4555-8555-555555555504',
   'food', 'Agua y refrigerio ligero', 50, 30, 'porciones', 'partial'),

  -- Taller de cuento (public)
  ('15555555-5555-4555-8555-555555555711', 'e5555555-5555-4555-8555-555555555506',
   'venue', 'Sala íntima para taller', 1, 1, 'espacio', 'covered'),
  ('15555555-5555-4555-8555-555555555712', 'e5555555-5555-4555-8555-555555555506',
   'food', 'Refrigerio para veinte', 20, 0, 'porciones', 'open'),

  -- Hackatón (published)
  ('15555555-5555-4555-8555-555555555713', 'e5555555-5555-4555-8555-555555555507',
   'venue', 'Salón para setenta personas', 1, 0, 'espacio', 'open'),
  ('15555555-5555-4555-8555-555555555714', 'e5555555-5555-4555-8555-555555555507',
   'equipment', 'Extensiones y proyectores', 2, 0, 'kits', 'open'),
  ('15555555-5555-4555-8555-555555555715', 'e5555555-5555-4555-8555-555555555507',
   'food', 'Almuerzo sencillo', 70, 0, 'porciones', 'open'),

  -- Conversatorio (published)
  ('15555555-5555-4555-8555-555555555716', 'e5555555-5555-4555-8555-555555555508',
   'venue', 'Sala para mesa redonda', 1, 0, 'espacio', 'open'),
  ('15555555-5555-4555-8555-555555555717', 'e5555555-5555-4555-8555-555555555508',
   'diffusion', 'Difusión en Instagram local', null, 0, null, 'open'),

  -- Charla educación (published)
  ('15555555-5555-4555-8555-555555555718', 'e5555555-5555-4555-8555-555555555509',
   'venue', 'Espacio para cuarenta asistentes', 1, 0, 'espacio', 'open'),
  ('15555555-5555-4555-8555-555555555719', 'e5555555-5555-4555-8555-555555555509',
   'services', 'Facilitación gráfica del conversatorio', 1, 0, 'servicio', 'open'),

  -- Showcase (published)
  ('15555555-5555-4555-8555-555555555720', 'e5555555-5555-4555-8555-555555555510',
   'venue', 'Patio o terraza para muestra', 1, 0, 'espacio', 'open'),
  ('15555555-5555-4555-8555-555555555721', 'e5555555-5555-4555-8555-555555555510',
   'products', 'Materiales para stands', 10, 0, 'kits', 'open'),
  ('15555555-5555-4555-8555-555555555722', 'e5555555-5555-4555-8555-555555555510',
   'diffusion', 'Pauta orgánica en redes locales', null, 0, null, 'open');

-- ---------------------------------------------------------------------------
-- Ofertas, matches y compromisos
-- ---------------------------------------------------------------------------
insert into public.offers (
  id, event_need_id, event_id, proposer_id, recipient_id, venue_id, quantity, offer_on, note, status
)
values
  -- Lectura
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '77777777-7777-4777-8777-777777777777',
   '55555555-5555-4555-8555-555555555555', '22222222-2222-4222-8222-222222222222',
   '11111111-1111-4111-8111-111111111111', '99999999-9999-4999-8999-999999999999',
   1, '2026-10-04', 'La sala del centro, sin costo para este encuentro.', 'accepted'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '88888888-8888-4888-8888-888888888888',
   '55555555-5555-4555-8555-555555555555', '33333333-3333-4333-8333-333333333333',
   '11111111-1111-4111-8111-111111111111', null,
   40, '2026-10-04', 'Cuarenta porciones de refrigerio para la lectura.', 'pending'),

  -- Meetup Tech
  ('05555555-5555-4555-8555-555555555801', '15555555-5555-4555-8555-555555555701',
   'e5555555-5555-4555-8555-555555555501', 'b2222222-2222-4222-8222-222222222224',
   'a1111111-1111-4111-8111-111111111112', 'd9999999-9999-4999-8999-999999999993',
   1, '2026-09-20', 'Salón Mateo disponible todo el sábado.', 'accepted'),
  ('05555555-5555-4555-8555-555555555802', '15555555-5555-4555-8555-555555555702',
   'e5555555-5555-4555-8555-555555555501', 'c3333333-3333-4333-8333-333333333335',
   'a1111111-1111-4111-8111-111111111112', null,
   1, '2026-09-20', 'Llevo proyector, micrófono y cable HDMI.', 'accepted'),
  ('05555555-5555-4555-8555-555555555803', '15555555-5555-4555-8555-555555555703',
   'e5555555-5555-4555-8555-555555555501', '33333333-3333-4333-8333-333333333333',
   'a1111111-1111-4111-8111-111111111112', null,
   55, '2026-09-20', 'Café y galletas para el coffee break.', 'accepted'),

  -- Cine
  ('05555555-5555-4555-8555-555555555804', '15555555-5555-4555-8555-555555555704',
   'e5555555-5555-4555-8555-555555555502', 'b2222222-2222-4222-8222-222222222225',
   'a1111111-1111-4111-8111-111111111113', 'd9999999-9999-4999-8999-999999999994',
   1, '2026-09-27', 'Terraza lista desde las 4 p. m.', 'accepted'),
  ('05555555-5555-4555-8555-555555555805', '15555555-5555-4555-8555-555555555705',
   'e5555555-5555-4555-8555-555555555502', 'c3333333-3333-4333-8333-333333333334',
   'a1111111-1111-4111-8111-111111111113', null,
   80, '2026-09-27', 'Imprimo y reparto ochenta flyers en La Popa.', 'accepted'),

  -- Networking
  ('05555555-5555-4555-8555-555555555806', '15555555-5555-4555-8555-555555555706',
   'e5555555-5555-4555-8555-555555555503', 'b2222222-2222-4222-8222-222222222223',
   '11111111-1111-4111-8111-111111111111', 'd9999999-9999-4999-8999-999999999992',
   1, '2026-09-13', 'Reservamos el salón del café esa tarde.', 'accepted'),
  ('05555555-5555-4555-8555-555555555807', '15555555-5555-4555-8555-555555555707',
   'e5555555-5555-4555-8555-555555555503', 'c3333333-3333-4333-8333-333333333334',
   '11111111-1111-4111-8111-111111111111', null,
   30, '2026-09-13', 'Kits de stickers y tarjetas para cada mesa.', 'accepted'),

  -- Jam
  ('05555555-5555-4555-8555-555555555808', '15555555-5555-4555-8555-555555555708',
   'e5555555-5555-4555-8555-555555555504', '22222222-2222-4222-8222-222222222222',
   'a1111111-1111-4111-8111-111111111112', 'd9999999-9999-4999-8999-999999999991',
   1, '2026-09-06', 'Patio Leo abierto para la jam.', 'accepted'),
  ('05555555-5555-4555-8555-555555555809', '15555555-5555-4555-8555-555555555709',
   'e5555555-5555-4555-8555-555555555504', 'c3333333-3333-4333-8333-333333333335',
   'a1111111-1111-4111-8111-111111111112', null,
   1, '2026-09-06', 'Llevo caja de sonido y dos micrófonos.', 'accepted'),
  ('05555555-5555-4555-8555-555555555810', '15555555-5555-4555-8555-555555555710',
   'e5555555-5555-4555-8555-555555555504', '33333333-3333-4333-8333-333333333333',
   'a1111111-1111-4111-8111-111111111112', null,
   30, '2026-09-06', 'Treinta refrigerios; el resto lo resolvemos en sitio.', 'accepted'),

  -- Taller de cuento
  ('05555555-5555-4555-8555-555555555811', '15555555-5555-4555-8555-555555555711',
   'e5555555-5555-4555-8555-555555555506', 'b2222222-2222-4222-8222-222222222223',
   'a1111111-1111-4111-8111-111111111113', 'd9999999-9999-4999-8999-999999999992',
   1, '2026-10-18', 'Mesa del fondo del café para el taller.', 'accepted'),
  ('05555555-5555-4555-8555-555555555812', '15555555-5555-4555-8555-555555555712',
   'e5555555-5555-4555-8555-555555555506', '33333333-3333-4333-8333-333333333333',
   'a1111111-1111-4111-8111-111111111113', null,
   20, '2026-10-18', 'Puedo llevar veinte refrigerios si confirman el cupo.', 'pending'),

  -- Hackatón: propuesta de espacio pendiente
  ('05555555-5555-4555-8555-555555555813', '15555555-5555-4555-8555-555555555713',
   'e5555555-5555-4555-8555-555555555507', 'b2222222-2222-4222-8222-222222222224',
   'a1111111-1111-4111-8111-111111111112', 'd9999999-9999-4999-8999-999999999993',
   1, '2026-10-25', 'Salón Mateo libre ese sábado si cierran antes de las 6.', 'pending');

insert into public.matches (id, offer_id, event_need_id, event_id, organizer_id, sponsor_id, status)
values
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
   '77777777-7777-4777-8777-777777777777', '55555555-5555-4555-8555-555555555555',
   '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', 'accepted'),

  ('f5555555-5555-4555-8555-555555555901', '05555555-5555-4555-8555-555555555801',
   '15555555-5555-4555-8555-555555555701', 'e5555555-5555-4555-8555-555555555501',
   'a1111111-1111-4111-8111-111111111112', 'b2222222-2222-4222-8222-222222222224', 'completed'),
  ('f5555555-5555-4555-8555-555555555902', '05555555-5555-4555-8555-555555555802',
   '15555555-5555-4555-8555-555555555702', 'e5555555-5555-4555-8555-555555555501',
   'a1111111-1111-4111-8111-111111111112', 'c3333333-3333-4333-8333-333333333335', 'completed'),
  ('f5555555-5555-4555-8555-555555555903', '05555555-5555-4555-8555-555555555803',
   '15555555-5555-4555-8555-555555555703', 'e5555555-5555-4555-8555-555555555501',
   'a1111111-1111-4111-8111-111111111112', '33333333-3333-4333-8333-333333333333', 'completed'),

  ('f5555555-5555-4555-8555-555555555904', '05555555-5555-4555-8555-555555555804',
   '15555555-5555-4555-8555-555555555704', 'e5555555-5555-4555-8555-555555555502',
   'a1111111-1111-4111-8111-111111111113', 'b2222222-2222-4222-8222-222222222225', 'completed'),
  ('f5555555-5555-4555-8555-555555555905', '05555555-5555-4555-8555-555555555805',
   '15555555-5555-4555-8555-555555555705', 'e5555555-5555-4555-8555-555555555502',
   'a1111111-1111-4111-8111-111111111113', 'c3333333-3333-4333-8333-333333333334', 'completed'),

  ('f5555555-5555-4555-8555-555555555906', '05555555-5555-4555-8555-555555555806',
   '15555555-5555-4555-8555-555555555706', 'e5555555-5555-4555-8555-555555555503',
   '11111111-1111-4111-8111-111111111111', 'b2222222-2222-4222-8222-222222222223', 'completed'),
  ('f5555555-5555-4555-8555-555555555907', '05555555-5555-4555-8555-555555555807',
   '15555555-5555-4555-8555-555555555707', 'e5555555-5555-4555-8555-555555555503',
   '11111111-1111-4111-8111-111111111111', 'c3333333-3333-4333-8333-333333333334', 'completed'),

  ('f5555555-5555-4555-8555-555555555908', '05555555-5555-4555-8555-555555555808',
   '15555555-5555-4555-8555-555555555708', 'e5555555-5555-4555-8555-555555555504',
   'a1111111-1111-4111-8111-111111111112', '22222222-2222-4222-8222-222222222222', 'completed'),
  ('f5555555-5555-4555-8555-555555555909', '05555555-5555-4555-8555-555555555809',
   '15555555-5555-4555-8555-555555555709', 'e5555555-5555-4555-8555-555555555504',
   'a1111111-1111-4111-8111-111111111112', 'c3333333-3333-4333-8333-333333333335', 'completed'),
  ('f5555555-5555-4555-8555-555555555910', '05555555-5555-4555-8555-555555555810',
   '15555555-5555-4555-8555-555555555710', 'e5555555-5555-4555-8555-555555555504',
   'a1111111-1111-4111-8111-111111111112', '33333333-3333-4333-8333-333333333333', 'completed'),

  ('f5555555-5555-4555-8555-555555555911', '05555555-5555-4555-8555-555555555811',
   '15555555-5555-4555-8555-555555555711', 'e5555555-5555-4555-8555-555555555506',
   'a1111111-1111-4111-8111-111111111113', 'b2222222-2222-4222-8222-222222222223', 'accepted');

insert into public.match_commitments (match_id, what, quantity, when_on)
values
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Sala para cuarenta personas', 1, '2026-10-04'),
  ('f5555555-5555-4555-8555-555555555901', 'Salón para cincuenta personas', 1, '2026-09-20'),
  ('f5555555-5555-4555-8555-555555555902', 'Proyector y micrófono', 1, '2026-09-20'),
  ('f5555555-5555-4555-8555-555555555903', 'Café y galletas', 55, '2026-09-20'),
  ('f5555555-5555-4555-8555-555555555904', 'Terraza con proyector', 1, '2026-09-27'),
  ('f5555555-5555-4555-8555-555555555905', 'Flyers impresos del cortometraje', 80, '2026-09-27'),
  ('f5555555-5555-4555-8555-555555555906', 'Café para treinta personas', 1, '2026-09-13'),
  ('f5555555-5555-4555-8555-555555555907', 'Stickers y material de mesa', 30, '2026-09-13'),
  ('f5555555-5555-4555-8555-555555555908', 'Patio techado para jam', 1, '2026-09-06'),
  ('f5555555-5555-4555-8555-555555555909', 'Sonido portátil', 1, '2026-09-06'),
  ('f5555555-5555-4555-8555-555555555910', 'Agua y refrigerio ligero', 30, '2026-09-06'),
  ('f5555555-5555-4555-8555-555555555911', 'Sala íntima para taller', 1, '2026-10-18');

-- ---------------------------------------------------------------------------
-- Evidencias (1 pendiente + 4 aprobadas con notas por aporte)
-- ---------------------------------------------------------------------------
insert into public.evidence (
  id, event_id, submitted_by, attendance_count, venue_note, contributions_note,
  contribution_notes, status, review_note, reviewed_by
)
values
  (
    'ee555555-5555-4555-8555-555555555001',
    '55555555-5555-4555-8555-555555555555',
    '11111111-1111-4111-8111-111111111111',
    36,
    'La lectura ocurrió en Casa de Leo, en el centro.',
    'El espacio lo cubrió Leo. El refrigerio no llegó: quedó sin cubrir.',
    '[
      {"need_id":"77777777-7777-4777-8777-777777777777","note":"El espacio lo cubrió Leo; la sala estuvo lista a tiempo."},
      {"need_id":"88888888-8888-4888-8888-888888888888","note":"El refrigerio no se concretó; la necesidad quedó sin cubrir."}
    ]'::jsonb,
    'submitted',
    null,
    null
  ),
  (
    'ee555555-5555-4555-8555-555555555002',
    'e5555555-5555-4555-8555-555555555501',
    'a1111111-1111-4111-8111-111111111112',
    52,
    'El meetup se hizo en Salón Mateo con buen aforo.',
    'Mateo cedió el salón. Andrés llevó el kit de sonido. Luz cubrió el coffee break.',
    '[
      {"need_id":"15555555-5555-4555-8555-555555555701","note":"Mateo abrió el salón desde las 8 a. m. y acompañó el cierre."},
      {"need_id":"15555555-5555-4555-8555-555555555702","note":"Andrés instaló proyector y micrófono sin fallas."},
      {"need_id":"15555555-5555-4555-8555-555555555703","note":"Luz entregó café y galletas para las 55 porciones pedidas."}
    ]'::jsonb,
    'approved',
    'Evidencia clara; caso listo para publicar.',
    '44444444-4444-4444-8444-444444444444'
  ),
  (
    'ee555555-5555-4555-8555-555555555003',
    'e5555555-5555-4555-8555-555555555502',
    'a1111111-1111-4111-8111-111111111113',
    41,
    'Proyectamos en Terraza Valentina al atardecer.',
    'Valentina facilitó la terraza. Nora imprimió y repartió los flyers.',
    '[
      {"need_id":"15555555-5555-4555-8555-555555555704","note":"La terraza estuvo lista con cableado y sillas."},
      {"need_id":"15555555-5555-4555-8555-555555555705","note":"Nora repartió los ochenta flyers en la semana previa."}
    ]'::jsonb,
    'approved',
    'Aprobado.',
    '44444444-4444-4444-8444-444444444444'
  ),
  (
    'ee555555-5555-4555-8555-555555555004',
    'e5555555-5555-4555-8555-555555555503',
    '11111111-1111-4111-8111-111111111111',
    28,
    'Networking en Café Sofía, mesa larga al fondo.',
    'Sofía abrió el café. Nora llevó los kits de mesa.',
    '[
      {"need_id":"15555555-5555-4555-8555-555555555706","note":"Sofía reservó el salón del café y ayudó con el wifi."},
      {"need_id":"15555555-5555-4555-8555-555555555707","note":"Nora entregó stickers y material para cada emprendedor."}
    ]'::jsonb,
    'approved',
    'Aprobado.',
    '44444444-4444-4444-8444-444444444444'
  ),
  (
    'ee555555-5555-4555-8555-555555555005',
    'e5555555-5555-4555-8555-555555555504',
    'a1111111-1111-4111-8111-111111111112',
    47,
    'La jam llenó el Patio Leo sin incidentes.',
    'Leo prestó el patio. Andrés llevó el sonido. Luz cubrió parte del refrigerio.',
    '[
      {"need_id":"15555555-5555-4555-8555-555555555708","note":"Leo abrió el patio y ayudó con la disposición de sillas."},
      {"need_id":"15555555-5555-4555-8555-555555555709","note":"Andrés montó el sonido a tiempo para el primer set."},
      {"need_id":"15555555-5555-4555-8555-555555555710","note":"Luz cubrió 30 de 50 porciones; el resto lo aportaron los asistentes."}
    ]'::jsonb,
    'approved',
    'Aprobado con cobertura parcial de refrigerio, bien documentada.',
    '44444444-4444-4444-8444-444444444444'
  );

-- Un reporte abierto para ejercitar la cola de moderación
insert into public.reports (id, reporter_id, target_type, target_id, reason)
values (
  'fe555555-5555-4555-8555-555555555001',
  'c3333333-3333-4333-8333-333333333334',
  'event',
  'e5555555-5555-4555-8555-555555555510',
  'La descripción del showcase parece demasiado genérica; conviene revisar si es un evento real del piloto.'
);
