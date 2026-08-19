// src/interfaces/http/api/playlist/index.ts

import { Router } from "express";
import { Container } from "instances-container";
import { routes } from "./routes";
import { PlaylistHandler } from "./handler";
import { AddPlaylistUseCase } from "@/applications/usecase/playlist/add-playlist";
import { GetPlaylistsUseCase } from "@/applications/usecase/playlist/get-playlists";
import { DeletePlaylistUseCase } from "@/applications/usecase/playlist/delete-playlist";
import { GetSongsInPlaylistUseCase } from "@/applications/usecase/playlist/get-songs-in-playlist";
import { AddSongToPlaylistUseCase } from "@/applications/usecase/playlist/add-song-to-playlist";
import { RemoveSongFromPlaylistUseCase } from "@/applications/usecase/playlist/remove-song-from-playlist";
import { GetPlaylistActivitiesUseCase } from "@/applications/usecase/playlist/get-playlist-activities";

export const playlistApi = (container: Container): Router => {
    const router = Router();

    const addPlaylistUseCase = container.getInstance(AddPlaylistUseCase.name) as AddPlaylistUseCase;
    const getPlaylistsUseCase = container.getInstance(GetPlaylistsUseCase.name) as GetPlaylistsUseCase;
    const deletePlaylistUseCase = container.getInstance(DeletePlaylistUseCase.name) as DeletePlaylistUseCase;
    const getSongsInPlaylistUseCase = container.getInstance(GetSongsInPlaylistUseCase.name) as GetSongsInPlaylistUseCase;
    const addSongToPlaylistUseCase = container.getInstance(AddSongToPlaylistUseCase.name) as AddSongToPlaylistUseCase;
    const removeSongFromPlaylistUseCase = container.getInstance(RemoveSongFromPlaylistUseCase.name) as RemoveSongFromPlaylistUseCase;
    const getPlaylistActivitiesUseCase = container.getInstance(GetPlaylistActivitiesUseCase.name) as GetPlaylistActivitiesUseCase;

    const playlistHandler = new PlaylistHandler(
        addPlaylistUseCase,
        getPlaylistsUseCase,
        deletePlaylistUseCase,
        getSongsInPlaylistUseCase,
        addSongToPlaylistUseCase,
        removeSongFromPlaylistUseCase,
        getPlaylistActivitiesUseCase
    );

    routes(router, playlistHandler);

    return router;
};
