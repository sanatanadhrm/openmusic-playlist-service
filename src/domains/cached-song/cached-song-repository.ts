import { AddCachedSongPayload } from "./entities/payload/cached-song-payload";


export interface CachedSongRepository {

    updateInsertCachedSong(payload: AddCachedSongPayload): Promise<void>;
    removeCachedSong(songId: string): Promise<void>;
}