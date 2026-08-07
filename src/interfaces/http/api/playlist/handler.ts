import { Request, Response, NextFunction } from "express";
import { getInstance } from "@/Infrastructures/container";
import { AddPlaylistUseCase } from "@/applications/usecase/playlist/add-playlist";
import { GetPlaylistsUseCase } from "@/applications/usecase/playlist/get-playlists";
import { DeletePlaylistUseCase } from "@/applications/usecase/playlist/delete-playlist";
import { GetSongsInPlaylistUseCase } from "@/applications/usecase/playlist/get-songs-in-playlist";
import { AddSongToPlaylistUseCase } from "@/applications/usecase/playlist/add-song-to-playlist";
import { RemoveSongFromPlaylistUseCase } from "@/applications/usecase/playlist/remove-song-from-playlist";
import { GetPlaylistActivitiesUseCase } from "@/applications/usecase/playlist/get-playlist-activities";

export class PlaylistHandler {
    constructor() {}

    async addPlaylistHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const addPlaylistUseCase = getInstance<AddPlaylistUseCase>(AddPlaylistUseCase.name);
            const ownerId = req.user!.id;
            const addedPlaylist = await addPlaylistUseCase.execute(req.body, ownerId);

            res.status(201).json({
                status: "success",
                message: "Playlist berhasil ditambahkan",
                data: { playlist: addedPlaylist },
            });
        } catch (error) {
            next(error);
        }
    }

    async getPlaylistsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const getPlaylistsUseCase = getInstance<GetPlaylistsUseCase>(GetPlaylistsUseCase.name);
            const userId = req.user!.id;
            const playlists = await getPlaylistsUseCase.execute(userId);

            res.status(200).json({
                status: "success",
                data: { playlists },
            });
        } catch (error) {
            next(error);
        }
    }

    async deletePlaylistHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const deletePlaylistUseCase = getInstance<DeletePlaylistUseCase>(DeletePlaylistUseCase.name);
            const userId = req.user!.id;
            const playlistId = req.params.id as string;
            await deletePlaylistUseCase.execute(playlistId, userId);

            res.status(200).json({
                status: "success",
                message: "Playlist berhasil dihapus",
            });
        } catch (error) {
            next(error);
        }
    }

    async getSongsInPlaylistHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const getSongsInPlaylistUseCase = getInstance<GetSongsInPlaylistUseCase>(GetSongsInPlaylistUseCase.name);
            const playlistId = req.params.id;
            const userId = req.user!.id;
            const result = await getSongsInPlaylistUseCase.execute(playlistId, userId, req.query);

            res.status(200).json({
                status: "success",
                data: { songs: result.data },
                meta: result.meta,
            });
        } catch (error) {
            next(error);
        }
    }

    async addSongToPlaylistHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const addSongToPlaylistUseCase = getInstance<AddSongToPlaylistUseCase>(AddSongToPlaylistUseCase.name);
            const playlistId = req.params.id;
            const userId = req.user!.id;
            await addSongToPlaylistUseCase.execute(playlistId, userId, req.body);

            res.status(201).json({
                status: "success",
                message: "Lagu berhasil ditambahkan ke playlist",
            });
        } catch (error) {
            next(error);
        }
    }

    async removeSongFromPlaylistHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const removeSongFromPlaylistUseCase = getInstance<RemoveSongFromPlaylistUseCase>(RemoveSongFromPlaylistUseCase.name);
            const playlistId = req.params.id as string;
            const userId = req.user!.id;
            await removeSongFromPlaylistUseCase.execute(playlistId, userId, req.body);

            res.status(200).json({
                status: "success",
                message: "Lagu berhasil dihapus dari playlist",
            });
        } catch (error) {
            next(error);
        }
    }

    async getPlaylistActivitiesHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const getPlaylistActivitiesUseCase = getInstance<GetPlaylistActivitiesUseCase>(GetPlaylistActivitiesUseCase.name);
            const playlistId = req.params.id as string;
            const userId = req.user!.id;
            const activities = await getPlaylistActivitiesUseCase.execute(playlistId, userId);

            res.status(200).json({
                status: "success",
                data: {
                    playlistId,
                    activities,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}
