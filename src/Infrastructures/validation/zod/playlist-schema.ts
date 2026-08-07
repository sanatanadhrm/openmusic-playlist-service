import { PlaylistPayload, PlaylistSongPayload, PlaylistValidator } from "@/applications/validation/playlist-validator";
import { GetPlaylistSongParams } from "@/domains/playlist-song/entities/params/get-playlist-song-params";
import { DomainErrorCode } from "@/commons/exception/constants/domain-error-code";
import { InvariantError } from "@/commons/exception/invariant-error";
import z from "zod";

const playlistSchema = z.object({
    name: z.string(DomainErrorCode.PLAYLIST_NOT_MEET_DATA_TYPE_SPECIFICATION)
        .min(1, DomainErrorCode.PLAYLIST_NOT_CONTAIN_NEEDED_PROPERTY),
});

const playlistSongSchema = z.object({
    songId: z.string(DomainErrorCode.PLAYLIST_SONG_NOT_MEET_DATA_TYPE_SPECIFICATION)
        .min(1, DomainErrorCode.PLAYLIST_SONG_NOT_CONTAIN_NEEDED_PROPERTY),
});

const playlistSongListParamsSchema = z.object({
    page: z.coerce.number().min(1).optional().default(1),
    limit: z.coerce.number().min(1).optional().default(10),
    q: z.string().optional(),
});

export class ZodPlaylistValidator implements PlaylistValidator {
    validatePlaylistPayload(payload: unknown): PlaylistPayload {
        const result = playlistSchema.safeParse(payload);
        if (!result.success) {
            throw new InvariantError(result.error.issues[0].message);
        }
        return result.data;
    }
    validatePlaylistSongPayload(payload: unknown): PlaylistSongPayload {
        const result = playlistSongSchema.safeParse(payload);
        if (!result.success) {
            throw new InvariantError(result.error.issues[0].message);
        }
        return result.data;
    }
    validatePlaylistSongListParams(params: unknown): GetPlaylistSongParams {
        const result = playlistSongListParamsSchema.safeParse(params);
        if (!result.success) {
            throw new InvariantError(result.error.issues[0].message);
        }
        return result.data;
    }
}
