import express, { json, urlencoded } from "express";
import cors from "cors";

import playlist from "@/interfaces/http/api/playlist";
import collaboration from "@/interfaces/http/api/collaboration";
import _export from "@/interfaces/http/api/export";
import { errorHandler } from "./middleware/pre-response";
import morganMiddleware from "./middleware/logger";
import { redisConnection } from "@/Infrastructures/cache/redis/redis-connection";
import logger from "@/Infrastructures/logger/winston/winston-config";

export const createServer = async () => {
    const app = express();
    try {
        await redisConnection.connect();
    } catch (error) {
        logger.error("Gagal konek Redis. Matikan server!", error);
        process.exit(1);
    }

    app.use(morganMiddleware);
    app.use(json());
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }));
    app.use(urlencoded({ extended: true }));

    app.use("/playlists", playlist);
    app.use("/collaborations", collaboration);
    app.use("/export", _export);
    app.use(errorHandler);
    return app;
};