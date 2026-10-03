import { describe, expect, it } from 'vitest'
import type { ModerationEventRow, ModerationProfileRow } from '../../shared/utils/moderation-directory'
import {
  filterModerationEvents,
  filterModerationProfiles,
  mapModerationEvent,
  mapModerationEventFicha,
  mapModerationProfile,
  mapModerationProfileFicha,
  profileVisibility,
} from '../../shared/utils/moderation-directory'

const ana: ModerationProfileRow = {
  id: '11111111-1111-4111-8111-111111111111',
  displayName: 'Ana Organizadora',
  email: 'ana.organizadora@local.redeventos.test',
  slug: 'ana-organizadora-111111',
  city: 'pereira',
  hidden: false,
  disaffiliated: false,
  contributionTypes: [],
}

const luz: ModerationProfileRow = {
  id: '33333333-3333-4333-8333-333333333333',
  displayName: 'Luz Aliada',
  email: 'luz.aliada@local.redeventos.test',
  slug: 'luz-aliada-333333',
  city: 'dosquebradas',
  hidden: true,
  disaffiliated: false,
  contributionTypes: ['food', 'diffusion'],
}

const leo: ModerationProfileRow = {
  id: '22222222-2222-4222-8222-222222222222',
  displayName: 'Leo Espacio',
  email: 'leo.espacio@local.redeventos.test',
  slug: 'leo-espacio-222222',
  city: 'pereira',
  hidden: false,
  disaffiliated: true,
  contributionTypes: ['venue'],
}

const lectura: ModerationEventRow = {
  id: '55555555-5555-4555-8555-555555555555',
  title: 'Lectura en el centro',
  status: 'public',
  city: 'pereira',
  category: 'literatura',
  startsOn: '2026-11-14',
  hidden: false,
  organizerId: ana.id,
  organizerName: 'Ana Organizadora',
}

const taller: ModerationEventRow = {
  id: '66666666-6666-4666-8666-666666666666',
  title: 'Taller de cuento',
  status: 'draft',
  city: 'dosquebradas',
  category: 'literatura',
  startsOn: null,
  hidden: true,
  organizerId: ana.id,
  organizerName: 'Ana Organizadora',
}

describe('mapeo para el directorio', () => {
  it('no incluye WhatsApp ni teléfono y marca oculto o desafiliado', () => {
    const mapped = mapModerationProfile({
      id: ana.id,
      display_name: ana.displayName,
      email: ana.email,
      slug: ana.slug,
      city: 'pereira',
      hidden_at: '2026-10-03T00:00:00Z',
      disaffiliated_at: null,
      contribution_types: ['food'],
    })
    expect(mapped).toEqual({
      ...ana,
      hidden: true,
      contributionTypes: ['food'],
    })
    expect(JSON.stringify(mapped)).not.toMatch(/whatsapp|tel[eé]fono|phone/i)
  })

  it('arma la ficha de perfil solo con contacto público', () => {
    const mapped = mapModerationProfileFicha({
      id: luz.id,
      display_name: luz.displayName,
      email: luz.email,
      slug: luz.slug,
      city: 'dosquebradas',
      hidden_at: '2026-10-03T00:00:00Z',
      disaffiliated_at: null,
      contribution_types: ['food', 'diffusion'],
      instagram: '@luz.aliada',
      website: 'https://luz.example',
      contribution_description: 'Lleva refrigerio y difusión.',
      avatar_storage_path: '3333/avatar.webp',
    })
    expect(mapped.instagram).toBe('@luz.aliada')
    expect(mapped.contributionDescription).toBe('Lleva refrigerio y difusión.')
    expect(JSON.stringify(mapped)).not.toMatch(/whatsapp|tel[eé]fono|phone/i)
  })

  it('arma la ficha de evento con necesidades y sin WhatsApp', () => {
    const mapped = mapModerationEventFicha(
      {
        id: lectura.id,
        title: lectura.title,
        status: 'public',
        city: 'pereira',
        category: 'literatura',
        starts_on: '2026-11-14',
        hidden_at: null,
        organizer_id: ana.id,
        description: 'Lectura abierta en el centro.',
        audience: 'Público general',
        place_name: 'Casa de Leo',
        date_range_label: null,
        expected_attendees: 40,
        rsvp_url: 'https://example.com/rsvp',
        sponsor_benefit: 'Mención en redes',
      },
      'Ana Organizadora',
      [{ id: 'need-1', type: 'venue', description: 'Sala para 40 personas' }],
    )
    expect(mapped.placeName).toBe('Casa de Leo')
    expect(mapped.needs).toHaveLength(1)
    expect(JSON.stringify(mapped)).not.toMatch(/whatsapp|tel[eé]fono|phone/i)
  })

  it('asocia el nombre del organizador al evento', () => {
    expect(
      mapModerationEvent(
        {
          id: lectura.id,
          title: lectura.title,
          status: 'public',
          city: 'pereira',
          category: 'literatura',
          starts_on: '2026-11-14',
          hidden_at: null,
          organizer_id: ana.id,
        },
        'Ana Organizadora',
      ),
    ).toEqual(lectura)
  })
})

describe('visibilidad de perfil', () => {
  it('prioriza desafiliación sobre oculto', () => {
    expect(profileVisibility(leo)).toBe('disaffiliated')
    expect(profileVisibility(luz)).toBe('hidden')
    expect(profileVisibility(ana)).toBe('active')
  })
})

describe('filtros de perfiles', () => {
  const all = [ana, luz, leo]

  it('busca por nombre o correo en español sin exigir mayúsculas', () => {
    expect(filterModerationProfiles(all, baseProfile({ query: 'ana' })).map((row) => row.id)).toEqual([ana.id])
    expect(filterModerationProfiles(all, baseProfile({ query: 'LUZ.ALIADA' })).map((row) => row.id)).toEqual([luz.id])
  })

  it('filtra ciudad, visibilidad y tipo de aporte', () => {
    expect(filterModerationProfiles(all, baseProfile({ city: 'pereira' }))).toHaveLength(2)
    expect(filterModerationProfiles(all, baseProfile({ visibility: 'hidden' })).map((row) => row.id)).toEqual([luz.id])
    expect(filterModerationProfiles(all, baseProfile({ contributionType: 'food' })).map((row) => row.id)).toEqual([
      luz.id,
    ])
  })

  it('sin filtros devuelve toda la lista', () => {
    expect(filterModerationProfiles(all, baseProfile()).map((row) => row.id)).toEqual([ana.id, luz.id, leo.id])
  })
})

describe('filtros de eventos', () => {
  const all = [lectura, taller]

  it('busca por título u organizador', () => {
    expect(filterModerationEvents(all, baseEvent({ query: 'lectura' })).map((row) => row.id)).toEqual([lectura.id])
    expect(filterModerationEvents(all, baseEvent({ query: 'organizadora' }))).toHaveLength(2)
  })

  it('filtra estado, ciudad y ocultos', () => {
    expect(filterModerationEvents(all, baseEvent({ status: 'draft' })).map((row) => row.id)).toEqual([taller.id])
    expect(filterModerationEvents(all, baseEvent({ city: 'pereira' })).map((row) => row.id)).toEqual([lectura.id])
    expect(filterModerationEvents(all, baseEvent({ hidden: 'hidden' })).map((row) => row.id)).toEqual([taller.id])
  })
})

function baseProfile(
  overrides: Partial<Parameters<typeof filterModerationProfiles>[1]> = {},
): Parameters<typeof filterModerationProfiles>[1] {
  return {
    query: '',
    city: 'all',
    visibility: 'all',
    contributionType: 'all',
    ...overrides,
  }
}

function baseEvent(
  overrides: Partial<Parameters<typeof filterModerationEvents>[1]> = {},
): Parameters<typeof filterModerationEvents>[1] {
  return {
    query: '',
    city: 'all',
    status: 'all',
    hidden: 'all',
    ...overrides,
  }
}
