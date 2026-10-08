<script setup lang="ts">
import {
  CITIES,
  COMMITMENT_VERSION,
  LOCAL_CONTRIBUTION_TYPES,
  type LocalContributionType,
  PRIVACY_VERSION,
  type Role,
  SELF_ASSIGNABLE_ROLES,
} from '~~/shared/constants/domain'
import { CITY_LABELS, NEED_LABELS, ROLE_LABELS } from '~~/shared/constants/labels'
import { commitmentContent } from '~~/shared/content/legal'
import { mediaContent } from '~~/shared/content/media'
import { onboardingSchema, registerAccountSchema } from '~~/shared/schemas/inputs'
import { internalRedirectPath } from '~~/shared/utils/internal-path'
import { asFileList } from '~~/shared/utils/public-media'
import { missingSponsorPhotoMessage, requiredSponsorPhotoKinds } from '~~/shared/utils/sponsor-photos'

definePageMeta({ layout: 'auth' })

useSeoMeta({
  title: 'Crear cuenta',
  description: 'Regístrate con el aviso de privacidad y el compromiso de registro.',
})

const route = useRoute()
const userId = useUserId()
const step = ref<'cuenta' | 'red'>('cuenta')
const errorMessage = ref('')
const pending = ref(false)
const venueSponsorPhoto = ref<File | File[] | null>(null)
const localSponsorPhoto = ref<File | File[] | null>(null)

const account = reactive({
  displayName: '',
  email: '',
  password: '',
  privacyAccepted: false,
})

const preset = SELF_ASSIGNABLE_ROLES.find((role) => role === (route.query.role ?? route.query.rol))
const network = reactive({
  commitmentAccepted: false,
  roles: (preset ? [preset] : []) as Array<(typeof SELF_ASSIGNABLE_ROLES)[number]>,
  instagram: '',
  website: '',
  city: '' as '' | 'pereira' | 'dosquebradas',
  whatsapp: '',
  phone: '',
  contributionTypes: [] as LocalContributionType[],
  contributionDescription: '',
})

const wantsVenue = computed(() => network.roles.includes('venue_sponsor'))
const wantsLocal = computed(() => network.roles.includes('local_sponsor'))

watch(
  userId,
  (id) => {
    if (id) step.value = 'red'
  },
  { immediate: true },
)

const roleItems = SELF_ASSIGNABLE_ROLES.map((role) => ({
  label: ROLE_LABELS[role],
  value: role,
}))
const cityItems = CITIES.map((city) => ({ label: CITY_LABELS[city], value: city }))
const needItems = LOCAL_CONTRIBUTION_TYPES.map((type) => ({ label: NEED_LABELS[type], value: type }))

function toggleRole(role: (typeof SELF_ASSIGNABLE_ROLES)[number], checked: boolean) {
  network.roles = checked ? [...new Set([...network.roles, role])] : network.roles.filter((item) => item !== role)
  if (!network.roles.includes('venue_sponsor')) venueSponsorPhoto.value = null
  if (!network.roles.includes('local_sponsor')) localSponsorPhoto.value = null
}

async function createAccount() {
  errorMessage.value = ''
  const parsed = registerAccountSchema.safeParse(account)
  if (!parsed.success) {
    errorMessage.value = parsed.error.issues[0]?.message ?? 'Revisa el formulario'
    return
  }
  pending.value = true
  const { data, error } = await useDb().auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { display_name: parsed.data.displayName } },
  })
  pending.value = false
  if (error) {
    errorMessage.value = 'No se pudo crear la cuenta. Si ya existe, entra con tu correo.'
    return
  }
  if (!data.session) {
    errorMessage.value = 'Revisa tu correo para confirmar la cuenta y luego entra.'
    return
  }
  step.value = 'red'
}

async function joinNetwork() {
  errorMessage.value = ''
  const parsed = onboardingSchema.safeParse(network)
  if (!parsed.success) {
    errorMessage.value = parsed.error.issues[0]?.message ?? 'Revisa el formulario'
    return
  }
  const id = useUserId().value
  if (!id) {
    errorMessage.value = 'Entra de nuevo para terminar el registro.'
    return
  }

  for (const kind of requiredSponsorPhotoKinds(parsed.data.roles)) {
    const file = asFileList(kind === 'venue_sponsor' ? venueSponsorPhoto.value : localSponsorPhoto.value)[0]
    if (!file) {
      errorMessage.value = missingSponsorPhotoMessage(kind)
      return
    }
  }

  pending.value = true
  const db = useDb()
  const profileResult = await db
    .from('profiles')
    .update({
      instagram: parsed.data.instagram,
      website: parsed.data.website,
      city: parsed.data.city,
      contribution_types: parsed.data.contributionTypes,
      contribution_description: parsed.data.contributionDescription,
    })
    .eq('id', id)
  if (profileResult.error) {
    pending.value = false
    errorMessage.value = profileResult.error.message
    return
  }
  const directResult = await db
    .from('profile_direct_contacts')
    .update({ whatsapp: parsed.data.whatsapp, phone: parsed.data.phone })
    .eq('profile_id', id)
  if (directResult.error) {
    pending.value = false
    errorMessage.value = directResult.error.message
    return
  }
  await db.from('registration_commitments').insert({
    profile_id: id,
    privacy_version: PRIVACY_VERSION,
    commitment_version: COMMITMENT_VERSION,
  })
  await db.from('profile_roles').delete().eq('profile_id', id).neq('role', 'moderator')
  const roleResult = await db.from('profile_roles').insert(
    parsed.data.roles.map((role) => ({
      profile_id: id,
      role: role as Role,
    })),
  )
  if (roleResult.error) {
    pending.value = false
    errorMessage.value = roleResult.error.message
    return
  }

  const venueFile = asFileList(venueSponsorPhoto.value)[0]
  if (parsed.data.roles.includes('venue_sponsor') && venueFile) {
    const photo = await saveVenueSponsorPhoto(id, venueFile)
    if (photo.error) {
      pending.value = false
      errorMessage.value = photo.error
      return
    }
  }
  const localFile = asFileList(localSponsorPhoto.value)[0]
  if (parsed.data.roles.includes('local_sponsor') && localFile) {
    const photo = await saveLocalSponsorPhoto(id, localFile)
    if (photo.error) {
      pending.value = false
      errorMessage.value = photo.error
      return
    }
  }

  pending.value = false
  await navigateTo(internalRedirectPath(route.query.redirect))
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-semibold">Crear cuenta</h1>
    <UAlert v-if="errorMessage" color="error" variant="subtle" :title="errorMessage" />

    <form v-if="step === 'cuenta'" class="space-y-4" @submit.prevent="createAccount">
      <UFormField label="Nombre" required>
        <UInput v-model="account.displayName" autocomplete="name" class="w-full" />
      </UFormField>
      <UFormField label="Correo" required>
        <UInput v-model="account.email" type="email" autocomplete="email" class="w-full" />
      </UFormField>
      <UFormField label="Contraseña" required>
        <UInput v-model="account.password" type="password" autocomplete="new-password" class="w-full" />
      </UFormField>
      <UCheckbox v-model="account.privacyAccepted" label="Leí el aviso de privacidad" />
      <p class="text-sm">
        <NuxtLink to="/privacy" class="text-primary">Abrir aviso de privacidad</NuxtLink>
      </p>
      <UButton type="submit" label="Continuar" :loading="pending" block />
    </form>

    <form v-else class="space-y-4" @submit.prevent="joinNetwork">
      <p class="text-sm text-muted">{{ commitmentContent.intro }}</p>
      <ul class="list-disc space-y-2 pl-5 text-sm text-muted">
        <li v-for="rule in commitmentContent.rules" :key="rule">{{ rule }}</li>
      </ul>
      <UCheckbox v-model="network.commitmentAccepted" label="Acepto el compromiso de registro" />
      <fieldset class="space-y-2">
        <legend class="text-sm font-medium">Roles</legend>
        <UCheckbox
          v-for="item in roleItems"
          :key="item.value"
          :model-value="network.roles.includes(item.value)"
          :label="item.label"
          @update:model-value="toggleRole(item.value, Boolean($event))"
        />
      </fieldset>
      <AppMediaFileField
        v-if="wantsVenue"
        v-model="venueSponsorPhoto"
        :label="mediaContent.venueSponsorPhotoLabel"
        :hint="mediaContent.venueSponsorPhotoHint"
      />
      <AppMediaFileField
        v-if="wantsLocal"
        v-model="localSponsorPhoto"
        :label="mediaContent.localSponsorPhotoLabel"
        :hint="mediaContent.localSponsorPhotoHint"
      />
      <UFormField label="Ciudad">
        <USelect
          :model-value="network.city || undefined"
          :items="cityItems"
          placeholder="Pereira o Dosquebradas"
          class="w-full"
          @update:model-value="network.city = ($event || '') as typeof network.city"
        />
      </UFormField>
      <UFormField label="Instagram" hint="Público">
        <UInput v-model="network.instagram" class="w-full" />
      </UFormField>
      <UFormField label="Sitio web" hint="Público">
        <UInput v-model="network.website" type="url" class="w-full" />
      </UFormField>
      <UFormField label="WhatsApp" hint="Solo tras un match">
        <UInput v-model="network.whatsapp" class="w-full" />
      </UFormField>
      <UFormField label="Teléfono" hint="Solo tras un match">
        <UInput v-model="network.phone" class="w-full" />
      </UFormField>
      <fieldset v-if="wantsLocal" class="space-y-2">
        <legend class="text-sm font-medium">Aportes que puedes ofrecer</legend>
        <UCheckbox
          v-for="item in needItems"
          :key="item.value"
          :model-value="network.contributionTypes.includes(item.value)"
          :label="item.label"
          @update:model-value="
            network.contributionTypes = $event
              ? [...network.contributionTypes, item.value]
              : network.contributionTypes.filter((type) => type !== item.value)
          "
        />
      </fieldset>
      <UFormField v-if="wantsLocal" label="Descripción del aporte">
        <UTextarea v-model="network.contributionDescription" class="w-full" />
      </UFormField>
      <UButton type="submit" label="Entrar a la red" :loading="pending" block />
    </form>
  </div>
</template>
