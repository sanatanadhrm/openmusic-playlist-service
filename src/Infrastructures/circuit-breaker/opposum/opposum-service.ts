import { CircuitBreakerService } from "@/applications/circuit-breaker/circuit-breaker-service";
import { LoggerService } from "@/applications/logger/logger-service";
import CircuitBreaker from "opossum";
interface RegistryDeps {
    logger?: LoggerService;
    defaultOptions?: CircuitBreaker.Options;
}

export class OpposumCircuitBreakerService implements CircuitBreakerService {
    private _breakers = new Map<string, CircuitBreaker<any, any>>();
    private _logger?: LoggerService;
    private _defaultOptions?: CircuitBreaker.Options;
    constructor(deps: RegistryDeps) {
        this._logger = deps.logger;
        this._defaultOptions = {
            timeout: 3000,
            errorThresholdPercentage: 50,
            resetTimeout: 10000,
            ...deps.defaultOptions
        };
    }
    register(
        endpointName: string,
        requestFunction: (...args: any[]) => Promise<any>
    ): void {
        if (!this._breakers.has(endpointName)) {
            const breaker = new CircuitBreaker(requestFunction, {
                ...this._defaultOptions,
                name: endpointName
            });
            breaker.fallback((...args: any[]) => {
                const error = args[args.length - 1]; // Opossum menaruh error di argumen terakhir
                this._logger?.error(`[CircuitBreaker] Endpoint '${endpointName}' GAGAL: ${error?.message}`);
                throw new Error(`Fitur ${endpointName} sedang tidak tersedia.`);
            });
            breaker.on("open", () => this._logger?.warn(`🔴 Sekering [${endpointName}] TERPUTUS!`));
            breaker.on("halfOpen", () => this._logger?.info(`🟡 Sekering [${endpointName}] MENGUJI KONEKSI...`));
            breaker.on("close", () => this._logger?.info(`🟢 Sekering [${endpointName}] NORMAL KEMBALI.`));
            this._breakers.set(endpointName, breaker);
            this._logger?.warn(`Circuit Breaker [${endpointName}] sudah berhasil didaftarkan.`);

        } else {
            this._logger?.warn(`Circuit Breaker [${endpointName}] sudah terdaftar.`);

        }
    }

    execute<TArgs extends any[], TResult>(
        endpointName: string,
    ): (...args: TArgs) => Promise<TResult> {
        const breaker = this._breakers.get(endpointName);
        if (!breaker) {
            this._logger?.warn(`Circuit Breaker [${endpointName}] tidak terdaftar.`);
            return async () => {
                throw new Error(`Circuit Breaker [${endpointName}] tidak terdaftar.`);
            };
        } else {
            this._logger?.info(`Circuit Breaker [${endpointName}] berhasil dieksekusi.`);
            return async (...args: TArgs) => {
                return await breaker.fire(...args) as Promise<TResult>;
            };
        }
    }

    verify(endpointName: string): boolean {
        const breaker = this._breakers.get(endpointName);
        if (!breaker) {
            this._logger?.warn(`Circuit Breaker [${endpointName}] tidak terdaftar.`);
            return false;
        } else {
            return true;
        }
    }
}
