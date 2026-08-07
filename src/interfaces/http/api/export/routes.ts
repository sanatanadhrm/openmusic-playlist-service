// src/interfaces/http/api/export/routes.ts
// Route untuk export playlist

import { Router } from "express";
import { authenticateJWT } from "@/Infrastructures/http/middleware/auth-jwt";
import { ExportHandler } from "./handler";

export const routes = (router: Router, handler: ExportHandler) => {
    // Sesuai spec: POST /export/playlists/{playlistId}
    router.post("/playlists/:playlistId", authenticateJWT, handler.exportPlaylistHandler.bind(handler));
};
