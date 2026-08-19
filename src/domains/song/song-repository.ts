import { SongDetailResponse } from "./types/detail-song";



export interface SongRepository {
    getSongById(songId: string): Promise<SongDetailResponse>;
}