// src/applications/usecase/collaboration/remove-collaboration.ts

import { CollaborationValidator } from "@/applications/validation/collaboration-validator";
import { DomainErrorCode } from "@/commons/exception/constants/domain-error-code";
import { CollaborationRepository } from "@/domains/collaboration/collaboration-repository";
import { PlaylistRepository } from "@/domains/playlist/playlist-repository";

interface RemoveCollaborationUseCaseDependencies {
    collaborationRepository: CollaborationRepository;
    playlistRepository: PlaylistRepository;
    collaborationValidator: CollaborationValidator;
}

export class RemoveCollaborationUseCase {
    private _collaborationRepository: CollaborationRepository;
    private _playlistRepository: PlaylistRepository;
    private _collaborationValidator: CollaborationValidator;

    constructor(deps: RemoveCollaborationUseCaseDependencies) {
        this._collaborationRepository = deps.collaborationRepository;
        this._playlistRepository = deps.playlistRepository;
        this._collaborationValidator = deps.collaborationValidator;
    }

    async execute(requesterId: string, payload: unknown): Promise<void> {
        // 1. Validasi structural body
        const { playlistId, userId } = this._collaborationValidator.validateCollaborationPayload(payload);

        // 2. Cek playlist ada + ambil ownerId
        const { ownerId } = await this._playlistRepository.getPlaylistOwnership(playlistId);

        // 3. Hanya owner yang boleh hapus collaborator
        if (ownerId !== requesterId) {
            throw new Error(DomainErrorCode.COLLABORATION_ACCESS_FORBIDDEN);
        }

        const id = await this._collaborationRepository.verifyCollaborationExist(playlistId, userId);

        // 4. Hapus collaboration (repository throw NotFoundError jika tidak ada)
        await this._collaborationRepository.removeCollaboration(id);
    }
}
