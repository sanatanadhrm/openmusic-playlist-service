// src/interfaces/http/api/collaboration/index.ts

import { Router } from "express";
import { routes } from "./routes";
import { CollaborationHandler } from "./handler";

const router = Router();

const collaborationHandler = new CollaborationHandler();

routes(router, collaborationHandler);

export default router;
