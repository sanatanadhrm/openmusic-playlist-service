export abstract class ClientError extends Error {
    abstract readonly statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = "ClientError";
        Object.setPrototypeOf(this, ClientError.prototype); // lihat poin 2
    }
}