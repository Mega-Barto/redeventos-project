import { z } from 'zod'
import {
  CITIES,
  EVENT_STATUSES,
  EVIDENCE_STATUSES,
  MATCH_STATUSES,
  NEED_STATUSES,
  NEED_TYPES,
  OFFER_STATUSES,
  ROLES,
  VENUE_SUPPORT_MODES,
} from '../constants/domain'

export const citySchema = z.enum(CITIES)
export const roleSchema = z.enum(ROLES)
export const needTypeSchema = z.enum(NEED_TYPES)
export const venueSupportModeSchema = z.enum(VENUE_SUPPORT_MODES)
export const eventStatusSchema = z.enum(EVENT_STATUSES)
export const needStatusSchema = z.enum(NEED_STATUSES)
export const offerStatusSchema = z.enum(OFFER_STATUSES)
export const matchStatusSchema = z.enum(MATCH_STATUSES)
export const evidenceStatusSchema = z.enum(EVIDENCE_STATUSES)
