import { AddCachedSongPayload, CachedSongRepository } from "@/domains/cached-song/cached-song-repository";
import { PrismaClient } from "@/Infrastructures/database/postgresql/generated/prisma/client";

export class CachedSongRepositoryPrisma implements CachedSongRepository {
    private _prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this._prisma = prisma;
    }

    async verifySongExists(songId: string): Promise<boolean> {
        const song = await this._prisma.cachedSong.findUnique({
            where: { id: songId },
        });
        return !!song
    }
    async addCachedSong(payload: AddCachedSongPayload): Promise<void> {
        await this._prisma.cachedSong.create({
            data: payload,
        });
    }
    async removeCachedSong(songId: string): Promise<void> {
        await this._prisma.cachedSong.delete({
            where: { id: songId },
        });
    }

}