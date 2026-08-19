// src/interfaces/http/api/export/index.ts

import { Router } from "express";
import { Container } from "instances-container";
import { routes } from "./routes";
import { ExportHandler } from "./handler";
import { ExportPlaylistUseCase } from "@/applications/usecase/export/export-playlist";

export const exportApi = (container: Container): Router => {
    const router = Router();

    const exportPlaylistUseCase = container.getInstance(ExportPlaylistUseCase.name) as ExportPlaylistUseCase;

    const exportHandler = new ExportHandler(exportPlaylistUseCase);

    routes(router, exportHandler);

    return router;
};
