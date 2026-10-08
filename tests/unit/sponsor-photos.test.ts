import { describe, expect, it } from 'vitest'
import { missingSponsorPhotoMessage, requiredSponsorPhotoKinds } from '../../shared/utils/sponsor-photos'

describe('fotos obligatorias por tipo de sponsor', () => {
  it('pide foto de venue y de local según los roles elegidos', () => {
    expect(requiredSponsorPhotoKinds(['organizer'])).toEqual([])
    expect(requiredSponsorPhotoKinds(['venue_sponsor'])).toEqual(['venue_sponsor'])
    expect(requiredSponsorPhotoKinds(['local_sponsor'])).toEqual(['local_sponsor'])
    expect(requiredSponsorPhotoKinds(['venue_sponsor', 'local_sponsor'])).toEqual(['venue_sponsor', 'local_sponsor'])
  })

  it('explica en español qué foto falta', () => {
    expect(missingSponsorPhotoMessage('venue_sponsor')).toMatch(/venue sponsor/i)
    expect(missingSponsorPhotoMessage('local_sponsor')).toMatch(/local sponsor/i)
  })
})
