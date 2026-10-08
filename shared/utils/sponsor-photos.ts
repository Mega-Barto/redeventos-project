import type { Role } from '../constants/domain'

export type SponsorPhotoKind = 'venue_sponsor' | 'local_sponsor'

export function requiredSponsorPhotoKinds(roles: readonly Role[]): SponsorPhotoKind[] {
  const kinds: SponsorPhotoKind[] = []
  if (roles.includes('venue_sponsor')) kinds.push('venue_sponsor')
  if (roles.includes('local_sponsor')) kinds.push('local_sponsor')
  return kinds
}

export function missingSponsorPhotoMessage(kind: SponsorPhotoKind): string {
  return kind === 'venue_sponsor'
    ? 'Sube una foto del espacio para registrarte como venue sponsor.'
    : 'Sube una foto de tu aporte para registrarte como local sponsor.'
}
