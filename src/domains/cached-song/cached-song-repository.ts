import { SongDetailResponse } from "../song/types/detail-song";
import { AddCachedSongPayload } from "./entities/payload/cached-song-payload";


export interface CachedSongRepository {
    verifySongExists(songId: string): Promise<boolean>;
    addCachedSong(payload: SongDetailResponse): Promise<void>;

    updateInsertCachedSong(payload: AddCachedSongPayload): Promise<void>;
    removeCachedSong(songId: string): Promise<void>;
}