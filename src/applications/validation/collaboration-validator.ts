// src/applications/validation/collaboration-validator.ts

export interface CollaborationPayload {
    playlistId: string;
    userId: string;
}

export interface CollaborationValidator {
    validateCollaborationPayload(payload: unknown): CollaborationPayload;
}
