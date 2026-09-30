export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  if (!user.value) {
    return navigateTo(`/entrar?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
