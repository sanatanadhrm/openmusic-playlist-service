// src/Infrastructures/repository/prisma/collaboration-repository.ts
// Implementasi konkret CollaborationRepository menggunakan Prisma

import { DomainErrorCode } from "@/commons/exception/constants/domain-error-code";
import { NotFoundError } from "@/commons/exception/not-found-error";
import {
    AddedCollaboration,
    AddCollaborationPayload,
    CollaborationRepository
} from "@/domains/collaboration/collaboration-repository";
import { PrismaClient } from "@/Infrastructures/database/postgresql/generated/prisma/client";
import { InvariantError } from "@/commons/exception/invariant-error";

export class CollaborationRepositoryPrisma implements CollaborationRepository {
    private _prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this._prisma = prisma;
    }

    async verifyCollaborationNotExist(playlistId: string, userId: string) {
        const collaboration = await this._prisma.collaboration.findFirst({
            where: {
                playlistId,
                userId
            }
        });
        if (collaboration) {
            throw new InvariantError(DomainErrorCode.COLLABORATION_ALREADY_EXISTS);
        }
    }


    async verifyCollaborationExist(playlistId: string, userId: string): Promise<string> {
        const collaboration = await this._prisma.collaboration.findFirst({
            where: {
                playlistId,
                userId
            }
        });
        if (!collaboration) {
            throw new NotFoundError(DomainErrorCode.COLLABORATION_NOT_FOUND);
        }
        return collaboration.id
    }




    async addCollaboration(payload: AddCollaborationPayload): Promise<AddedCollaboration> {
        const { playlistId, userId } = payload;

        // Cek apakah sudah menjadi collaborator
        // const existing = await this._prisma.collaboration.findFirst({
        //     where: { playlistId, userId },
        // });

        // if (existing) {
        //     throw new Error(DomainErrorCode.COLLABORATION_ALREADY_EXISTS);
        // }

        const collaboration = await this._prisma.collaboration.create({
            data: { playlistId, userId },
        });

        return {
            id: collaboration.id,
            playlistId: collaboration.playlistId,
            userId: collaboration.userId,
        };
    }

    async removeCollaboration(collaborationId: string): Promise<void> {
        await this._prisma.collaboration.delete({
            where: { id: collaborationId },
        });
    }
}
