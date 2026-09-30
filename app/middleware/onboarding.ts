export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()
  const userId = user.value?.sub
  if (!userId || !useSupabaseConfigured().value) return

  const db = useDb()
  const [{ data: commitment, error: commitmentError }, { data: roles, error: rolesError }] = await Promise.all([
    db.from('registration_commitments').select('profile_id').eq('profile_id', userId).maybeSingle(),
    db.from('profile_roles').select('role').eq('profile_id', userId),
  ])
  if (commitmentError || rolesError) return

  const assignable = (roles ?? []).filter((row) => row.role !== 'moderator')
  if (!commitment || assignable.length === 0) return navigateTo('/registro')
})
