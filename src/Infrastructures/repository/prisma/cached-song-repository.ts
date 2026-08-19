import { CachedSongRepository } from "@/domains/cached-song/cached-song-repository";
import { AddCachedSongPayload } from "@/domains/cached-song/entities/payload/cached-song-payload";
import { PrismaClient } from "@/Infrastructures/database/postgresql/generated/prisma/client";

export class CachedSongRepositoryPrisma implements CachedSongRepository {
    private _prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this._prisma = prisma;
    }

    async updateInsertCachedSong(payload: AddCachedSongPayload): Promise<void> {
        await this._prisma.cachedSong.upsert({
            where: { id: payload.id },
            update: payload,
            create: payload,
        });
    }
    async removeCachedSong(songId: string): Promise<void> {
        await this._prisma.cachedSong.delete({
            where: { id: songId },
        });
    }

}