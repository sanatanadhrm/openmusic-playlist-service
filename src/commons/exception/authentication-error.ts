import { ClientError } from "./client-error";

export class AuthenticationError extends ClientError {
    readonly statusCode = 401; // WAJIB diisi di sini, karena di parent-nya cuma "dijanjikan" (abstract)

    constructor(message: string) {
        super(message);
        this.name = "AuthenticationError";
        Object.setPrototypeOf(this, AuthenticationError.prototype); // lihat poin 2
    }
}