// src/Infrastructures/validation/zod/collaboration-schema.ts
// Implementasi konkret CollaborationValidator menggunakan Zod v4

import { CachedSongValidator } from "@/applications/validation/cached-song-validator";
import { InvariantError } from "@/commons/exception/invariant-error";
import { AddCachedSongPayload } from "@/domains/cached-song/entities/payload/cached-song-payload";
import z from "zod";

const cachedSongSchema = z.object({
    id: z.string("id must be string")
        .min(1, "id must not be empty"),
    title: z.string("title must be string")
        .min(1, "title must not be empty"),
    year: z.number("year must be number")
        .min(1, "year must not be empty"),
    performer: z.string("performer must be string")
        .min(1, "performer must not be empty"),
    genre: z.string("genre must be string")
        .min(1, "genre must not be empty"),
    duration: z.number("duration must be number")
        .min(1, "duration must not be empty")
        .optional(),
    albumId: z.string("albumId must be string")
        .min(1, "albumId must not be empty")
        .optional(),
});

export class ZodCachedSongValidator implements CachedSongValidator {
    validateCachedSongPayload(payload: unknown): AddCachedSongPayload {
        const result = cachedSongSchema.safeParse(payload);
        if (!result.success) {
            throw new InvariantError(result.error.issues[0].message);
        }
        return result.data;
    }
}
