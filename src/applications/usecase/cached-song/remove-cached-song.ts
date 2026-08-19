

import { DomainErrorCode } from "@/commons/exception/constants/domain-error-code";
import { InvariantError } from "@/commons/exception/invariant-error";
import { CachedSongRepository } from "@/domains/cached-song/cached-song-repository";

interface RemoveCachedSongUseCaseDependencies {
    cachedSongRepository: CachedSongRepository
}

export class RemoveCachedSongUseCase {
    private _cachedSongRepository: CachedSongRepository;

    constructor(deps: RemoveCachedSongUseCaseDependencies) {
        this._cachedSongRepository = deps.cachedSongRepository
    }

    // requesterId = req.user.id (dari JWT, bukan dari body)
    async execute(id: unknown): Promise<void> {
        if (typeof id !== "string") throw new InvariantError(DomainErrorCode.SONG_NOT_MEET_DATA_TYPE_SPECIFICATION);
        return this._cachedSongRepository.removeCachedSong(id);
    }
}
