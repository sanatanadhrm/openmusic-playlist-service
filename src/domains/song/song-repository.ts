export interface SongDetailResponse {
    id: string;
    title: string;
    year: number;
    performer: string;
    genre: string;
    duration: number | null;
    albumId: string | null;
}


export interface SongRepository {
    getSongById(songId: string): Promise<SongDetailResponse>;
}