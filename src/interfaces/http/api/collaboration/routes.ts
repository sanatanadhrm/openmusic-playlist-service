// src/interfaces/http/api/collaboration/routes.ts
// SEMUA endpoint Collaborations WAJIB authenticateJWT

import { Router } from "express";
import { authenticateJWT } from "@/Infrastructures/http/middleware/auth-jwt";
import { CollaborationHandler } from "./handler";

export const routes = (router: Router, handler: CollaborationHandler) => {
    router.post("/", authenticateJWT, handler.addCollaborationHandler.bind(handler));
    router.delete("/", authenticateJWT, handler.removeCollaborationHandler.bind(handler));
};
