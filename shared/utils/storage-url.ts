import type { MediaBucket } from '../constants/media'

export function publicStorageUrl(supabaseUrl: string, bucket: MediaBucket, path: string | null | undefined) {
  if (!supabaseUrl || !path) return null
  const base = supabaseUrl.replace(/\/$/, '')
  return `${base}/storage/v1/object/public/${bucket}/${path}`
}

export const storagePublicUrl = publicStorageUrl

export function imageExtension(mime: string) {
  if (mime === 'image/jpeg') return 'jpg'
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  if (mime === 'image/avif') return 'avif'
  return null
}
