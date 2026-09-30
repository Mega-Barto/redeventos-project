<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { loginSchema } from '~~/shared/schemas/inputs'

definePageMeta({ layout: 'auth', middleware: 'guest' })

useSeoMeta({ title: 'Entrar', description: 'Entra a tu cuenta de Redeventos.' })

type LoginInput = { email: string; password: string }
const state = reactive<LoginInput>({ email: '', password: '' })
const errorMessage = ref('')
const pending = ref(false)
const route = useRoute()

async function onSubmit(event: FormSubmitEvent<LoginInput>) {
  errorMessage.value = ''
  pending.value = true
  const parsed = loginSchema.safeParse(event.data)
  if (!parsed.success) {
    pending.value = false
    return
  }
  const { error } = await useDb().auth.signInWithPassword(parsed.data)
  pending.value = false
  if (error) {
    errorMessage.value = 'Correo o contraseña incorrectos.'
    return
  }
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/app'
  await navigateTo(redirect.startsWith('/') ? redirect : '/app')
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-semibold">Entrar</h1>
    <p class="text-sm text-muted">Usa el correo y la contraseña de tu cuenta.</p>
    <UAlert v-if="errorMessage" color="error" variant="subtle" :title="errorMessage" />
    <UForm :schema="loginSchema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField name="email" label="Correo" required>
        <UInput v-model="state.email" type="email" autocomplete="email" class="w-full" />
      </UFormField>
      <UFormField name="password" label="Contraseña" required>
        <UInput v-model="state.password" type="password" autocomplete="current-password" class="w-full" />
      </UFormField>
      <UButton type="submit" label="Entrar" :loading="pending" block />
    </UForm>
    <p class="text-sm text-muted">
      ¿Aún no tienes cuenta?
      <NuxtLink to="/registro" class="text-primary">Crear cuenta</NuxtLink>
    </p>
  </div>
</template>
