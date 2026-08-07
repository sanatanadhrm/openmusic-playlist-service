export interface PlaylistActivity {
    userId: string;
    title: string;      // judul lagu
    action: string;     // "add" | "delete"
    time: string;       // ISO date string
}

export interface PlaylistActivityPayload {
    playlistId: string;
    songId: string;
    userId: string;
    action: string;
}

export interface PlaylistActivityRepository {
    addActivities(payload: PlaylistActivityPayload): Promise<void>;
    getActivitiesByPlaylistId(playlistId: string): Promise<PlaylistActivity[]>;

}