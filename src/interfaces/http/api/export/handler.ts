// src/interfaces/http/api/export/handler.ts
import { Request, Response, NextFunction } from "express";
import { getInstance } from "@/Infrastructures/container";
import { ExportPlaylistUseCase } from "@/applications/usecase/export/export-playlist";

export class ExportHandler {
    constructor() {}

    async exportPlaylistHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const exportPlaylistUseCase = getInstance<ExportPlaylistUseCase>(ExportPlaylistUseCase.name);
            const userId = req.user!.id;
            const playlistId = req.params.playlistId as string;

            await exportPlaylistUseCase.execute(userId, playlistId, req.body);

            res.status(201).json({
                status: "success",
                message: "Permintaan Anda sedang kami proses",
            });
        } catch (error) {
            next(error);
        }
    }
}
