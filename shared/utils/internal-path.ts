/** Solo rutas internas; evita `//host` y otros open redirects. */
export function internalRedirectPath(value: unknown, fallback = '/app'): string {
  if (typeof value !== 'string') return fallback
  if (!value.startsWith('/')) return fallback
  if (value.startsWith('//')) return fallback
  if (value.includes('\\')) return fallback
  return value
}

export function eventSupportAuthHrefs(eventId: string) {
  const opportunityTo = `/app/opportunities/${eventId}`
  const redirect = encodeURIComponent(opportunityTo)
  return {
    opportunityTo,
    loginTo: `/login?redirect=${redirect}`,
    registerTo: `/register?role=local_sponsor&redirect=${redirect}`,
  }
}
