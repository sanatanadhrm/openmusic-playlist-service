export interface CacheConnection {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}