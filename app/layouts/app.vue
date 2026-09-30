<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import type { Role } from '~~/shared/constants/domain'

const userId = useUserId()
const configured = useSupabaseConfigured()

const { data: roles } = await useAsyncData(
  'app-roles',
  async () => {
    if (!userId.value || !configured.value) return [] as Role[]
    const { data } = await useDb().from('profile_roles').select('role').eq('profile_id', userId.value)
    return (data ?? []).map((row) => row.role)
  },
  { watch: [userId] },
)

const items = computed<NavigationMenuItem[]>(() => {
  const current = roles.value ?? []
  const nav: NavigationMenuItem[] = [{ label: 'Inicio', icon: 'i-lucide-house', to: '/app' }]
  if (current.includes('organizer')) {
    nav.push({ label: 'Eventos', icon: 'i-lucide-calendar', to: '/app/eventos' })
  }
  if (current.includes('venue_sponsor')) {
    nav.push({ label: 'Espacio', icon: 'i-lucide-building', to: '/app/espacio' })
  }
  if (current.includes('venue_sponsor') || current.includes('local_sponsor')) {
    nav.push({ label: 'Oportunidades', icon: 'i-lucide-search', to: '/app/oportunidades' })
  }
  if (current.includes('organizer') || current.includes('venue_sponsor') || current.includes('local_sponsor')) {
    nav.push({ label: 'Propuestas', icon: 'i-lucide-send', to: '/app/propuestas' })
  }
  nav.push({ label: 'Perfil', icon: 'i-lucide-user', to: '/app/perfil' })
  if (current.includes('moderator')) {
    nav.push({ label: 'Moderación', icon: 'i-lucide-shield', to: '/app/moderacion' })
  }
  return nav
})

async function signOut() {
  await useDb().auth.signOut()
  await navigateTo('/')
}
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar collapsible>
      <template #header="{ collapsed }">
        <UButton
          to="/app"
          color="neutral"
          variant="ghost"
          :icon="collapsed ? 'i-lucide-hexagon' : undefined"
          :label="collapsed ? undefined : 'Redeventos'"
        />
      </template>
      <template #default="{ collapsed }">
        <UNavigationMenu :collapsed="collapsed" :items="items" orientation="vertical" />
      </template>
      <template #footer="{ collapsed }">
        <UButton
          color="neutral"
          variant="ghost"
          :icon="collapsed ? 'i-lucide-log-out' : undefined"
          :label="collapsed ? undefined : 'Salir'"
          block
          @click="signOut"
        />
      </template>
    </UDashboardSidebar>
    <slot />
  </UDashboardGroup>
</template>
