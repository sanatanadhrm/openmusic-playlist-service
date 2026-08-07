// src/applications/usecase/playlist/get-playlist-activities.ts

import { PlaylistActivityRepository } from "@/domains/playlist-activity/playlist-activity-repository";
import { PlaylistActivity, PlaylistRepository } from "@/domains/playlist/playlist-repository";
import { UserRepository } from "@/domains/user/user-repository";

interface GetPlaylistActivitiesUseCaseDependencies {
    playlistRepository: PlaylistRepository;
    playlistActivityRepository: PlaylistActivityRepository
    userRepository: UserRepository

}

export class GetPlaylistActivitiesUseCase {
    private _playlistRepository: PlaylistRepository;
    private _playlistActivityRepository: PlaylistActivityRepository;
    private _userRepository: UserRepository;

    constructor(deps: GetPlaylistActivitiesUseCaseDependencies) {
        this._playlistRepository = deps.playlistRepository;
        this._playlistActivityRepository = deps.playlistActivityRepository;
        this._userRepository = deps.userRepository;
    }

    async execute(playlistId: string, userId: string): Promise<PlaylistActivity[]> {
        // Verifikasi akses (owner ATAU collaborator)
        await this._playlistRepository.verifyPlaylistAccess(playlistId, userId);

        const activities = await this._playlistActivityRepository.getActivitiesByPlaylistId(playlistId);
        const userIds = [...new Set(activities.map((a) => a.userId))];
        const users = await this._userRepository.getUserByIds(userIds);
        const userMap = new Map(users.map((u) => [u.id, u.username]));

        return activities.map((a) => ({
            ...a,
            username: userMap.get(a.userId) || "Unknown User",
        }));
    }
}
