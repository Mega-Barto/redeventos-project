import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~~/shared/types/database.types'

export async function requireUser(event: Parameters<typeof serverSupabaseUser>[0]) {
  const user = await serverSupabaseUser(event)
  const userId = user?.sub
  if (!userId) throw createError({ statusCode: 401, statusMessage: 'Debes entrar' })
  const client = await serverSupabaseClient<Database>(event)
  return { userId, client }
}
