import { SongRepository } from "@/domains/song/song-repository";
import { NotFoundError } from "@/commons/exception/not-found-error";
import { DomainErrorCode } from "@/commons/exception/constants/domain-error-code";
import { DetailSong, IDetailSongResponse, SongDetailResponse } from "@/domains/song/types/detail-song";
import { AxiosResponse } from "axios";
import { AxiosApiSevice } from "@/Infrastructures/api/axios/axios-service";
import { OpposumCircuitBreakerService } from "@/Infrastructures/circuit-breaker/opposum/opposum-service";

interface SongRepositoryAxiosDeps {
    axiosService: AxiosApiSevice;
    circuitBreakerService: OpposumCircuitBreakerService
}

export class SongRepositoryAxios implements SongRepository {

    private readonly _axiosService: AxiosApiSevice;
    private readonly _circuitBreakerService: OpposumCircuitBreakerService;

    constructor(deps: SongRepositoryAxiosDeps) {
        this._axiosService = deps.axiosService;
        this._circuitBreakerService = deps.circuitBreakerService;

        this._circuitBreakerService.register(
            'getSongById',
            async (songId: string) => {
                return await this._axiosService.get(`song/${songId}`);
            }
        );
    }


    async getSongById(songId: string): Promise<SongDetailResponse> {
        try {

            const getSongByIdWithBreaker = this._circuitBreakerService.execute<[string], AxiosResponse<IDetailSongResponse>>('getSongById');
            const response = await getSongByIdWithBreaker(songId);

            if (response.status !== 200) {
                throw new NotFoundError(DomainErrorCode.SONG_NOT_FOUND);
            }
            const data = response.data.data
            return {
                id: data.song.id,
                title: data.song.title,
                year: data.song.year,
                performer: data.song.performer,
                albumId: data.song.albumId,
                duration: data.song.duration,
                genre: data.song.genre,
            };
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new NotFoundError(DomainErrorCode.SONG_NOT_FOUND);
        }
    }

}
