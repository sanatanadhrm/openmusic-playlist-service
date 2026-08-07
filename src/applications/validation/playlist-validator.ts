import { GetPlaylistSongParams } from "@/domains/playlist-song/entities/params/get-playlist-song-params";

export interface PlaylistPayload {
    name: string;
}
export interface PlaylistSongPayload {
    songId: string;
}

export interface PlaylistValidator {
    validatePlaylistPayload(payload: unknown): PlaylistPayload;
    validatePlaylistSongPayload(payload: unknown): PlaylistSongPayload;
    validatePlaylistSongListParams(params: unknown): GetPlaylistSongParams;
}
