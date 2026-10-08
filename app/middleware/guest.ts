import { internalRedirectPath } from '~~/shared/utils/internal-path'

export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  if (user.value) return navigateTo(internalRedirectPath(to.query.redirect))
})
