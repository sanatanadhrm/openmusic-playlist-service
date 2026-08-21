// src/commons/config/index.ts
import { z } from "zod";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    HOST: z.string().default("0.0.0.0"),
    PORT: z.coerce.number().default(3000),

    DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi"),

    ACCESS_TOKEN_KEY: z.string().min(1, "ACCESS_TOKEN_KEY wajib diisi"),
    REFRESH_TOKEN_KEY: z.string().min(1, "REFRESH_TOKEN_KEY wajib diisi"),
    ACCESS_TOKEN_AGE: z.coerce.number().default(3000),

    REDIS_URL: z.string().default("redis://localhost:6379"),
    RABBITMQ_SERVER: z.string(),
    CATALOG_SERVICE_URL: z.string().default("http://localhost:3002"),
    CATALOG_SERVICE_API_KEY: z.string().default("catalog_token_key"),
    AUTH_SERVICE_URL: z.string().default("http://localhost:3001"),
    AUTH_SERVICE_API_KEY: z.string().default("auth_token_key"),
    PLAYLIST_SERVICE_API_KEY: z.string().default("playlist_token_key"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("❌ Konfigurasi environment tidak valid:");
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}

export const catalogClient = axios.create({
    baseURL: parsed.data.CATALOG_SERVICE_URL || 'http://localhost:3002',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

catalogClient.interceptors.request.use((config) => {
    config.headers['x-internal-api-key'] = parsed.data.CATALOG_SERVICE_API_KEY;
    return config;
});

export const authClient = axios.create({
    baseURL: parsed.data.AUTH_SERVICE_URL || 'http://localhost:3001',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

authClient.interceptors.request.use((config) => {
    config.headers['x-internal-api-key'] = parsed.data.AUTH_SERVICE_API_KEY;
    return config;
});

export const config = {
    app: {
        env: parsed.data.NODE_ENV,
        host: parsed.data.HOST,
        port: parsed.data.PORT,
    },
    database: {
        url: parsed.data.DATABASE_URL,
    },
    token: {
        accessTokenKey: parsed.data.ACCESS_TOKEN_KEY,
        refreshTokenKey: parsed.data.REFRESH_TOKEN_KEY,
        accessTokenAge: parsed.data.ACCESS_TOKEN_AGE,
    },
    redis: {
        url: parsed.data.REDIS_URL,
    },
    rabbitmq: {
        server: parsed.data.RABBITMQ_SERVER,
    },
    catalogService: {
        url: parsed.data.CATALOG_SERVICE_URL,
        apiKey: parsed.data.CATALOG_SERVICE_API_KEY,
    },
    authService: {
        url: parsed.data.AUTH_SERVICE_URL,
        apiKey: parsed.data.AUTH_SERVICE_API_KEY,
    },
    playlistService: {
        apiKey: parsed.data.PLAYLIST_SERVICE_API_KEY,
    },
} as const;