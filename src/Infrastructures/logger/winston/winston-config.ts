import { config } from "@/commons/config";
import winston from "winston";

const isProduction = config.app.env === "production";
export const logger = winston.createLogger({
    level: isProduction ? "info" : "debug",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        isProduction
            ? winston.format.json()
            : winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
    ),
    transports: [
        new winston.transports.Console(),
    ],
});
export default logger;
