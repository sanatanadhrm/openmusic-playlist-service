// src/interfaces/http/api/playlist/index.ts

import { Router } from "express";
import { routes } from "./routes";
import { PlaylistHandler } from "./handler";

const router = Router();

const playlistHandler = new PlaylistHandler();

routes(router, playlistHandler);

export default router;
