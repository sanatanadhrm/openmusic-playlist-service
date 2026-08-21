// src/Infrastructures/storage/local/local-storage-service.ts
// Menyimpan file ke local filesystem menggunakan fs/promises

import fs from "fs/promises";
import path from "path";
import { FilePayload, StorageService } from "@/applications/storage/storage-service";

export class LocalStorageService implements StorageService {
    private _folder: string;

    constructor(folder: string = path.resolve(process.cwd(), "uploads", "file", "images")) {
        this._folder = folder;

        // Pastikan folder tersedia saat inisialisasi
        this._createFolderIfNotExist();
    }

    private async _createFolderIfNotExist() {
        try {
            await fs.access(this._folder);
        } catch {
            await fs.mkdir(this._folder, { recursive: true });
        }
    }

    async writeFile(file: FilePayload, meta: unknown): Promise<string> {
        // Buat nama unik agar tidak bentrok
        const filename = +new Date() + String(meta) + path.extname(file.filename);
        const pathToFile = path.join(this._folder, filename);

        await fs.writeFile(pathToFile, file.buffer);

        // Kembalikan URL absolut ke file
        // Asumsi HOST dan PORT ada di environment
        const host = process.env.HOST || "localhost";
        const port = process.env.PORT || 5000;
        return `http://${host}:${port}/upload/images/${filename}`;
    }
}
