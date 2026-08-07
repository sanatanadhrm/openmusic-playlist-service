// src/Infrastructures/validation/zod/collaboration-schema.ts
// Implementasi konkret CollaborationValidator menggunakan Zod v4

import { CollaborationPayload, CollaborationValidator } from "@/applications/validation/collaboration-validator";
import { DomainErrorCode } from "@/commons/exception/constants/domain-error-code";
import { InvariantError } from "@/commons/exception/invariant-error";
import z from "zod";

const collaborationSchema = z.object({
    playlistId: z.string(DomainErrorCode.COLLABORATION_NOT_MEET_DATA_TYPE_SPECIFICATION)
        .min(1, DomainErrorCode.COLLABORATION_NOT_CONTAIN_NEEDED_PROPERTY),
    userId: z.string(DomainErrorCode.COLLABORATION_NOT_MEET_DATA_TYPE_SPECIFICATION)
        .min(1, DomainErrorCode.COLLABORATION_NOT_CONTAIN_NEEDED_PROPERTY),
});

export class ZodCollaborationValidator implements CollaborationValidator {
    validateCollaborationPayload(payload: unknown): CollaborationPayload {
        const result = collaborationSchema.safeParse(payload);
        if (!result.success) {
            throw new InvariantError(result.error.issues[0].message);
        }
        return result.data;
    }
}
