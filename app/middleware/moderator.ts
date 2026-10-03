export default defineNuxtRouteMiddleware(async () => {
  const userId = useSupabaseUser().value?.sub
  if (!userId) return navigateTo('/login')
  const db = useDb()
  const { data } = await db
    .from('profile_roles')
    .select('role')
    .eq('profile_id', userId)
    .eq('role', 'moderator')
    .maybeSingle()
  if (!data) return navigateTo('/app')
})
