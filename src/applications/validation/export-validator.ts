// src/applications/validation/export-validator.ts

export interface ExportPlaylistPayload {
    targetEmail: string;
}

export interface ExportValidator {
    validateExportPlaylistPayload(payload: unknown): ExportPlaylistPayload;
}
