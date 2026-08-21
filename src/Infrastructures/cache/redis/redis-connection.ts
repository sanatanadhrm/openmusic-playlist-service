import { CacheConnection } from "@/applications/cache/cache-connection";
import { config } from "@/commons/config";
import { WinstonLoggerService } from "@/Infrastructures/logger/winston/winston-service";
import { createClient, RedisClientType } from "redis";


interface RedisConnectionDeps {
    logger?: WinstonLoggerService

}

export class RedisConnection implements CacheConnection {
    private _client: RedisClientType;
    private _isConnected = false;
    private _logger?: WinstonLoggerService;

    constructor(deps: RedisConnectionDeps) {
        this._client = createClient({ url: config.redis.url });
        this._logger = deps.logger;
    }

    async connect() {
        try {
            if (!this._isConnected) {
                await this._client.connect();
                this._isConnected = true;
                this._logger?.info("RedisConnection: Terhubung ke Redis Client.");
            }
        } catch (error) {
            this._logger?.error("RedisConnection: Koneksi ke Redis gagal:", error);
            throw error;
        }
    }

    async disconnect() {
        if (this._isConnected) {
            await this._client.quit();
            this._isConnected = false;
            this._logger?.info("RedisConnection: Terputus dari Redis Client.");
        }
    }
    getClient() {
        return this._client;
    }

}

