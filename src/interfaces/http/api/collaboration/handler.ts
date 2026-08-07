// src/interfaces/http/api/collaboration/handler.ts
import { Request, Response, NextFunction } from "express";
import { getInstance } from "@/Infrastructures/container";
import { AddCollaborationUseCase } from "@/applications/usecase/collaboration/add-collaboration";
import { RemoveCollaborationUseCase } from "@/applications/usecase/collaboration/remove-collaboration";

export class CollaborationHandler {
    constructor() {}

    async addCollaborationHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const addCollaborationUseCase = getInstance<AddCollaborationUseCase>(AddCollaborationUseCase.name);
            const requesterId = req.user!.id;
            const addedCollaboration = await addCollaborationUseCase.execute(requesterId, req.body);

            res.status(201).json({
                status: "success",
                message: "Kolaborasi berhasil ditambahkan",
                data: { collaborationId: addedCollaboration.id },
            });
        } catch (error) {
            next(error);
        }
    }

    async removeCollaborationHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const removeCollaborationUseCase = getInstance<RemoveCollaborationUseCase>(RemoveCollaborationUseCase.name);
            const requesterId = req.user!.id;
            await removeCollaborationUseCase.execute(requesterId, req.body);

            res.status(200).json({
                status: "success",
                message: "Kolaborasi berhasil dihapus",
            });
        } catch (error) {
            next(error);
        }
    }
}
