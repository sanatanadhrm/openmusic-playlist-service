// src/applications/usecase/collaboration/add-collaboration.ts
// Mengikuti pola LoginUserUseCase — inject DUA repository lewat interface

import { CollaborationValidator } from "@/applications/validation/collaboration-validator";
import { DomainErrorCode } from "@/commons/exception/constants/domain-error-code";
import { AddedCollaboration, CollaborationRepository } from "@/domains/collaboration/collaboration-repository";
import { PlaylistRepository } from "@/domains/playlist/playlist-repository";
import { UserRepository } from "@/domains/user/user-repository";

interface AddCollaborationUseCaseDependencies {
    collaborationRepository: CollaborationRepository;
    playlistRepository: PlaylistRepository;    // untuk cek ownership
    collaborationValidator: CollaborationValidator;
    userRepository: UserRepository
}

export class AddCollaborationUseCase {
    private _collaborationRepository: CollaborationRepository;
    private _playlistRepository: PlaylistRepository;
    private _collaborationValidator: CollaborationValidator;
    private _userRepository: UserRepository;

    constructor(deps: AddCollaborationUseCaseDependencies) {
        this._collaborationRepository = deps.collaborationRepository;
        this._playlistRepository = deps.playlistRepository;
        this._collaborationValidator = deps.collaborationValidator;
        this._userRepository = deps.userRepository
    }

    // requesterId = req.user.id (dari JWT, bukan dari body)
    async execute(requesterId: string, payload: unknown): Promise<AddedCollaboration> {
        // 1. Validasi structural body
        const { playlistId, userId } = this._collaborationValidator.validateCollaborationPayload(payload);

        // 2. Cek playlist ada + ambil ownerId
        const { ownerId } = await this._playlistRepository.getPlaylistOwnership(playlistId);

        // 3. Hanya owner yang boleh tambah collaborator
        if (ownerId !== requesterId) {
            throw new Error(DomainErrorCode.COLLABORATION_ACCESS_FORBIDDEN);
        }

        // 4. Verifikasi user target ada di database
        await this._userRepository.verifyUserExists(userId);

        // 5. Tambah collaboration
        await this._collaborationRepository.verifyCollaborationNotExist(playlistId, userId);

        return this._collaborationRepository.addCollaboration({ playlistId, userId });
    }
}
