import { redisConnection } from "./redis-connection";
import { CacheService } from "@/applications/cache/cache-service";
import logger from "@/Infrastructures/logger/winston/winston-config";

export class RedisClientService implements CacheService {
    private get client() {
        return redisConnection.getClient();
    }

    async get(key: string): Promise<string | null> {
        try {
            const result = await this.client.get(key);
            if (!result) {
                logger.warn(`RedisClientService: Cache miss for key '${key}'`);
            } else {
                logger.info(`RedisClientService: Cache hit for key '${key}'`);
            }
            return result;
        } catch (error) {
            logger.error(`RedisClientService: Error getting cache key '${key}':`, error);
            throw error;
        }
    }

    async set(key: string, value: string, expirationInSecond: number = 1800): Promise<void> {
        try {
            await this.client.setEx(key, expirationInSecond, value);
            logger.info(`RedisClientService: Set cache key '${key}' with expiration ${expirationInSecond}s`);
        } catch (error) {
            logger.error(`RedisClientService: Error setting cache key '${key}':`, error);
            throw error;
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this.client.del(key);
            logger.info(`RedisClientService: Deleted cache key '${key}'`);
        } catch (error) {
            logger.error(`RedisClientService: Error deleting cache key '${key}':`, error);
            throw error;
        }
    }

    async deletePattern(pattern: string): Promise<void> {
        try {
            const keys = await this.client.keys(pattern);
            if (keys.length > 0) {
                await this.client.del(keys);
                logger.info(`RedisClientService: Deleted ${keys.length} cache keys matching pattern '${pattern}'`);
            } else {
                logger.warn(`RedisClientService: No cache keys found matching pattern '${pattern}'`);
            }
        } catch (error) {
            logger.error(`RedisClientService: Error deleting cache pattern '${pattern}':`, error);
            throw error;
        }
    }
}
