export interface AddCachedSongPayload {
    id: string;
    title: string;
    year: number;
    performer: string;
    genre: string;
    duration?: number;
    albumId?: string;
}