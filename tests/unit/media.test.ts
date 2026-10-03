import { describe, expect, it } from 'vitest'
import { IMAGE_MAX_BYTES, MAX_EVIDENCE_PHOTOS } from '../../shared/constants/media'
import { evidenceFilesSchema, imageFileMetaSchema } from '../../shared/schemas/media'
import { asFileList, mediaFigureAttrs, publicMediaOnly } from '../../shared/utils/public-media'
import { resizeImageFile } from '../../shared/utils/resize-image'
import { publicStorageUrl } from '../../shared/utils/storage-url'

describe('validación de imágenes', () => {
  it('acepta un jpeg dentro del límite', () => {
    const parsed = imageFileMetaSchema.safeParse({ type: 'image/jpeg', size: 1200 })
    expect(parsed.success).toBe(true)
  })

  it('rechaza un tipo no permitido con mensaje en español', () => {
    const parsed = imageFileMetaSchema.safeParse({ type: 'application/pdf', size: 1200 })
    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toMatch(/jpeg, png, webp o avif/)
    }
  })

  it('rechaza un archivo que supera 5 MB', () => {
    const parsed = imageFileMetaSchema.safeParse({ type: 'image/png', size: IMAGE_MAX_BYTES + 1 })
    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toMatch(/5 MB/)
    }
  })

  it('limita la cantidad de fotos de evidencia', () => {
    const files = Array.from({ length: MAX_EVIDENCE_PHOTOS + 1 }, () => ({ type: 'image/webp', size: 100 }))
    const parsed = evidenceFilesSchema.safeParse(files)
    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toMatch(/hasta/)
    }
  })
})

describe('URLs públicas de Storage', () => {
  it('arma la URL pública sin barra duplicada', () => {
    expect(publicStorageUrl('https://example.supabase.co/', 'venues', 'abc/cover.webp')).toBe(
      'https://example.supabase.co/storage/v1/object/public/venues/abc/cover.webp',
    )
  })

  it('devuelve null si no hay path', () => {
    expect(publicStorageUrl('https://example.supabase.co', 'profiles', null)).toBeNull()
  })
})

describe('presentación pública', () => {
  it('solo deja media con is_public', () => {
    expect(
      publicMediaOnly([
        { id: '1', is_public: true },
        { id: '2', is_public: false },
        { id: '3' },
      ]),
    ).toEqual([{ id: '1', is_public: true }])
  })

  it('marca la portada como LCP y el resto como lazy', () => {
    expect(mediaFigureAttrs({ alt: 'Portada del espacio Café', priority: true })).toMatchObject({
      alt: 'Portada del espacio Café',
      loading: 'eager',
      fetchpriority: 'high',
    })
    expect(mediaFigureAttrs({ alt: 'Foto de evidencia del evento 2' })).toMatchObject({
      loading: 'lazy',
      decoding: 'async',
    })
  })

  it('normaliza File y listas de File', () => {
    const file = new File(['x'], 'a.jpg', { type: 'image/jpeg' })
    expect(asFileList(file)).toHaveLength(1)
    expect(asFileList([file, file])).toHaveLength(2)
    expect(asFileList(null)).toEqual([])
  })
})

describe('resize en Node', () => {
  it('devuelve el archivo original si no hay canvas', async () => {
    const file = new File([new Uint8Array(32)], 'foto.png', { type: 'image/png' })
    const result = await resizeImageFile(file)
    expect(result).toBe(file)
  })
})
