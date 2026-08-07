export interface AddPlaylistPayload {
    name: string;
    ownerId: string;
}

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

export interface PlaylistSongBodyPayload {
    songId: string;
}
