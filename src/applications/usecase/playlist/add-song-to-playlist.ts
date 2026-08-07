// src/applications/usecase/playlist/add-song-to-playlist.ts

import { PlaylistValidator } from "@/applications/validation/playlist-validator";
import { DomainErrorCode } from "@/commons/exception/constants/domain-error-code";
import { InvariantError } from "@/commons/exception/invariant-error";
import { CachedSongRepository } from "@/domains/cached-song/cached-song-repository";
import { PlaylistActivityRepository } from "@/domains/playlist-activity/playlist-activity-repository";
import { PlaylistSongRepository } from "@/domains/playlist-song/playlist-song-repository";
import { PlaylistRepository } from "@/domains/playlist/playlist-repository";
import { SongRepository } from "@/domains/song/song-repository";

interface AddSongToPlaylistUseCaseDependencies {
    playlistRepository: PlaylistRepository;
    playlistSongRepository: PlaylistSongRepository;
    playlistActivityRepository: PlaylistActivityRepository
    playlistValidator: PlaylistValidator;
    cachedSongRepository: CachedSongRepository;
    songRepository: SongRepository;
}

export class AddSongToPlaylistUseCase {
    private _playlistRepository: PlaylistRepository;
    private _playlistValidator: PlaylistValidator;
    private _cachedSongRepository: CachedSongRepository;
    private _songRepository: SongRepository;
    private _playlistSongRepository: PlaylistSongRepository;
    private _playlistActivityRepository: PlaylistActivityRepository;

    constructor(deps: AddSongToPlaylistUseCaseDependencies) {
        this._playlistRepository = deps.playlistRepository;
        this._playlistValidator = deps.playlistValidator;
        this._cachedSongRepository = deps.cachedSongRepository;
        this._songRepository = deps.songRepository;
        this._playlistSongRepository = deps.playlistSongRepository;
        this._playlistActivityRepository = deps.playlistActivityRepository;

    }

    async execute(playlistId: unknown, userId: string, payload: unknown): Promise<void> {

        if (typeof playlistId !== "string") {
            throw new InvariantError(DomainErrorCode.PLAYLIST_PARAMS_NOT_MEET_DATA_TYPE_SPESIFICATION)
        }
        // 1. Validasi structural body
        const { songId } = this._playlistValidator.validatePlaylistSongPayload(payload);

        // 2. Verifikasi akses (owner ATAU collaborator) + eksistensi playlist
        await this._playlistRepository.verifyPlaylistAccess(playlistId, userId);

        // 3. Validasi song benar-benar ada di tabel Song
        const isExist = await this._cachedSongRepository.verifySongExists(songId);
        if (!isExist) {
            const song = await this._songRepository.getSongById(songId);

            await this._cachedSongRepository.addCachedSong(song);
        }

        // 4. Tambah ke playlist + catat aktivitas "add"
        await this._playlistSongRepository.verifySongAlreadyExistInPlaylist(playlistId, songId)

        await this._playlistSongRepository.addSongToPlaylist({ playlistId, songId, userId });

        await this._playlistActivityRepository.addActivities({ playlistId, songId, userId, action: "add" })
    }
}
