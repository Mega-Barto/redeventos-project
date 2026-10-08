import { describe, expect, it } from 'vitest'
import { SELF_ASSIGNABLE_ROLES } from '../../shared/constants/domain'
import {
  canAcceptOffer,
  canMakePublic,
  canSeeDirectContact,
  canTransitionEvidence,
  canTransitionOffer,
  coverageAfterAccept,
  formatBogotaDate,
  sealLevel,
  slugify,
  suggestionRank,
} from '../../shared/domain/rules'
import { createEventSchema, onboardingSchema, registerAccountSchema } from '../../shared/schemas/inputs'
import { hasNeedQuantity } from '../../shared/utils/need-quantity'

describe('cobertura parcial', () => {
  it('deja la necesidad abierta por el resto', () => {
    expect(coverageAfterAccept(100, 0, 40)).toEqual({ covered: 40, status: 'partial', remaining: 60 })
  })

  it('cubre la necesidad cuando la cantidad alcanza', () => {
    expect(coverageAfterAccept(100, 40, 60).status).toBe('covered')
  })

  it('rechaza una cantidad mayor a lo que falta', () => {
    expect(() => coverageAfterAccept(100, 40, 70)).toThrow(/supera/)
  })
})

describe('ficha pública', () => {
  it('exige fecha concreta y lugar desde published', () => {
    expect(canMakePublic({ status: 'published', startsOn: '2026-10-12', placeName: 'Café', venueId: null })).toBe(true)
    expect(canMakePublic({ status: 'published', startsOn: null, placeName: 'Café', venueId: null })).toBe(false)
    expect(canMakePublic({ status: 'published', startsOn: '2026-10-12', placeName: null, venueId: null })).toBe(false)
    expect(canMakePublic({ status: 'draft', startsOn: '2026-10-12', placeName: 'Café', venueId: null })).toBe(false)
    expect(
      canMakePublic({
        status: 'published',
        startsOn: '2026-10-12',
        placeName: null,
        venueId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
      }),
    ).toBe(true)
  })
})

describe('contactos directos', () => {
  it('no revela WhatsApp antes del match', () => {
    expect(
      canSeeDirectContact({
        viewerId: 'org',
        subjectId: 'sponsor',
        acceptedMatch: false,
        isModerator: false,
      }),
    ).toBe(false)
  })

  it('revela el contacto a las dos partes después de aceptar', () => {
    expect(
      canSeeDirectContact({
        viewerId: 'org',
        subjectId: 'sponsor',
        acceptedMatch: true,
        isModerator: false,
      }),
    ).toBe(true)
  })
})

describe('sello de la red', () => {
  it('distingue en la red y aliado activo', () => {
    const base = { disaffiliated: false, hidden: false, hasSponsorRole: true, profileComplete: true }
    expect(sealLevel({ ...base, completedEvents: 0 })).toBe('en_la_red')
    expect(sealLevel({ ...base, completedEvents: 1 })).toBe('aliado_activo')
    expect(sealLevel({ ...base, completedEvents: 2, disaffiliated: true })).toBeNull()
  })
})

describe('sugerencias', () => {
  it('exige capacidad suficiente para espacio y no veta el modo de apoyo', () => {
    expect(
      suggestionRank({
        needType: 'venue',
        city: 'pereira',
        expectedAttendees: 40,
        sponsorCity: 'pereira',
        contributionTypes: [],
        capacity: 20,
      }),
    ).toBeNull()
    expect(
      suggestionRank({
        needType: 'food',
        city: 'dosquebradas',
        expectedAttendees: 30,
        sponsorCity: 'pereira',
        contributionTypes: ['food'],
        capacity: null,
      }),
    ).toBe(1)
  })
})

describe('transiciones de propuesta y evidencia', () => {
  it('solo el destinatario acepta una propuesta pendiente', () => {
    expect(canAcceptOffer({ status: 'pending', recipientId: 'a', viewerId: 'a' })).toBe(true)
    expect(canAcceptOffer({ status: 'pending', recipientId: 'a', viewerId: 'b' })).toBe(false)
    expect(canTransitionOffer('pending', 'accepted')).toBe(true)
    expect(canTransitionOffer('accepted', 'rejected')).toBe(false)
  })

  it('la evidencia rechazada se puede reenviar', () => {
    expect(canTransitionEvidence('submitted', 'approved')).toBe(true)
    expect(canTransitionEvidence('rejected', 'submitted')).toBe(true)
    expect(canTransitionEvidence('approved', 'rejected')).toBe(false)
  })
})

describe('formato y slug', () => {
  it('formatea fechas en español de Colombia', () => {
    expect(formatBogotaDate('2026-10-12')).toMatch(/2026/)
    expect(formatBogotaDate('2026-10-12').toLowerCase()).toContain('octubre')
  })

  it('el moderador no es un rol autoasignable', () => {
    expect(SELF_ASSIGNABLE_ROLES).not.toContain('moderator')
  })

  it('normaliza slugs', () => {
    expect(slugify('Café del Parque')).toBe('cafe-del-parque')
  })
})

describe('schemas de entrada', () => {
  it('rechaza un registro sin aviso de privacidad', () => {
    const parsed = registerAccountSchema.safeParse({
      displayName: 'Ana',
      email: 'ana@example.com',
      password: 'secreta123',
      privacyAccepted: false,
    })
    expect(parsed.success).toBe(false)
  })

  it('exige compromiso y al menos un rol', () => {
    const parsed = onboardingSchema.safeParse({
      commitmentAccepted: true,
      roles: [],
      instagram: '',
      website: '',
      city: '',
      whatsapp: '',
      phone: '',
      contributionTypes: [],
      contributionDescription: '',
    })
    expect(parsed.success).toBe(false)
  })

  it('no admite espacio como aporte de local sponsor', () => {
    const parsed = onboardingSchema.safeParse({
      commitmentAccepted: true,
      roles: ['local_sponsor'],
      instagram: '',
      website: '',
      city: 'pereira',
      whatsapp: '',
      phone: '',
      contributionTypes: ['venue'],
      contributionDescription: '',
    })
    expect(parsed.success).toBe(false)
  })

  it('exige enlace de inscripción y una necesidad', () => {
    const parsed = createEventSchema.safeParse({
      title: 'Lectura en el parque',
      category: 'literatura',
      city: 'pereira',
      dateMode: 'range',
      dateRangeLabel: 'segunda semana de octubre',
      expectedAttendees: 25,
      description: 'Una lectura abierta para la comunidad del centro.',
      audience: 'Personas que leen en español',
      sponsorBenefit: 'Mención en redes y un stand',
      rsvpUrl: 'https://example.com/rsvp',
      needs: [{ type: 'venue', description: 'Un salón para 25 personas', quantity: 1, unit: 'espacio' }],
    })
    expect(parsed.success).toBe(true)
  })

  it('permite una necesidad sin cantidad ni unidad', () => {
    const parsed = createEventSchema.safeParse({
      title: 'Lectura en el parque',
      category: 'literatura',
      city: 'pereira',
      dateMode: 'range',
      dateRangeLabel: 'segunda semana de octubre',
      expectedAttendees: 25,
      description: 'Una lectura abierta para la comunidad del centro.',
      audience: 'Personas que leen en español',
      sponsorBenefit: 'Mención en redes y un stand',
      rsvpUrl: 'https://example.com/rsvp',
      needs: [{ type: 'diffusion', description: 'Difusión en redes del barrio', quantity: '', unit: '' }],
    })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.needs[0]?.quantity).toBeNull()
      expect(parsed.data.needs[0]?.unit).toBeNull()
    }
  })

  it('exige unidad cuando la necesidad sí tiene cantidad', () => {
    const parsed = createEventSchema.safeParse({
      title: 'Lectura en el parque',
      category: 'literatura',
      city: 'pereira',
      dateMode: 'range',
      dateRangeLabel: 'segunda semana de octubre',
      expectedAttendees: 25,
      description: 'Una lectura abierta para la comunidad del centro.',
      audience: 'Personas que leen en español',
      sponsorBenefit: 'Mención en redes y un stand',
      rsvpUrl: 'https://example.com/rsvp',
      needs: [{ type: 'food', description: 'Refrigerio para quienes asistan', quantity: 40, unit: '' }],
    })
    expect(parsed.success).toBe(false)
  })

  it('trata cantidad vacía como ausente para habilitar la unidad', () => {
    expect(hasNeedQuantity(null)).toBe(false)
    expect(hasNeedQuantity('')).toBe(false)
    expect(hasNeedQuantity(0)).toBe(false)
    expect(hasNeedQuantity(2)).toBe(true)
    expect(hasNeedQuantity('40')).toBe(true)
  })
})
