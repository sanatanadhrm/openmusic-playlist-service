import { LoggerService } from "@/applications/logger/logger-service";
import logger from "./winston-config";

export class WinstonLoggerService implements LoggerService {
    info(message: string): void {
        logger.info(message);
    }
    error(message: string, error?: unknown): void {
        if (error instanceof Error) {
            logger.error(`${message} - Trace: ${error.stack}`);
        } else if (error !== undefined) {
            logger.error(`${message} - Details: ${typeof error === "object" ? JSON.stringify(error) : String(error)}`);
        } else {
            logger.error(message);
        }
    }
    debug(message: string): void {
        logger.debug(message);
    }
    warn(message: string): void {
        logger.warn(message);
    }
}
