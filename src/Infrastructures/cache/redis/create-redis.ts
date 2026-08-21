import { WinstonLoggerService } from "@/Infrastructures/logger/winston/winston-service";
import { Container } from "instances-container";
import { RedisConnection } from "./redis-connection";

export const createCacheRedis = async (container: Container) => {
    const logger = container.getInstance(WinstonLoggerService.name)

    try {

        const cacheConn = container.getInstance(RedisConnection.name) as RedisConnection;
        await cacheConn.connect();
        logger.info("Redis: Terhubung ke redis");
        const handleShutdown = async () => {
            logger.info("Redis: Menutup koneksi...");
            await cacheConn.disconnect();
        };
        process.on("SIGINT", handleShutdown);
        process.on("SIGTERM", handleShutdown);
        return cacheConn;
    } catch (error) {
        logger.error("Redis: Gagal menginisialisasi redis:", error);
        throw error;
    }
}; 