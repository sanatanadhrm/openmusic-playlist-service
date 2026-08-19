// src/interfaces/http/api/collaboration/handler.ts
import { Request, Response, NextFunction } from "express";
import { AddCollaborationUseCase } from "@/applications/usecase/collaboration/add-collaboration";
import { RemoveCollaborationUseCase } from "@/applications/usecase/collaboration/remove-collaboration";

export class CollaborationHandler {
    constructor(
        private readonly addCollaborationUseCase: AddCollaborationUseCase,
        private readonly removeCollaborationUseCase: RemoveCollaborationUseCase
    ) {}

    addCollaborationHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const requesterId = req.user!.id;
            const addedCollaboration = await this.addCollaborationUseCase.execute(requesterId, req.body);

            res.status(201).json({
                status: "success",
                message: "Kolaborasi berhasil ditambahkan",
                data: { collaborationId: addedCollaboration.id },
            });
        } catch (error) {
            next(error);
        }
    }

    removeCollaborationHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const requesterId = req.user!.id;
            await this.removeCollaborationUseCase.execute(requesterId, req.body);

            res.status(200).json({
                status: "success",
                message: "Kolaborasi berhasil dihapus",
            });
        } catch (error) {
            next(error);
        }
    }
}
