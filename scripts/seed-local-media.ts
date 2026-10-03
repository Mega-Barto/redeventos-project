/**
 * Descarga placeholders de https://picsum.photos/ y los sube al Storage local.
 * Solo para `bun run db:seed:local`. No commitea binarios.
 */
const API = 'http://127.0.0.1:54321'
const ANA = '11111111-1111-4111-8111-111111111111'
const LEO = '22222222-2222-4222-8222-222222222222'
const LUZ = '33333333-3333-4333-8333-333333333333'
const MODA = '44444444-4444-4444-8444-444444444444'
const VENUE = '99999999-9999-4999-8999-999999999999'
const EVENT = '55555555-5555-4555-8555-555555555555'

const GALLERY = [
  { id: '10000001-1000-4000-8000-100000000001', picsum: 1018 },
  { id: '10000001-1000-4000-8000-100000000002', picsum: 103 },
  { id: '10000001-1000-4000-8000-100000000003', picsum: 1043 },
] as const

const EVIDENCE = [
  { id: '20000002-2000-4000-8000-200000000001', picsum: 1067 },
  { id: '20000002-2000-4000-8000-200000000002', picsum: 1074 },
  { id: '20000002-2000-4000-8000-200000000003', picsum: 1084 },
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

  const avatars = [
    { id: ANA, picsum: 64 },
    { id: LEO, picsum: 338 },
    { id: LUZ, picsum: 349 },
    { id: MODA, picsum: 447 },
  ]
  for (const row of avatars) {
    const path = `${row.id}/avatar.webp`
    await upload('profiles', path, `https://picsum.photos/id/${row.picsum}/800/800.webp`)
    await rest('PATCH', 'profiles', { avatar_storage_path: path }, `?id=eq.${row.id}`)
  }

  const coverPath = `${VENUE}/cover.webp`
  await upload('venues', coverPath, 'https://picsum.photos/id/1015/1600/900.webp')
  await rest('PATCH', 'venues', { cover_storage_path: coverPath }, `?id=eq.${VENUE}`)
  await rest('DELETE', 'venue_media', undefined, `?venue_id=eq.${VENUE}`)
  for (const [index, row] of GALLERY.entries()) {
    const path = `${VENUE}/gallery/${row.id}.webp`
    await upload('venues', path, `https://picsum.photos/id/${row.picsum}/1200/800.webp`)
    await rest('POST', 'venue_media', {
      id: row.id,
      venue_id: VENUE,
      storage_path: path,
      sort_order: index + 1,
    })
  }

  await rest('DELETE', 'event_media', undefined, `?event_id=eq.${EVENT}`)
  for (const row of EVIDENCE) {
    const path = `${EVENT}/${row.id}`
    await upload('evidence', path, `https://picsum.photos/id/${row.picsum}/1200/800.webp`)
    await rest('POST', 'event_media', {
      id: row.id,
      event_id: EVENT,
      storage_path: path,
      kind: 'evidence',
      is_public: false,
    })
  }

  console.log('Fotos de prueba (Picsum) cargadas en Storage local.')
}

await main()
