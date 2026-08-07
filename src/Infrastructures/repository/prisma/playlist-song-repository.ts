import { DomainErrorCode } from "@/commons/exception/constants/domain-error-code";
import { NotFoundError } from "@/commons/exception/not-found-error";
import { InvariantError } from "@/commons/exception/invariant-error";
import { PaginatedResult } from "@/commons/pagination/pagination-result";
import { AddPlaylistSongPayload, PlaylistSongRepository, SongInPlaylist } from "@/domains/playlist-song/playlist-song-repository";
import { GetPlaylistSongParams } from "@/domains/playlist-song/entities/params/get-playlist-song-params";
import { PLAYLIST_SONG_CACHE_KEY } from "@/domains/playlist-song/entities/constants/cache-key";
import { PrismaClient } from "@/Infrastructures/database/postgresql/generated/prisma/client";
import { WinstonLoggerService } from "@/Infrastructures/logger/winston/winston-service";
import { RedisClientService } from "@/Infrastructures/cache/redis/redis-service";

export class PlaylistSongRepositoryPrisma implements PlaylistSongRepository {
    private _prisma: PrismaClient;
    private _logger?: WinstonLoggerService;
    private _cache?: RedisClientService;

    constructor(prisma: PrismaClient, logger?: WinstonLoggerService, cache?: RedisClientService) {
        this._prisma = prisma;
        this._logger = logger;
        this._cache = cache;
    }

    async verifySongAlreadyExistInPlaylist(playlistId: string, songId: string): Promise<void> {
        const playlistSong = await this._prisma.playlistSong.findFirst({
            where: { playlistId, songId },
        });

        if (playlistSong) {
            this._logger?.warn(`PlaylistSongRepositoryPrisma: song ${songId} already exists in playlist ${playlistId}`);
            throw new InvariantError(DomainErrorCode.PLAYLIST_SONG_ALREADY_EXISTS);
        }
    }

    async verifySongInPlaylist(playlistId: string, songId: string): Promise<string> {
        const playlistSong = await this._prisma.playlistSong.findFirst({
            where: { playlistId, songId },
        });

        if (!playlistSong) {
            this._logger?.warn(`PlaylistSongRepositoryPrisma: song ${songId} not found in playlist ${playlistId}`);
            throw new NotFoundError(DomainErrorCode.PLAYLIST_SONG_NOT_FOUND);
        }
        return playlistSong.id;
    }

    async getSongsByPlaylistId(playlistId: string, params: GetPlaylistSongParams): Promise<PaginatedResult<SongInPlaylist>> {
        const { page, limit, q } = params;
        const cacheKeyList = PLAYLIST_SONG_CACHE_KEY.list(playlistId, params);
        const cacheKeyTotal = PLAYLIST_SONG_CACHE_KEY.total(playlistId);

        if (this._cache && !q) {
            this._logger?.info("PlaylistSongRepositoryPrisma: checking cache");
            const cachedData = await this._cache.get(cacheKeyList);
            const cachedTotal = await this._cache.get(cacheKeyTotal);
            if (cachedData && cachedTotal) {
                const cache = JSON.parse(cachedData);
                this._logger?.info("PlaylistSongRepositoryPrisma: cache hit");
                return new PaginatedResult<SongInPlaylist>(cache, params, parseInt(cachedTotal, 10));
            }
            this._logger?.info("PlaylistSongRepositoryPrisma: cache miss");
        }

        const skip = (page - 1) * limit;
        const where = {
            playlistId,
            ...(q && {
                song: {
                    OR: [
                        { title: { contains: q, mode: "insensitive" as const } },
                        { performer: { contains: q, mode: "insensitive" as const } },
                    ],
                },
            }),
        };

        const [playlistSongs, total] = await this._prisma.$transaction([
            this._prisma.playlistSong.findMany({
                where,
                skip,
                take: limit,
                include: {
                    song: {
                        select: { id: true, title: true, performer: true },
                    },
                },
            }),
            this._prisma.playlistSong.count({ where }),
        ]);

        const songs: SongInPlaylist[] = playlistSongs.map((ps) => ({
            id: ps.song.id,
            title: ps.song.title,
            performer: ps.song.performer,
        }));

        if (this._cache && !q) {
            await this._cache.set(cacheKeyList, JSON.stringify(songs), 1800);
            await this._cache.set(cacheKeyTotal, total.toString(), 1800);
            this._logger?.info("PlaylistSongRepositoryPrisma: cache set");
        }

        return new PaginatedResult<SongInPlaylist>(songs, params, total);
    }

    async addSongToPlaylist(payload: AddPlaylistSongPayload): Promise<void> {
        const { playlistId, songId } = payload;

        await this._prisma.playlistSong.create({
            data: { playlistId, songId },
        });

        this._logger?.info(`PlaylistSongRepositoryPrisma: song ${songId} added to playlist ${playlistId}`);

        if (this._cache) {
            await this._cache.deletePattern(PLAYLIST_SONG_CACHE_KEY.listPattern(playlistId));
            await this._cache.delete(PLAYLIST_SONG_CACHE_KEY.total(playlistId));
            this._logger?.info(`PlaylistSongRepositoryPrisma: cache cleared for playlist ${playlistId}`);
        }
    }

    async removeSongFromPlaylist(playlistSongId: string, playlistId: string): Promise<void> {
        await this._prisma.playlistSong.delete({
            where: { id: playlistSongId },
        });

        this._logger?.info(`PlaylistSongRepositoryPrisma: song removed from playlist ${playlistId}`);

        if (this._cache) {
            await this._cache.deletePattern(PLAYLIST_SONG_CACHE_KEY.listPattern(playlistId));
            await this._cache.delete(PLAYLIST_SONG_CACHE_KEY.total(playlistId));
            this._logger?.info(`PlaylistSongRepositoryPrisma: cache cleared for playlist ${playlistId}`);
        }
    }
}