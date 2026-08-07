export interface LoggerService {
    info(message: string): void;
    error(message: string, error?: unknown): void;
    debug(message: string): void;
    warn(message: string): void;
}
