// src/Infrastructures/validation/zod/export-schema.ts

import { ExportPlaylistPayload, ExportValidator } from "@/applications/validation/export-validator";
import { DomainErrorCode } from "@/commons/exception/constants/domain-error-code";
import { InvariantError } from "@/commons/exception/invariant-error";
import z from "zod";

const exportPlaylistSchema = z.object({
    targetEmail: z.string(DomainErrorCode.EXPORT_NOT_MEET_DATA_TYPE_SPECIFICATION)
        .email(DomainErrorCode.EXPORT_NOT_MEET_DATA_TYPE_SPECIFICATION)
        .min(1, DomainErrorCode.EXPORT_NOT_CONTAIN_NEEDED_PROPERTY),
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
