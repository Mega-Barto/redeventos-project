import { z } from 'zod'
import { CITIES, EVENT_CATEGORIES, NEED_TYPES, SELF_ASSIGNABLE_ROLES, VENUE_SUPPORT_MODES } from '../constants/domain'
import { emptyToNull } from '../utils/need-quantity'
import { citySchema, eventStatusSchema, needTypeSchema, venueSupportModeSchema } from './domain'

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value.length === 0 ? null : value))

const phoneSchema = z
  .string()
  .trim()
  .transform((value) => (value.length === 0 ? null : value))
  .refine((value) => value === null || /^\+?[0-9]{7,15}$/.test(value), 'Ingresa un número válido')

export const registerAccountSchema = z.object({
  displayName: z.string().trim().min(2, 'El nombre es demasiado corto').max(80, 'El nombre es demasiado largo'),
  email: z.email('Ingresa un correo válido'),
  password: z.string().min(8, 'Usa al menos 8 caracteres').max(72, 'La contraseña es demasiado larga'),
  privacyAccepted: z.literal(true, { error: 'Debes leer el aviso de privacidad' }),
})

export const onboardingSchema = z.object({
  commitmentAccepted: z.literal(true, { error: 'Debes aceptar el compromiso de registro' }),
  roles: z.array(z.enum(SELF_ASSIGNABLE_ROLES)).min(1, 'Elige al menos un rol'),
  instagram: optionalText(100),
  website: z
    .string()
    .trim()
    .transform((value) => (value.length === 0 ? null : value))
    .refine((value) => value === null || z.url().safeParse(value).success, 'Ingresa una URL válida'),
  city: z.union([z.enum(CITIES), z.literal('')]).transform((value) => (value === '' ? null : value)),
  whatsapp: phoneSchema,
  phone: phoneSchema,
  contributionTypes: z.array(needTypeSchema),
  contributionDescription: optionalText(2000),
})

export type RegisterAccountInput = z.infer<typeof registerAccountSchema>
export type OnboardingInput = z.infer<typeof onboardingSchema>

export const profileUpdateSchema = onboardingSchema.omit({ commitmentAccepted: true })
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>

const optionalNeedQuantitySchema = z
  .unknown()
  .transform(emptyToNull)
  .pipe(z.union([z.null(), z.coerce.number().positive('La cantidad debe ser mayor que cero')]))

const optionalNeedUnitSchema = z
  .unknown()
  .transform((value) => {
    if (typeof value !== 'string') return value == null ? null : value
    const trimmed = value.trim()
    return trimmed.length === 0 ? null : trimmed
  })
  .pipe(z.union([z.null(), z.string().max(40)]))

export const eventNeedInputSchema = z
  .object({
    type: needTypeSchema,
    description: z.string().trim().min(3, 'Describe qué se pide').max(500),
    quantity: optionalNeedQuantitySchema,
    unit: optionalNeedUnitSchema,
  })
  .superRefine((value, ctx) => {
    if (value.quantity != null && !value.unit) {
      ctx.addIssue({ code: 'custom', path: ['unit'], message: 'Indica la unidad' })
    }
  })
  .transform((value) => ({
    ...value,
    unit: value.quantity == null ? null : value.unit,
  }))

export type EventNeedInput = z.infer<typeof eventNeedInputSchema>

export const createEventSchema = z
  .object({
    title: z.string().trim().min(3, 'El nombre es demasiado corto').max(150),
    category: z.enum(EVENT_CATEGORIES, { error: 'Elige una categoría' }),
    city: citySchema,
    dateMode: z.enum(['range', 'concrete']),
    dateRangeLabel: z.string().trim().max(120).optional(),
    startsOn: z.string().trim().optional(),
    expectedAttendees: z.coerce.number().int().positive('Indica cuántas personas esperas').max(100_000),
    description: z.string().trim().min(10, 'Cuéntanos un poco más').max(5000),
    audience: z.string().trim().min(3, 'Describe la audiencia').max(1000),
    sponsorBenefit: z.string().trim().min(3, 'Di qué recibe el sponsor').max(1000),
    rsvpUrl: z.url('El enlace de inscripción es obligatorio'),
    needs: z.array(eventNeedInputSchema).min(1, 'Agrega al menos una necesidad').max(12),
  })
  .superRefine((value, ctx) => {
    if (value.dateMode === 'range' && (value.dateRangeLabel?.length ?? 0) < 3) {
      ctx.addIssue({ code: 'custom', path: ['dateRangeLabel'], message: 'Describe el rango de fechas' })
    }
    if (value.dateMode === 'concrete' && !value.startsOn) {
      ctx.addIssue({ code: 'custom', path: ['startsOn'], message: 'Indica la fecha' })
    }
  })

export type CreateEventInput = z.infer<typeof createEventSchema>

export const makePublicSchema = z
  .object({
    startsOn: z.string().min(1, 'La ficha pública exige una fecha concreta'),
    placeName: z.string().trim().max(160),
    venueId: z.uuid().nullable(),
  })
  .superRefine((value, ctx) => {
    if (value.placeName.length < 2 && !value.venueId) {
      ctx.addIssue({ code: 'custom', path: ['placeName'], message: 'Indica el lugar' })
    }
  })

export const venueSchema = z.object({
  name: z.string().trim().min(2, 'El nombre es demasiado corto').max(120),
  city: citySchema,
  zone: z.string().trim().min(2, 'Indica la zona').max(120),
  capacity: z.coerce.number().int().positive('La capacidad debe ser mayor que cero').max(100_000),
  equipment: z.string().trim().min(2, 'Describe el equipamiento').max(2000),
  supportMode: venueSupportModeSchema,
  description: z.string().trim().min(10, 'Describe el espacio').max(4000),
})

export type VenueInput = z.infer<typeof venueSchema>

export const createOfferSchema = z.object({
  eventNeedId: z.uuid(),
  eventId: z.uuid(),
  recipientId: z.uuid(),
  venueId: z.uuid().nullable(),
  quantity: z.coerce.number().positive('La cantidad debe ser mayor que cero'),
  offerOn: z.string().min(1, 'Indica la fecha del aporte'),
  note: z.string().trim().min(3, 'Explica la propuesta').max(1000),
})

export type CreateOfferInput = z.infer<typeof createOfferSchema>

export const evidenceSchema = z.object({
  attendanceCount: z.coerce.number().int().positive('Indica cuántas personas asistieron'),
  venueNote: z.string().trim().min(3, 'Describe el espacio que recibió el evento').max(2000),
  contributionsNote: z.string().trim().min(3, 'Describe los aportes cumplidos').max(2000),
})

export type EvidenceInput = z.infer<typeof evidenceSchema>

export const reviewEvidenceSchema = z
  .object({
    evidenceId: z.uuid(),
    decision: z.enum(['approved', 'rejected']),
    note: z.string().trim().max(1000),
  })
  .superRefine((value, ctx) => {
    if (value.decision === 'rejected' && value.note.length < 3) {
      ctx.addIssue({ code: 'custom', path: ['note'], message: 'Explica por qué se rechaza' })
    }
  })

export const reportSchema = z.object({
  targetType: z.enum(['event', 'profile']),
  targetId: z.uuid(),
  reason: z.string().trim().min(10, 'Cuéntanos un poco más').max(1000),
})

export const disaffiliateSchema = z.object({
  profileId: z.uuid('Ingresa el identificador del perfil'),
})

export const loginSchema = z.object({
  email: z.email('Ingresa un correo válido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

export const offerNoticeSchema = z.object({
  offerId: z.uuid(),
})

export const evidenceNoticeSchema = z.object({
  evidenceId: z.uuid(),
})

export { eventStatusSchema, NEED_TYPES, VENUE_SUPPORT_MODES }
