import { Counter } from "prom-client";
import { Request, Response, NextFunction } from "express";

// 1. Definisikan Counter HTTP Request dengan label status code
export const httpRequestsTotal = new Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status"],
});

// 2. Middleware pengukur status HTTP
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.on("finish", () => {
        const route = req.route ? req.route.path : req.path;
        httpRequestsTotal.inc({
            method: req.method,
            route,
            status: res.statusCode.toString(), // 👈 Mencatat 200, 404, 500 dsb
        });
    });
    next();
};