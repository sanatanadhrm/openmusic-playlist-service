import { CacheService } from "@/applications/cache/cache-service";
import { WinstonLoggerService } from "@/Infrastructures/logger/winston/winston-service";
import { RedisConnection } from "./redis-connection";
import { RedisClientType } from "@redis/client";


interface RedisClientServiceDeps {
    logger?: WinstonLoggerService;
    connection: RedisConnection
}

export class RedisClientService implements CacheService {
    private _logger?: WinstonLoggerService;
    private _client: RedisClientType;

    constructor(options: RedisClientServiceDeps) {
        this._logger = options.logger;
        this._client = options.connection.getClient();
    }

    async get(key: string): Promise<string | null> {
        try {

            const result = await this._client.get(key);
            if (!result) {
                this._logger?.warn(`RedisClientService: Cache miss for key '${key}'`);
            } else {
                this._logger?.info(`RedisClientService: Cache hit for key '${key}'`);
            }
            return result;
        } catch (error) {
            this._logger?.error(`RedisClientService: Error getting cache key '${key}':`, error);
            throw error;
        }
    }

    async set(key: string, value: string, expirationInSecond: number = 1800): Promise<void> {
        try {
            await this._client.setEx(key, expirationInSecond, value);
            this._logger?.info(`RedisClientService: Set cache key '${key}' with expiration ${expirationInSecond}s`);
        } catch (error) {
            this._logger?.error(`RedisClientService: Error setting cache key '${key}':`, error);
            throw error;
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this._client.del(key);
            this._logger?.info(`RedisClientService: Deleted cache key '${key}'`);
        } catch (error) {
            this._logger?.error(`RedisClientService: Error deleting cache key '${key}':`, error);
            throw error;
        }
    }

    async deletePattern(pattern: string): Promise<void> {
        try {
            const keys = await this._client.keys(pattern);
            if (keys.length > 0) {
                await this._client.del(keys);
                this._logger?.info(`RedisClientService: Deleted ${keys.length} cache keys matching pattern '${pattern}'`);
            } else {
                this._logger?.warn(`RedisClientService: No cache keys found matching pattern '${pattern}'`);
            }
        } catch (error) {
            this._logger?.error(`RedisClientService: Error deleting cache pattern '${pattern}':`, error);
            throw error;
        }
    }
}

