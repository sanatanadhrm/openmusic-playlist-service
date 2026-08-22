export interface CircuitBreakerService {
    register<TArgs extends any[], TResult>(
        endpointName: string,
        requestFunction: (...args: TArgs) => Promise<TResult>
    ): void

    execute<TArgs extends any[], TResult>(
        endpointName: string,
        requestFunction: (...args: TArgs) => Promise<TResult>
    ): (...args: TArgs) => Promise<TResult>

    verify(endpointName: string): boolean
}