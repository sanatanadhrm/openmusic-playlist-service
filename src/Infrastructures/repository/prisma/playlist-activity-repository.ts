import { PlaylistActivity, PlaylistActivityPayload, PlaylistActivityRepository } from "@/domains/playlist-activity/playlist-activity-repository";
import { PrismaClient } from "@/Infrastructures/database/postgresql/generated/prisma/client";

export class PlaylistActivityRepositoryPrisma implements PlaylistActivityRepository {
    private _prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this._prisma = prisma;
    }

    async getActivitiesByPlaylistId(playlistId: string): Promise<PlaylistActivity[]> {
        const activities = await this._prisma.playlistSongActivity.findMany({
            where: { playlistId },
            include: {
                song: { select: { title: true } },
            },
        });

        return activities.map((activity) => ({
            userId: activity.userId,
            title: activity.song.title,
            action: activity.action,
            time: activity.time.toISOString(),
        }));
    }

    async addActivities(payload: PlaylistActivityPayload): Promise<void> {
        await this._prisma.playlistSongActivity.create({
            data: payload,
        });
    }
}