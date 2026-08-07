// src/applications/storage/storage-service.ts
// Interface untuk layanan penyimpanan file (bisa AWS S3 atau Local Storage)

export interface FilePayload {
    filename: string;
    contentType: string;
    buffer: Buffer;
}

export interface StorageService {
    writeFile(file: FilePayload, meta: unknown): Promise<string>;
}
