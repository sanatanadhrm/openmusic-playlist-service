// src/domains/collaboration/collaboration-repository.ts
// Interface repository murni TypeScript — TIDAK BOLEH import library apapun

export interface AddCollaborationPayload {
    playlistId: string;
    userId: string; // userId collaborator yang ditambahkan (dari request body)
}

export interface RemoveCollaborationPayload {
    collaborationId: string
    playlistId: string;
    userId: string;
}

export interface AddedCollaboration {
    id: string;
    playlistId: string;
    userId: string;
}

export interface CollaborationRepository {
    // Tambah collaborator (throw jika sudah ada)
    addCollaboration(payload: AddCollaborationPayload): Promise<AddedCollaboration>;
    // Hapus collaborator (throw jika tidak ditemukan)
    removeCollaboration(collaborationId: string): Promise<void>;
    // Verifikasi user adalah collaborator dari playlist
    verifyCollaborationExist(playlistId: string, userId: string): Promise<string>;
    verifyCollaborationNotExist(playlistId: string, userId: string): Promise<void>;
}
