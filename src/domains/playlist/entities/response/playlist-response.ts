export interface AddedPlaylist {
    id: string;
    name: string;
    ownerId: string;
}

export interface PlaylistSummary {
    id: string;
    name: string;
    ownerId: string;
}

export interface Playlists {
    id: string;
    name: string;
    username: string;
}

export interface PlaylistOwnership {
    id: string;
    ownerId: string;
}

export interface SongInPlaylist {
    id: string;
    title: string;
    performer: string;
}

export interface PlaylistActivityResponse {
    username: string;
    title: string;
    action: string;
    time: string;
}
