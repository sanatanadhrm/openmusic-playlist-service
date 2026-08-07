// src/applications/usecase/playlist/get-playlists.ts

import { PlaylistRepository, Playlists, PlaylistSummary } from "@/domains/playlist/playlist-repository";
import { UserRepository } from "@/domains/user/user-repository";

interface GetPlaylistsUseCaseDependencies {
    playlistRepository: PlaylistRepository;
    userRepository: UserRepository
}

export class GetPlaylistsUseCase {
    private _playlistRepository: PlaylistRepository;
    private _userRepository: UserRepository;

    constructor(deps: GetPlaylistsUseCaseDependencies) {
        this._playlistRepository = deps.playlistRepository;
        this._userRepository = deps.userRepository
    }

    // userId dari req.user.id — repository akan filter owner + collaborator
    async execute(userId: string): Promise<Playlists[]> {
        const playlist = await this._playlistRepository.getPlaylistsByUserId(userId);
        const userIds = playlist.map((p) => p.ownerId);
        const userMap = new Map<string, string>();

        const users = await this._userRepository.getUserByIds(userIds);
        users.forEach((user) => {
            userMap.set(user.id, user.username)
        });

        return playlist.map((item) => ({
            ...item,
            username: userMap.get(item.ownerId) || item.ownerId as string
        }))

    }
}
