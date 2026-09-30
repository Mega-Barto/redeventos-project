<script setup lang="ts">
import { CITIES, NEED_TYPES, SELF_ASSIGNABLE_ROLES } from '~~/shared/constants/domain'
import { CITY_LABELS, NEED_LABELS, ROLE_LABELS } from '~~/shared/constants/labels'

const props = defineProps<{
  pending?: boolean
  initial?: {
    roles: Array<(typeof SELF_ASSIGNABLE_ROLES)[number]>
    instagram: string
    website: string
    city: '' | 'pereira' | 'dosquebradas'
    whatsapp: string
    phone: string
    contributionTypes: Array<(typeof NEED_TYPES)[number]>
    contributionDescription: string
  }
}>()

const emit = defineEmits<{
  submit: [
    {
      roles: Array<(typeof SELF_ASSIGNABLE_ROLES)[number]>
      instagram: string
      website: string
      city: '' | 'pereira' | 'dosquebradas'
      whatsapp: string
      phone: string
      contributionTypes: Array<(typeof NEED_TYPES)[number]>
      contributionDescription: string
    },
  ]
}>()

const state = reactive({
  roles: [...(props.initial?.roles ?? [])],
  instagram: props.initial?.instagram ?? '',
  website: props.initial?.website ?? '',
  city: (props.initial?.city ?? '') as '' | 'pereira' | 'dosquebradas',
  whatsapp: props.initial?.whatsapp ?? '',
  phone: props.initial?.phone ?? '',
  contributionTypes: [...(props.initial?.contributionTypes ?? [])],
  contributionDescription: props.initial?.contributionDescription ?? '',
})

const roleItems = SELF_ASSIGNABLE_ROLES.map((role) => ({ label: ROLE_LABELS[role], value: role }))
const cityItems = CITIES.map((city) => ({ label: CITY_LABELS[city], value: city }))
const needItems = NEED_TYPES.map((type) => ({ label: NEED_LABELS[type], value: type }))

function toggleRole(role: (typeof SELF_ASSIGNABLE_ROLES)[number], checked: boolean) {
  state.roles = checked ? [...new Set([...state.roles, role])] : state.roles.filter((item) => item !== role)
}

function toggleNeed(type: (typeof NEED_TYPES)[number], checked: boolean) {
  state.contributionTypes = checked
    ? [...new Set([...state.contributionTypes, type])]
    : state.contributionTypes.filter((item) => item !== type)
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="emit('submit', state)">
    <fieldset class="space-y-2">
      <legend class="text-sm font-medium">Roles</legend>
      <UCheckbox
        v-for="item in roleItems"
        :key="item.value"
        :model-value="state.roles.includes(item.value)"
        :label="item.label"
        @update:model-value="toggleRole(item.value, Boolean($event))"
      />
    </fieldset>
    <UFormField label="Ciudad">
      <USelect
        :model-value="state.city || undefined"
        :items="cityItems"
        placeholder="Pereira o Dosquebradas"
        class="w-full"
        @update:model-value="state.city = ($event || '') as typeof state.city"
      />
    </UFormField>
    <UFormField label="Instagram" hint="Público">
      <UInput v-model="state.instagram" class="w-full" />
    </UFormField>
    <UFormField label="Sitio web" hint="Público">
      <UInput v-model="state.website" type="url" class="w-full" />
    </UFormField>
    <UFormField label="WhatsApp" hint="Solo tras un match">
      <UInput v-model="state.whatsapp" class="w-full" />
    </UFormField>
    <UFormField label="Teléfono" hint="Solo tras un match">
      <UInput v-model="state.phone" class="w-full" />
    </UFormField>
    <fieldset class="space-y-2">
      <legend class="text-sm font-medium">Aportes que puedes ofrecer</legend>
      <UCheckbox
        v-for="item in needItems"
        :key="item.value"
        :model-value="state.contributionTypes.includes(item.value)"
        :label="item.label"
        @update:model-value="toggleNeed(item.value, Boolean($event))"
      />
    </fieldset>
    <UFormField label="Descripción del aporte">
      <UTextarea v-model="state.contributionDescription" class="w-full" />
    </UFormField>
    <UButton type="submit" label="Guardar perfil" :loading="pending" />
  </form>
</template>
