import { MEDIA_UPLOAD_CONCURRENCY, type MediaBucket } from '~~/shared/constants/media'
import { imageFileMetaSchema } from '~~/shared/schemas/media'
import { resizeImageFile } from '~~/shared/utils/resize-image'
import { runWithConcurrency } from '~~/shared/utils/run-with-concurrency'

function firstIssue(error: { issues: Array<{ message: string }> }) {
  return error.issues[0]?.message ?? 'Revisa el archivo'
}

export function useMediaUpload() {
  const db = useDb()

  async function uploadImage(input: { bucket: MediaBucket; path: string; file: File; upsert?: boolean }) {
    const parsed = imageFileMetaSchema.safeParse({ type: input.file.type, size: input.file.size })
    if (!parsed.success) return { error: firstIssue(parsed.error) }
    const file = await resizeImageFile(input.file)
    const afterResize = imageFileMetaSchema.safeParse({ type: file.type, size: file.size })
    if (!afterResize.success) return { error: firstIssue(afterResize.error) }
    const { error } = await db.storage.from(input.bucket).upload(input.path, file, {
      contentType: file.type,
      upsert: input.upsert ?? true,
    })
    if (error) return { error: error.message }
    return { error: null as string | null }
  }

  async function removeObject(bucket: MediaBucket, path: string | null | undefined) {
    if (!path) return { error: null as string | null }
    const { error } = await db.storage.from(bucket).remove([path])
    if (error) return { error: error.message }
    return { error: null as string | null }
  }

  async function uploadMany(input: {
    bucket: MediaBucket
    files: File[]
    pathFor: (file: File, index: number) => string
  }) {
    return runWithConcurrency(input.files, MEDIA_UPLOAD_CONCURRENCY, async (file, index) => {
      const path = input.pathFor(file, index)
      const result = await uploadImage({ bucket: input.bucket, path, file, upsert: false })
      return { path, error: result.error }
    })
  }

  return { uploadImage, removeObject, uploadMany }
}
