// src/interfaces/http/api/export/handler.ts
import { Request, Response, NextFunction } from "express";
import { ExportPlaylistUseCase } from "@/applications/usecase/export/export-playlist";

export class ExportHandler {
    constructor(
        private readonly exportPlaylistUseCase: ExportPlaylistUseCase
    ) {}

    exportPlaylistHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.id;
            const playlistId = req.params.playlistId as string;

            await this.exportPlaylistUseCase.execute(userId, playlistId, req.body);

            res.status(201).json({
                status: "success",
                message: "Permintaan Anda sedang kami proses",
            });
        } catch (error) {
            next(error);
        }
    }
}
