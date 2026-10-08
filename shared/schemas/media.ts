import { z } from 'zod'
import { IMAGE_MAX_BYTES, IMAGE_MIME, MAX_EVIDENCE_PHOTOS, MAX_VENUE_GALLERY } from '../constants/media'

export const imageFileMetaSchema = z.object({
  type: z.enum(IMAGE_MIME, { error: 'Cada foto debe ser jpeg, png, webp o avif.' }),
  size: z.number().int().positive('El archivo está vacío.').max(IMAGE_MAX_BYTES, 'Cada foto debe pesar hasta 5 MB.'),
})

export type ImageFileMeta = z.infer<typeof imageFileMetaSchema>

export function imageFilesSchema(maxCount: number, maxMessage: string) {
  return z.array(imageFileMetaSchema).max(maxCount, maxMessage)
}

export const evidenceFilesSchema = imageFilesSchema(
  MAX_EVIDENCE_PHOTOS,
  `Puedes adjuntar hasta ${MAX_EVIDENCE_PHOTOS} fotos.`,
)

export const venueGalleryFilesSchema = imageFilesSchema(
  MAX_VENUE_GALLERY,
  `La galería admite hasta ${MAX_VENUE_GALLERY} fotos.`,
)

export const avatarFilesSchema = imageFilesSchema(1, 'Sube una sola foto de perfil.')
export const venueCoverFilesSchema = imageFilesSchema(1, 'Sube una sola portada.')
export const sponsorSupportPhotoFilesSchema = imageFilesSchema(1, 'Sube una sola foto de apoyo.')

export function fileToMeta(file: { type: string; size: number }) {
  return { type: file.type, size: file.size }
}
