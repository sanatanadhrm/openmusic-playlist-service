import express, { json, urlencoded } from "express";

import playlist from "@/interfaces/http/api/playlist";
import collaboration from "@/interfaces/http/api/collaboration";
import _export from "@/interfaces/http/api/export";
import { errorHandler } from "./middleware/pre-response";
import morganMiddleware from "./middleware/logger";
import { redisConnection } from "@/Infrastructures/cache/redis/redis-connection";
import logger from "@/Infrastructures/logger/winston/winston-config";
import { collectDefaultMetrics, register } from "prom-client";
import { CorsMiddleware } from "./middleware/cors";
import { metricsMiddleware } from "./middleware/metrics";

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
    app.use(CorsMiddleware());

    // Metrics
    app.use(metricsMiddleware)
    collectDefaultMetrics();
    app.get("/metrics", async (_req, res) => {
        res.set("Content-Type", register.contentType);
        res.end(await register.metrics());
    });

    app.use(urlencoded({ extended: true }));

    app.use("/playlists", playlist);
    app.use("/collaborations", collaboration);
    app.use("/export", _export);
    app.use(errorHandler);
    return app;
};