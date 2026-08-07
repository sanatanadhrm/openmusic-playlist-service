export interface AddCachedSongPayload {
    id: string
    title: string;
    year: number;
    performer: string;
    genre: string;
    duration: number | null;
    albumId: string | null;
}

export interface CachedSongRepository {
    verifySongExists(songId: string): Promise<boolean>;
    addCachedSong(payload: AddCachedSongPayload): Promise<void>;
    removeCachedSong(songId: string): Promise<void>;
}