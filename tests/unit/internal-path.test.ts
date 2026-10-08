import { describe, expect, it } from 'vitest'
import { eventSupportAuthHrefs, internalRedirectPath } from '../../shared/utils/internal-path'

describe('internalRedirectPath', () => {
  it('acepta rutas internas', () => {
    expect(internalRedirectPath('/app/opportunities/abc')).toBe('/app/opportunities/abc')
  })

  it('rechaza open redirects', () => {
    expect(internalRedirectPath('https://evil.test')).toBe('/app')
    expect(internalRedirectPath('//evil.test')).toBe('/app')
    expect(internalRedirectPath('/\\evil.test')).toBe('/app')
    expect(internalRedirectPath(undefined)).toBe('/app')
  })
})

describe('eventSupportAuthHrefs', () => {
  it('manda a la oportunidad con redirect seguro y rol de aliado', () => {
    expect(eventSupportAuthHrefs('55555555-5555-4555-8555-555555555555')).toEqual({
      opportunityTo: '/app/opportunities/55555555-5555-4555-8555-555555555555',
      loginTo: '/login?redirect=%2Fapp%2Fopportunities%2F55555555-5555-4555-8555-555555555555',
      registerTo: '/register?role=local_sponsor&redirect=%2Fapp%2Fopportunities%2F55555555-5555-4555-8555-555555555555',
    })
  })
})
