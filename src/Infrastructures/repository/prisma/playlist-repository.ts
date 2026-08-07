// src/Infrastructures/repository/prisma/playlist-repository.ts
// Implementasi konkret PlaylistRepository menggunakan Prisma
// WAJIB: petakan hasil Prisma ke tipe domain secara manual

import { NotFoundError } from "@/commons/exception/not-found-error";
import { config } from "@/commons/config";
import {
    AddedPlaylist,
    AddPlaylistPayload,
    AddPlaylistSongPayload,
    PlaylistActivity,
    PlaylistOwnership,
    PlaylistRepository,
    PlaylistSummary,
    RemovePlaylistSongPayload,
    SongInPlaylist,
} from "@/domains/playlist/playlist-repository";
import { PrismaClient } from "@/Infrastructures/database/postgresql/generated/prisma/client";
import { DomainErrorCode } from "@/commons/exception/constants/domain-error-code";
import { AuthorizationError } from "@/commons/exception/authorization-error";

export class PlaylistRepositoryPrisma implements PlaylistRepository {
    private _prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this._prisma = prisma;
    }

    async addPlaylist(payload: AddPlaylistPayload): Promise<AddedPlaylist> {
        const playlist = await this._prisma.playlist.create({
            data: {
                name: payload.name,
                ownerId: payload.ownerId,
            },
        });

        return {
            id: playlist.id,
            name: playlist.name,
            ownerId: playlist.ownerId,
        };
    }

    async getPlaylistsByUserId(userId: string): Promise<PlaylistSummary[]> {
        // Kembalikan playlist milik user (owner) ATAU yang jadi collaborator
        const playlists = await this._prisma.playlist.findMany({
            where: {
                OR: [
                    { ownerId: userId },
                    { collaborations: { some: { userId } } },
                ],
            },

        });


        return playlists.map((p) => ({
            id: p.id,
            name: p.name,
            ownerId: p.ownerId,
        }));
    }

    async getPlaylistOwnership(playlistId: string): Promise<PlaylistOwnership> {
        const playlist = await this._prisma.playlist.findUnique({
            where: { id: playlistId },
            select: { id: true, ownerId: true },
        });

        if (!playlist) {
            throw new NotFoundError(DomainErrorCode.PLAYLIST_NOT_FOUND);
        }

        return {
            id: playlist.id,
            ownerId: playlist.ownerId,
        };
    }

    async deletePlaylist(playlistId: string): Promise<void> {
        // Ownership sudah dicek di use case sebelum sampai sini
        // Prisma Cascade di schema akan hapus PlaylistSong + Collaboration + Activity
        await this._prisma.playlist.delete({ where: { id: playlistId } });
    }

    async verifyPlaylistAccess(playlistId: string, userId: string): Promise<void> {
        const playlist = await this._prisma.playlist.findUnique({
            where: { id: playlistId },
            include: {
                collaborations: { where: { userId }, select: { id: true } },
            },
        });

        if (!playlist) {
            throw new NotFoundError(DomainErrorCode.PLAYLIST_NOT_FOUND);
        }

        const isOwner = playlist.ownerId === userId;
        const isCollaborator = playlist.collaborations.length > 0;

        if (!isOwner && !isCollaborator) {
            throw new AuthorizationError(DomainErrorCode.PLAYLIST_ACCESS_FORBIDDEN);
        }
    }

    // async verifySongExists(songId: string): Promise<void> {
    //     const cachedSong = await this._prisma.cachedSong.findUnique({
    //         where: { id: songId },
    //         select: { id: true },
    //     });

    //     if (cachedSong) {
    //         return;
    //     }

    //     // Cache miss: Lakukan validasi sinkron HTTP ke Catalog Service
    //     const catalogUrl = `${config.catalogService.url}/songs/${songId}`;
    //     try {
    //         const response = await fetch(catalogUrl);
    //         if (!response.ok) {
    //             throw new NotFoundError("lagu tidak ditemukan");
    //         }
    //         const result = (await response.json()) as any;
    //         const songData = result?.data?.song;
    //         if (songData && songData.id) {
    //             await this._prisma.cachedSong.upsert({
    //                 where: { id: songData.id },
    //                 update: {
    //                     title: songData.title,
    //                     year: songData.year,
    //                     performer: songData.performer,
    //                     genre: songData.genre,
    //                     duration: songData.duration ?? null,
    //                     albumId: songData.albumId ?? null,
    //                 },
    //                 create: {
    //                     id: songData.id,
    //                     title: songData.title,
    //                     year: songData.year,
    //                     performer: songData.performer,
    //                     genre: songData.genre,
    //                     duration: songData.duration ?? null,
    //                     albumId: songData.albumId ?? null,
    //                 },
    //             });
    //             return;
    //         }
    //     } catch (err: any) {
    //         if (err instanceof NotFoundError) {
    //             throw err;
    //         }
    //         throw new NotFoundError("lagu tidak ditemukan atau Catalog Service tidak dapat dihubungi");
    //     }
    //     throw new NotFoundError("lagu tidak ditemukan");
    // }

    // async addSongToPlaylist(payload: AddPlaylistSongPayload): Promise<void> {
    //     const { playlistId, songId, userId } = payload;

    //     // Cek apakah lagu sudah ada di playlist (unique constraint guard)
    //     const existing = await this._prisma.playlistSong.findFirst({
    //         where: { playlistId, songId },
    //     });

    //     if (existing) {
    //         throw new Error(DomainErrorCode.PLAYLIST_SONG_ALREADY_EXISTS);
    //     }

    //     // Tambah lagu ke playlist
    //     await this._prisma.playlistSong.create({
    //         data: { playlistId, songId },
    //     });

    //     // Catat aktivitas "add"
    //     await this._prisma.playlistSongActivity.create({
    //         data: { playlistId, songId, userId, action: "add" },
    //     });
    // }

    // async getSongsByPlaylistId(playlistId: string): Promise<SongInPlaylist[]> {
    //     const playlistSongs = await this._prisma.playlistSong.findMany({
    //         where: { playlistId },
    //         include: {
    //             song: {
    //                 select: { id: true, title: true, performer: true },
    //             },
    //         },
    //     });

    //     return playlistSongs.map((ps) => ({
    //         id: ps.song.id,
    //         title: ps.song.title,
    //         performer: ps.song.performer,
    //     }));
    // }

    // async removeSongFromPlaylist(payload: RemovePlaylistSongPayload): Promise<void> {
    //     const { playlistId, songId, userId } = payload;

    //     // Cek apakah lagu ada di playlist
    //     const playlistSong = await this._prisma.playlistSong.findFirst({
    //         where: { playlistId, songId },
    //     });

    //     if (!playlistSong) {
    //         throw new NotFoundError("lagu tidak ditemukan di dalam playlist ini");
    //     }

    //     // Hapus dari playlist
    //     await this._prisma.playlistSong.delete({
    //         where: { id: playlistSong.id },
    //     });

    //     // Catat aktivitas "delete"
    //     await this._prisma.playlistSongActivity.create({
    //         data: { playlistId, songId, userId, action: "delete" },
    //     });
    // }

    // async getActivitiesByPlaylistId(playlistId: string): Promise<PlaylistActivity[]> {
    //     const activities = await this._prisma.playlistSongActivity.findMany({
    //         where: { playlistId },
    //         orderBy: { time: "asc" },
    //         include: {
    //             song: { select: { title: true } },
    //         },
    //     });

    //     const userIds = [...new Set(activities.map((a) => a.userId))];
    //     const userMap = new Map<string, string>();
    //     for (const uid of userIds) {
    //         try {
    //             const res = await fetch(`${config.authService.url}/user/${uid}`);
    //             if (res.ok) {
    //                 const data = (await res.json()) as any;
    //                 if (data?.data?.user?.username) {
    //                     userMap.set(uid, data.data.user.username);
    //                 }
    //             }
    //         } catch (e) {
    //             // Abaikan error fallback
    //         }
    //     }

    //     return activities.map((a) => ({
    //         username: userMap.get(a.userId) || "user",
    //         title: a.song.title,
    //         action: a.action,
    //         time: a.time.toISOString(),
    //     }));
    // }
}
