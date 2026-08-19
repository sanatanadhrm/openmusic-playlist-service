// src/Infrastructures/validation/zod/export-schema.ts

import { ExportPlaylistPayload, ExportValidator } from "@/applications/validation/export-validator";
import { InvariantError } from "@/commons/exception/invariant-error";
import z from "zod";

const exportPlaylistSchema = z.object({
    targetEmail: z.string("targetEmail must be string")
        .email("targetEmail must be email")
        .min(1, "targetEmail must not be empty"),
});

export class ZodExportValidator implements ExportValidator {
    validateExportPlaylistPayload(payload: unknown): ExportPlaylistPayload {
        const result = exportPlaylistSchema.safeParse(payload);
        if (!result.success) {
            throw new InvariantError(result.error.issues[0].message);
        }
        return result.data;
    }
}
