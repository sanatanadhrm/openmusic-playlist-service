// src/applications/usecase/playlist/add-playlist.ts

import { PlaylistValidator } from "@/applications/validation/playlist-validator";
import { AddedPlaylist, PlaylistRepository } from "@/domains/playlist/playlist-repository";

interface AddPlaylistUseCaseDependencies {
    playlistRepository: PlaylistRepository;
    playlistValidator: PlaylistValidator;
}

export class AddPlaylistUseCase {
    private _playlistRepository: PlaylistRepository;
    private _playlistValidator: PlaylistValidator;

    constructor(deps: AddPlaylistUseCaseDependencies) {
        this._playlistRepository = deps.playlistRepository;
        this._playlistValidator = deps.playlistValidator;
    }

    // ownerId berasal dari req.user.id (sudah terverifikasi JWT di middleware)
    async execute(payload: unknown, ownerId: string): Promise<AddedPlaylist> {
        const { name } = this._playlistValidator.validatePlaylistPayload(payload);
        return this._playlistRepository.addPlaylist({ name, ownerId });
    }
}
