// src/applications/usecase/playlist/delete-playlist.ts
// Ownership check dilakukan DI USE CASE — sesuai spec & aturan arsitektur

import { DomainErrorCode } from "@/commons/exception/constants/domain-error-code";
import { PlaylistRepository } from "@/domains/playlist/playlist-repository";

interface DeletePlaylistUseCaseDependencies {
    playlistRepository: PlaylistRepository;
}

export class DeletePlaylistUseCase {
    private _playlistRepository: PlaylistRepository;

    constructor(deps: DeletePlaylistUseCaseDependencies) {
        this._playlistRepository = deps.playlistRepository;
    }

    async execute(playlistId: string, userId: string): Promise<void> {
        // 1. Cek eksistensi + ambil ownerId (throw NotFoundError jika tidak ada)
        const { ownerId } = await this._playlistRepository.getPlaylistOwnership(playlistId);

        // 2. Cek kepemilikan di use case — HANYA owner yang boleh hapus
        if (ownerId !== userId) {
            throw new Error(DomainErrorCode.PLAYLIST_ACCESS_FORBIDDEN);
        }

        // 3. Hapus
        await this._playlistRepository.deletePlaylist(playlistId);
    }
}
