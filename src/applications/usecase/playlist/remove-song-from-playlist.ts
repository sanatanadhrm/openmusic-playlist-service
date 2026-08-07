// src/applications/usecase/playlist/remove-song-from-playlist.ts

import { PlaylistValidator } from "@/applications/validation/playlist-validator";
import { PlaylistActivityRepository } from "@/domains/playlist-activity/playlist-activity-repository";
import { PlaylistSongRepository } from "@/domains/playlist-song/playlist-song-repository";
import { PlaylistRepository } from "@/domains/playlist/playlist-repository";

interface RemoveSongFromPlaylistUseCaseDependencies {
    playlistRepository: PlaylistRepository;
    playlistActivityRepository: PlaylistActivityRepository;
    playlistSongRepository: PlaylistSongRepository;
    playlistValidator: PlaylistValidator;
}

export class RemoveSongFromPlaylistUseCase {
    private _playlistRepository: PlaylistRepository;
    private _playlistValidator: PlaylistValidator;
    private _playlistSongRepository: PlaylistSongRepository;
    private _playlistActivityRepository: PlaylistActivityRepository;

    constructor(deps: RemoveSongFromPlaylistUseCaseDependencies) {
        this._playlistRepository = deps.playlistRepository;
        this._playlistValidator = deps.playlistValidator;
        this._playlistSongRepository = deps.playlistSongRepository;
        this._playlistActivityRepository = deps.playlistActivityRepository;
    }

    async execute(playlistId: string, userId: string, payload: unknown): Promise<void> {
        // 1. Validasi structural body
        const { songId } = this._playlistValidator.validatePlaylistSongPayload(payload);

        // 2. Verifikasi akses
        await this._playlistRepository.verifyPlaylistAccess(playlistId, userId);

        // 3. Hapus dari playlist + catat aktivitas "delete"
        const playlistSongId = await this._playlistSongRepository.verifySongInPlaylist(playlistId, songId);

        await this._playlistSongRepository.removeSongFromPlaylist(playlistSongId, playlistId);
        await this._playlistActivityRepository.addActivities({ playlistId, songId, userId, action: "delete" });
    }
}
