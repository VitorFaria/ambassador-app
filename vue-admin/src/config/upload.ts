const DEFAULT_MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB

function parseMaxImageBytes(): number {
  const raw = import.meta.env.VITE_MAX_IMAGE_BYTES
  if (!raw) return DEFAULT_MAX_IMAGE_BYTES

  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MAX_IMAGE_BYTES
}

export const MAX_IMAGE_BYTES = parseMaxImageBytes()
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']