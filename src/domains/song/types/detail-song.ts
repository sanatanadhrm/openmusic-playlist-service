import { ApiResponse } from "@/commons/types/api-response";

export interface DetailSong {
    song: {
        id: string;
        title: string;
        year: number;
        performer: string;
        genre: string;
        duration: number | null;
        albumId: string | null;
    }
}
export type SongDetailResponse = DetailSong["song"]
export type IDetailSongResponse = ApiResponse<DetailSong>