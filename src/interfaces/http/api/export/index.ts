// src/interfaces/http/api/export/index.ts

import { Router } from "express";
import { routes } from "./routes";
import { ExportHandler } from "./handler";

const router = Router();

const exportHandler = new ExportHandler();

routes(router, exportHandler);

export default router;
