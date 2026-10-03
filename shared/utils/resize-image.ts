import { IMAGE_MAX_EDGE, IMAGE_RESIZE_QUALITY } from '../constants/media'

type CanvasLike = {
  width: number
  height: number
  getContext: (id: '2d') => {
    drawImage: (image: unknown, dx: number, dy: number, dw: number, dh: number) => void
  } | null
  toBlob: (callback: (blob: Blob | null) => void, type?: string, quality?: number) => void
}

export async function resizeImageFile(
  file: File,
  maxEdge = IMAGE_MAX_EDGE,
  quality = IMAGE_RESIZE_QUALITY,
): Promise<File> {
  const doc = (globalThis as { document?: { createElement: (name: string) => CanvasLike } }).document
  if (typeof createImageBitmap !== 'function' || !doc) return file
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
  if (scale === 1 && file.size <= 400_000) {
    bitmap.close()
    return file
  }
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = doc.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) {
    bitmap.close()
    return file
  }
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/webp', quality)
  })
  if (!blob) return file
  return new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' })
}
