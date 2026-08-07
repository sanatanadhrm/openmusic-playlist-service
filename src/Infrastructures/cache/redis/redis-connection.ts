import { config } from "@/commons/config";
import logger from "@/Infrastructures/logger/winston/winston-config";
import { createClient } from "redis";

class RedisConnection {
    private client = createClient({ url: config.redis.url });
    private isConnected = false;

    async connect() {
        try {
            if (!this.isConnected) {
                await this.client.connect();
                this.isConnected = true;
                logger.info("RedisConnection: Terhubung ke Redis Client.");
            }
        } catch (error) {
            logger.error("RedisConnection: Koneksi ke Redis gagal:", error);
            throw error;
        }
    }

    async disconnect() {
        if (this.isConnected) {
            await this.client.quit();
            this.isConnected = false;
            logger.info("RedisConnection: Terputus dari Redis Client.");
        }
    }
    getClient() {
        return this.client;
    }
}

export const redisConnection = new RedisConnection();
