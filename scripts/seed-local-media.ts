/**
 * Descarga placeholders de https://picsum.photos/ y los sube al Storage local.
 * Solo para `bun run db:seed:local`. No commitea binarios.
 */
const API = 'http://127.0.0.1:54321'

const USERS = [
  { id: '11111111-1111-4111-8111-111111111111', picsum: 64 },
  { id: 'a1111111-1111-4111-8111-111111111112', picsum: 91 },
  { id: 'a1111111-1111-4111-8111-111111111113', picsum: 177 },
  { id: '22222222-2222-4222-8222-222222222222', picsum: 338 },
  { id: 'b2222222-2222-4222-8222-222222222223', picsum: 342 },
  { id: 'b2222222-2222-4222-8222-222222222224', picsum: 334 },
  { id: 'b2222222-2222-4222-8222-222222222225', picsum: 343 },
  { id: '33333333-3333-4333-8333-333333333333', picsum: 349 },
  { id: 'c3333333-3333-4333-8333-333333333334', picsum: 453 },
  { id: 'c3333333-3333-4333-8333-333333333335', picsum: 447 },
  { id: '44444444-4444-4444-8444-444444444444', picsum: 433 },
] as const

const VENUES = [
  {
    id: '99999999-9999-4999-8999-999999999999',
    cover: 1015,
    gallery: [
      { id: '10000001-1000-4000-8000-100000000001', picsum: 1018 },
      { id: '10000001-1000-4000-8000-100000000002', picsum: 103 },
      { id: '10000001-1000-4000-8000-100000000003', picsum: 1043 },
    ],
  },
  {
    id: 'd9999999-9999-4999-8999-999999999991',
    cover: 1016,
    gallery: [{ id: '10000001-1000-4000-8000-100000000011', picsum: 1019 }],
  },
  {
    id: 'd9999999-9999-4999-8999-999999999992',
    cover: 1060,
    gallery: [{ id: '10000001-1000-4000-8000-100000000021', picsum: 1061 }],
  },
  {
    id: 'd9999999-9999-4999-8999-999999999993',
    cover: 180,
    gallery: [{ id: '10000001-1000-4000-8000-100000000031', picsum: 201 }],
  },
  {
    id: 'd9999999-9999-4999-8999-999999999994',
    cover: 238,
    gallery: [{ id: '10000001-1000-4000-8000-100000000041', picsum: 239 }],
  },
] as const

/** Evidencia pendiente de moderación (no pública). */
const PENDING_EVIDENCE = {
  eventId: '55555555-5555-4555-8555-555555555555',
  photos: [
    { id: '20000002-2000-4000-8000-200000000001', picsum: 1067 },
    { id: '20000002-2000-4000-8000-200000000002', picsum: 1074 },
    { id: '20000002-2000-4000-8000-200000000003', picsum: 1084 },
  ],
  isPublic: false,
} as const

/** Casos completed: fotos públicas. */
const APPROVED_EVIDENCE = [
  {
    eventId: 'e5555555-5555-4555-8555-555555555501',
    photos: [
      { id: '20000002-2000-4000-8000-200000000101', picsum: 0 },
      { id: '20000002-2000-4000-8000-200000000102', picsum: 26 },
    ],
    isPublic: true,
  },
  {
    eventId: 'e5555555-5555-4555-8555-555555555502',
    photos: [
      { id: '20000002-2000-4000-8000-200000000201', picsum: 29 },
      { id: '20000002-2000-4000-8000-200000000202', picsum: 42 },
    ],
    isPublic: true,
  },
  {
    eventId: 'e5555555-5555-4555-8555-555555555503',
    photos: [{ id: '20000002-2000-4000-8000-200000000301', picsum: 48 }],
    isPublic: true,
  },
  {
    eventId: 'e5555555-5555-4555-8555-555555555504',
    photos: [
      { id: '20000002-2000-4000-8000-200000000401', picsum: 60 },
      { id: '20000002-2000-4000-8000-200000000402', picsum: 76 },
    ],
    isPublic: true,
  },
] as const

function envFromStatus(raw: string) {
  const map = new Map<string, string>()
  for (const line of raw.split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.*)$/)
    if (!match) continue
    map.set(match[1] ?? '', (match[2] ?? '').replace(/^"|"$/g, ''))
  }
  return map
}

async function download(url: string) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { Accept: 'image/webp,image/jpeg,image/*' },
  })
  if (!response.ok) throw new Error(`No se pudo bajar ${url} (${response.status})`)
  const bytes = new Uint8Array(await response.arrayBuffer())
  if (bytes.byteLength === 0 || bytes.byteLength > 5 * 1024 * 1024) {
    throw new Error(`Imagen inválida o demasiado grande: ${url}`)
  }
  const type = response.headers.get('content-type')?.split(';')[0] ?? 'image/jpeg'
  return { bytes, type }
}

async function main() {
  const status = Bun.spawnSync(['supabase', 'status', '-o', 'env'], { stdout: 'pipe', stderr: 'pipe' })
  const env = envFromStatus(status.stdout.toString())
  const api = env.get('API_URL')
  const service = env.get('SERVICE_ROLE_KEY')
  if (api !== API || !service) {
    throw new Error(`Storage de prueba solo contra ${API}. ¿Corriste bun run db:start?`)
  }

  async function upload(bucket: string, path: string, picsumUrl: string) {
    const file = await download(picsumUrl)
    const encoded = path
      .split('/')
      .map((part) => encodeURIComponent(part))
      .join('/')
    const response = await fetch(`${API}/storage/v1/object/${bucket}/${encoded}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${service}`,
        apikey: service,
        'Content-Type': file.type,
        'x-upsert': 'true',
      },
      body: file.bytes,
    })
    if (!response.ok) {
      throw new Error(`Upload ${bucket}/${path}: ${response.status} ${await response.text()}`)
    }
  }

  async function rest(method: string, path: string, body?: unknown, query = '') {
    const response = await fetch(`${API}/rest/v1/${path}${query}`, {
      method,
      headers: {
        Authorization: `Bearer ${service}`,
        apikey: service,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    if (!response.ok) {
      throw new Error(`${method} ${path}: ${response.status} ${await response.text()}`)
    }
  }

  for (const row of USERS) {
    const path = `${row.id}/avatar.webp`
    await upload('profiles', path, `https://picsum.photos/id/${row.picsum}/800/800.webp`)
    await rest('PATCH', 'profiles', { avatar_storage_path: path }, `?id=eq.${row.id}`)
  }

  const venueSponsors = [
    { id: '22222222-2222-4222-8222-222222222222', picsum: 1015 },
    { id: 'b2222222-2222-4222-8222-222222222223', picsum: 1060 },
    { id: 'b2222222-2222-4222-8222-222222222224', picsum: 180 },
    { id: 'b2222222-2222-4222-8222-222222222225', picsum: 238 },
  ] as const
  for (const row of venueSponsors) {
    const path = `${row.id}/venue-sponsor.webp`
    await upload('profiles', path, `https://picsum.photos/id/${row.picsum}/1600/900.webp`)
    await rest('PATCH', 'profiles', { venue_sponsor_photo_path: path }, `?id=eq.${row.id}`)
  }

  const localSponsors = [
    { id: '33333333-3333-4333-8333-333333333333', picsum: 292 },
    { id: 'c3333333-3333-4333-8333-333333333334', picsum: 312 },
    { id: 'c3333333-3333-4333-8333-333333333335', picsum: 367 },
  ] as const
  for (const row of localSponsors) {
    const path = `${row.id}/local-sponsor.webp`
    await upload('profiles', path, `https://picsum.photos/id/${row.picsum}/1600/900.webp`)
    await rest('PATCH', 'profiles', { local_sponsor_photo_path: path }, `?id=eq.${row.id}`)
  }

  for (const venue of VENUES) {
    const coverPath = `${venue.id}/cover.webp`
    await upload('venues', coverPath, `https://picsum.photos/id/${venue.cover}/1600/900.webp`)
    await rest('PATCH', 'venues', { cover_storage_path: coverPath }, `?id=eq.${venue.id}`)
    await rest('DELETE', 'venue_media', undefined, `?venue_id=eq.${venue.id}`)
    for (const [index, row] of venue.gallery.entries()) {
      const path = `${venue.id}/gallery/${row.id}.webp`
      await upload('venues', path, `https://picsum.photos/id/${row.picsum}/1200/800.webp`)
      await rest('POST', 'venue_media', {
        id: row.id,
        venue_id: venue.id,
        storage_path: path,
        sort_order: index + 1,
      })
    }
  }

  const evidenceBatches = [PENDING_EVIDENCE, ...APPROVED_EVIDENCE]
  for (const batch of evidenceBatches) {
    await rest('DELETE', 'event_media', undefined, `?event_id=eq.${batch.eventId}`)
    for (const row of batch.photos) {
      const path = `${batch.eventId}/${row.id}`
      await upload('evidence', path, `https://picsum.photos/id/${row.picsum}/1200/800.webp`)
      await rest('POST', 'event_media', {
        id: row.id,
        event_id: batch.eventId,
        storage_path: path,
        kind: 'evidence',
        is_public: batch.isPublic,
      })
    }
  }

  console.log('Fotos de prueba (Picsum) cargadas en Storage local.')
}

await main()
