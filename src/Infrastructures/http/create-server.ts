import express, { json, urlencoded } from "express";
import { Container } from "instances-container";

import { playlistApi } from "@/interfaces/http/api/playlist";
import { collaborationApi } from "@/interfaces/http/api/collaboration";
import { exportApi } from "@/interfaces/http/api/export";
import { errorHandler } from "./middleware/pre-response";
import morganMiddleware from "./middleware/logger";
import { redisConnection } from "@/Infrastructures/cache/redis/redis-connection";
import logger from "@/Infrastructures/logger/winston/winston-config";
import { collectDefaultMetrics, register } from "prom-client";
import { CorsMiddleware } from "./middleware/cors";
import { metricsMiddleware } from "./middleware/metrics";

export const createServer = async (container: Container) => {
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

    app.use("/playlists", playlistApi(container));
    app.use("/collaborations", collaborationApi(container));
    app.use("/export", exportApi(container));
    app.use(errorHandler);
    return app;
};