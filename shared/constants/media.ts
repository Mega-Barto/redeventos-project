export const IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const
export type ImageMime = (typeof IMAGE_MIME)[number]

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024
export const MAX_EVIDENCE_PHOTOS = 8
export const MAX_VENUE_GALLERY = 8
export const IMAGE_MAX_EDGE = 1600
export const IMAGE_RESIZE_QUALITY = 0.8
export const MEDIA_UPLOAD_CONCURRENCY = 3

export const MEDIA_BUCKETS = ['profiles', 'venues', 'evidence'] as const
export type MediaBucket = (typeof MEDIA_BUCKETS)[number]

export const IMAGE_EXTENSIONS: Record<ImageMime, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}
