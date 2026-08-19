// src/Infrastructures/validation/zod/collaboration-schema.ts
// Implementasi konkret CollaborationValidator menggunakan Zod v4

import { CollaborationPayload, CollaborationValidator } from "@/applications/validation/collaboration-validator";
import { InvariantError } from "@/commons/exception/invariant-error";
import z from "zod";

const collaborationSchema = z.object({
    playlistId: z.string("playlistId must be string")
        .min(1, "playlistId must not be empty"),
    userId: z.string("userId must be string")
        .min(1, "userId must not be empty"),
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
