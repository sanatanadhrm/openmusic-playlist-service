import { AddCachedSongPayload } from "@/domains/cached-song/entities/payload/cached-song-payload";

export interface CachedSongValidator {
    validateCachedSongPayload(payload: unknown): AddCachedSongPayload;
}
