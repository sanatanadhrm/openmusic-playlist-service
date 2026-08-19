// src/applications/usecase/collaboration/add-collaboration.ts
// Mengikuti pola LoginUserUseCase — inject DUA repository lewat interface

import { CachedSongValidator } from "@/applications/validation/cached-song-validator";
import { CachedSongRepository } from "@/domains/cached-song/cached-song-repository";

interface UpdateCachedSongUseCaseDependencies {
    cachedSongValidator: CachedSongValidator;
    cachedSongRepository: CachedSongRepository
}

export class UpdateCachedSongUseCase {
    private _cachedSongValidator: CachedSongValidator;
    private _cachedSongRepository: CachedSongRepository;

    constructor(deps: UpdateCachedSongUseCaseDependencies) {
        this._cachedSongValidator = deps.cachedSongValidator;
        this._cachedSongRepository = deps.cachedSongRepository
    }

    // requesterId = req.user.id (dari JWT, bukan dari body)
    async execute(payload: unknown): Promise<void> {
        const cachedSongPayload = this._cachedSongValidator.validateCachedSongPayload(payload);

        return this._cachedSongRepository.updateInsertCachedSong(cachedSongPayload);
    }
}
