import { GetPlaylistSongParams } from "../params/get-playlist-song-params";

export const PLAYLIST_SONG_CACHE_KEY = {
    BASE: "playlist_song:",
    list: (playlistId: string, params: GetPlaylistSongParams) => `playlist_song:${playlistId}:list:${params.page}:${params.limit}`,
    listPattern: (playlistId: string) => `playlist_song:${playlistId}:list:*`,
    total: (playlistId: string) => `playlist_song:${playlistId}:total`,
};
