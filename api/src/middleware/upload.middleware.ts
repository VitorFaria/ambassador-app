import multer from 'multer';

const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;

function getMaxUploadBytes(): number {
  const rawLimit = process.env.UPLOAD_MAX_BYTES;
  if (!rawLimit) return DEFAULT_MAX_BYTES;

  const parsed = Number(rawLimit);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MAX_BYTES;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: getMaxUploadBytes() },
});

export const uploadProductImageMiddleware = upload.single('image');