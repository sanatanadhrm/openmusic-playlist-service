// src/domains/playlist/playlist-repository.ts

import { AddPlaylistPayload, AddPlaylistSongPayload, RemovePlaylistSongPayload, PlaylistSongBodyPayload } from "./entities/payload/add-playlist";
import { AddedPlaylist, PlaylistSummary, Playlists, PlaylistOwnership, SongInPlaylist, PlaylistActivityResponse } from "./entities/response/playlist-response";

export {
    AddPlaylistPayload,
    AddPlaylistSongPayload,
    RemovePlaylistSongPayload,
    PlaylistSongBodyPayload,
    AddedPlaylist,
    PlaylistSummary,
    Playlists,
    PlaylistOwnership,
    SongInPlaylist,
    PlaylistActivityResponse as PlaylistActivity
};

export interface PlaylistRepository {
    addPlaylist(payload: AddPlaylistPayload): Promise<AddedPlaylist>;
    getPlaylistsByUserId(userId: string): Promise<PlaylistSummary[]>;
    getPlaylistOwnership(playlistId: string): Promise<PlaylistOwnership>;
    deletePlaylist(playlistId: string): Promise<void>;
    verifyPlaylistAccess(playlistId: string, userId: string): Promise<void>;
}
