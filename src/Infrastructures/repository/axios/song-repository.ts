import { catalogClient } from "@/commons/config";
import { SongRepository } from "@/domains/song/song-repository";
import { NotFoundError } from "@/commons/exception/not-found-error";
import { DomainErrorCode } from "@/commons/exception/constants/domain-error-code";
import { IDetailSongResponse, SongDetailResponse } from "@/domains/song/types/detail-song";

export class SongRepositoryAxios implements SongRepository {
    async getSongById(songId: string): Promise<SongDetailResponse> {
        try {
            const response = await catalogClient.get<IDetailSongResponse>(`song/${songId}`);
            if (response.status !== 200) {
                throw new NotFoundError(DomainErrorCode.SONG_NOT_FOUND);
            }
            return {
                id: response.data.data.song.id,
                title: response.data.data.song.title,
                year: response.data.data.song.year,
                performer: response.data.data.song.performer,
                albumId: response.data.data.song.albumId,
                duration: response.data.data.song.duration,
                genre: response.data.data.song.genre,
            };
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new NotFoundError(DomainErrorCode.SONG_NOT_FOUND);
        }
    }
}
