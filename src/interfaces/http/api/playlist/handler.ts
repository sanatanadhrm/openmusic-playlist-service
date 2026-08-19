import { Request, Response, NextFunction } from "express";
import { AddPlaylistUseCase } from "@/applications/usecase/playlist/add-playlist";
import { GetPlaylistsUseCase } from "@/applications/usecase/playlist/get-playlists";
import { DeletePlaylistUseCase } from "@/applications/usecase/playlist/delete-playlist";
import { GetSongsInPlaylistUseCase } from "@/applications/usecase/playlist/get-songs-in-playlist";
import { AddSongToPlaylistUseCase } from "@/applications/usecase/playlist/add-song-to-playlist";
import { RemoveSongFromPlaylistUseCase } from "@/applications/usecase/playlist/remove-song-from-playlist";
import { GetPlaylistActivitiesUseCase } from "@/applications/usecase/playlist/get-playlist-activities";

export class PlaylistHandler {
    constructor(
        private readonly addPlaylistUseCase: AddPlaylistUseCase,
        private readonly getPlaylistsUseCase: GetPlaylistsUseCase,
        private readonly deletePlaylistUseCase: DeletePlaylistUseCase,
        private readonly getSongsInPlaylistUseCase: GetSongsInPlaylistUseCase,
        private readonly addSongToPlaylistUseCase: AddSongToPlaylistUseCase,
        private readonly removeSongFromPlaylistUseCase: RemoveSongFromPlaylistUseCase,
        private readonly getPlaylistActivitiesUseCase: GetPlaylistActivitiesUseCase
    ) {}

    addPlaylistHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const ownerId = req.user!.id;
            const addedPlaylist = await this.addPlaylistUseCase.execute(req.body, ownerId);

            res.status(201).json({
                status: "success",
                message: "Playlist berhasil ditambahkan",
                data: { playlist: addedPlaylist },
            });
        } catch (error) {
            next(error);
        }
    }

    getPlaylistsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.id;
            const playlists = await this.getPlaylistsUseCase.execute(userId);

            res.status(200).json({
                status: "success",
                data: { playlists },
            });
        } catch (error) {
            next(error);
        }
    }

    deletePlaylistHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.id;
            const playlistId = req.params.id as string;
            await this.deletePlaylistUseCase.execute(playlistId, userId);

            res.status(200).json({
                status: "success",
                message: "Playlist berhasil dihapus",
            });
        } catch (error) {
            next(error);
        }
    }

    getSongsInPlaylistHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const playlistId = req.params.id;
            const userId = req.user!.id;
            const result = await this.getSongsInPlaylistUseCase.execute(playlistId, userId, req.query);

            res.status(200).json({
                status: "success",
                data: { songs: result.data },
                meta: result.meta,
            });
        } catch (error) {
            next(error);
        }
    }

    addSongToPlaylistHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const playlistId = req.params.id;
            const userId = req.user!.id;
            await this.addSongToPlaylistUseCase.execute(playlistId, userId, req.body);

            res.status(201).json({
                status: "success",
                message: "Lagu berhasil ditambahkan ke playlist",
            });
        } catch (error) {
            next(error);
        }
    }

    removeSongFromPlaylistHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const playlistId = req.params.id as string;
            const userId = req.user!.id;
            await this.removeSongFromPlaylistUseCase.execute(playlistId, userId, req.body);

            res.status(200).json({
                status: "success",
                message: "Lagu berhasil dihapus dari playlist",
            });
        } catch (error) {
            next(error);
        }
    }

    getPlaylistActivitiesHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const playlistId = req.params.id as string;
            const userId = req.user!.id;
            const activities = await this.getPlaylistActivitiesUseCase.execute(playlistId, userId);

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
