import path from "node:path";
import { createLocalStorageProvider, IProductStorageProvider, IStoredImageResult, IUploadedImageFile } from "../storage/local-storage-provider";

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const DEFAULT_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export class UploadServiceError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'UploadServiceError';
    this.statusCode = statusCode;
  }
}

export interface IProductImageUploadServiceOptions {
  storageProvider: IProductStorageProvider;
  maxBytes?: number;
}

export interface IProductImageUploadService {
  uploadImage(file: IUploadedImageFile | undefined | null): Promise<IStoredImageResult>;
  removeImage(key: string | undefined | null): Promise<void>;
}

class ProductImageUploadService {
  private provider?: IProductStorageProvider;

  private getProvider(): IProductStorageProvider {
    if (this.provider) return this.provider;

    const uploadRoot = path.resolve(process.env.UPLOAD_DIR || 'uploads');
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';

    this.provider = createLocalStorageProvider({
      uploadRoot,
      baseUrl,
    });

    return this.provider;
  }

  private getMaxBytes(): number {
    const rawLimit = process.env.UPLOAD_MAX_BYTES;
    if (!rawLimit) return DEFAULT_MAX_BYTES;

    const parsed = Number(rawLimit);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      throw new Error('UPLOAD_MAX_BYTES must be a positive number');
    }

    return parsed;
  }

  async upload(
    file: IUploadedImageFile | undefined | null
  ): Promise<IStoredImageResult> {
    if (!file) {
      throw new UploadServiceError(400, 'No image file provided');
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      throw new UploadServiceError(
        400,
        'Only JPEG, PNG, and WebP images are allowed'
      );
    }

    const maxBytes = this.getMaxBytes();
    if (typeof file.size === 'number' && file.size > maxBytes) {
      const maxMb = (maxBytes / (1024 * 1024)).toFixed(0);
      throw new UploadServiceError(
        413,
        `Image must be ${maxMb} MB or smaller`
      );
    }

    return this.getProvider().uploadProductImage(file);
  }

  async remove(key: string | undefined | null): Promise<void> {
    if (!key) return;
    await this.getProvider().deleteByKey(key);
  }
}

export const productImageUploadService = new ProductImageUploadService();