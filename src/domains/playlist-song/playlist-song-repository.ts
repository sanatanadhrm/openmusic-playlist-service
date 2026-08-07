// src/domains/playlist-song/playlist-song-repository.ts

import { PaginatedResult } from "@/commons/pagination/pagination-result";
import { GetPlaylistSongParams } from "./entities/params/get-playlist-song-params";

export interface AddPlaylistSongPayload {
    playlistId: string;
    songId: string;
    userId: string;
}

export interface RemovePlaylistSongPayload {
    playlistId: string;
    songId: string;
    userId: string;
}

export interface SongInPlaylist {
    id: string;
    title: string;
    performer: string;
}

export interface PlaylistSongBodyPayload {
    songId: string;
}

export interface PlaylistActivity {
    username: string;
    title: string;
    action: string;
    time: string;
}

export interface PlaylistSongRepository {
    verifySongAlreadyExistInPlaylist(playlistId: string, songId: string): Promise<void>;
    verifySongInPlaylist(playlistId: string, songId: string): Promise<string>;
    addSongToPlaylist(payload: AddPlaylistSongPayload): Promise<void>;
    getSongsByPlaylistId(playlistId: string, params: GetPlaylistSongParams): Promise<PaginatedResult<SongInPlaylist>>;
    removeSongFromPlaylist(playlistSongId: string, playlistId: string): Promise<void>;
}
