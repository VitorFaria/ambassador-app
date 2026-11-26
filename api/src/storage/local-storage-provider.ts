import path from "node:path";
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

export interface IUploadedImageFile {
  mimetype: string;
  buffer: Buffer;
  size?: number;
  originalname?: string;
}

export interface IStoredImageResult {
  key: string;
  url: string;
}

export interface ILocalStorageProviderOptions {
  uploadRoot: string;
  baseUrl: string;
}

export interface IProductStorageProvider {
  uploadProductImage(file: IUploadedImageFile): Promise<IStoredImageResult>;
  deleteByKey(key: string): Promise<void>;
}

export class StorageHttpError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'StorageHttpError';
    this.statusCode = statusCode;
  }
}

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

export function createLocalStorageProvider({
  uploadRoot,
  baseUrl
}: ILocalStorageProviderOptions): IProductStorageProvider {
  const productsDir = path.join(uploadRoot, 'products');
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  
  return {
    async uploadProductImage(file: IUploadedImageFile): Promise<IStoredImageResult> {
      const ext = MIME_TO_EXT[file.mimetype];
      if (!ext) {
        throw new StorageHttpError(400, 'Unsupported image type')
      }

      await fs.mkdir(productsDir, { recursive: true});

      const filename = `${crypto.randomUUID()}${ext}`;
      const diskPath = path.join(productsDir, filename);
      await fs.writeFile(diskPath, file.buffer);

      const key = `products/${filename}`;
      const url = `${normalizedBaseUrl}/uploads/${key}`;
      
      return { key, url };
    },

    async deleteByKey(key: string): Promise<void> {
      if (!key) return;
      const safeKey = path.normalize(key).replace(/^(\.\.[/\\])+/, '');
      const diskPath = path.join(uploadRoot, safeKey);
      await fs.rm(diskPath, { force: true});
    },
  }
}

