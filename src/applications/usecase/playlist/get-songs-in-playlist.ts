import { DomainErrorCode } from "@/commons/exception/constants/domain-error-code";
import { InvariantError } from "@/commons/exception/invariant-error";
import { PaginatedResult } from "@/commons/pagination/pagination-result";
import { PlaylistSongRepository, SongInPlaylist } from "@/domains/playlist-song/playlist-song-repository";
import { PlaylistRepository } from "@/domains/playlist/playlist-repository";
import { PlaylistValidator } from "@/applications/validation/playlist-validator";
import { LoggerService } from "@/applications/logger/logger-service";

interface GetSongsInPlaylistUseCaseDependencies {
    playlistRepository: PlaylistRepository;
    playlistSongRepository: PlaylistSongRepository;
    playlistValidator: PlaylistValidator;
    loggerService?: LoggerService;
}

export class GetSongsInPlaylistUseCase {
    private _playlistRepository: PlaylistRepository;
    private _playlistSongRepository: PlaylistSongRepository;
    private _playlistValidator: PlaylistValidator;
    private _loggerService?: LoggerService;

    constructor(deps: GetSongsInPlaylistUseCaseDependencies) {
        this._playlistRepository = deps.playlistRepository;
        this._playlistSongRepository = deps.playlistSongRepository;
        this._playlistValidator = deps.playlistValidator;
        this._loggerService = deps.loggerService;
    }

    async execute(playlistId: unknown, userId: string, query?: unknown): Promise<PaginatedResult<SongInPlaylist>> {
        this._loggerService?.info("GetSongsInPlaylistUseCase: Executing get songs in playlist");
        if (typeof playlistId !== "string") {
            throw new InvariantError(DomainErrorCode.PLAYLIST_PARAMS_NOT_MEET_DATA_TYPE_SPESIFICATION);
        }
        await this._playlistRepository.verifyPlaylistAccess(playlistId, userId);

        const params = this._playlistValidator.validatePlaylistSongListParams(query ?? {});
        const result = await this._playlistSongRepository.getSongsByPlaylistId(playlistId, params);
        this._loggerService?.info(`GetSongsInPlaylistUseCase: Retrieved ${result.data.length} songs in playlist`);
        return result;
    }
}
