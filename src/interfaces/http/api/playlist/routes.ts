// src/interfaces/http/api/playlist/routes.ts
// SEMUA endpoint Playlist WAJIB authenticateJWT
// Mencakup: playlists CRUD + songs dalam playlist + activities

import { Router } from "express";
import { authenticateJWT } from "@/Infrastructures/http/middleware/auth-jwt";
import { PlaylistHandler } from "./handler";

export const routes = (router: Router, handler: PlaylistHandler) => {
    // ============ PLAYLISTS ============
    router.get("/", authenticateJWT, handler.getPlaylistsHandler.bind(handler));
    router.post("/", authenticateJWT, handler.addPlaylistHandler.bind(handler));
    router.delete("/:id", authenticateJWT, handler.deletePlaylistHandler.bind(handler));

    // ============ PLAYLIST SONGS ============
    router.get("/:id/songs", authenticateJWT, handler.getSongsInPlaylistHandler.bind(handler));
    router.post("/:id/songs", authenticateJWT, handler.addSongToPlaylistHandler.bind(handler));
    router.delete("/:id/songs", authenticateJWT, handler.removeSongFromPlaylistHandler.bind(handler));

    // ============ PLAYLIST ACTIVITIES ============
    router.get("/:id/activities", authenticateJWT, handler.getPlaylistActivitiesHandler.bind(handler));
};
