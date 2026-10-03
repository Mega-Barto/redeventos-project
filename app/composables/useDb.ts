import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~~/shared/types/database.types'

export function useDb(): SupabaseClient<Database> {
  return useSupabaseClient<Database>()
}

export function useUserId() {
  const user = useSupabaseUser()
  return computed(() => user.value?.sub ?? null)
}

export function useSupabaseConfigured() {
  const config = useRuntimeConfig()
  return computed(() => Boolean(config.public.supabase?.url))
}

export function useSupabaseUrl() {
  const config = useRuntimeConfig()
  return computed(() => String(config.public.supabase?.url ?? ''))
}
