import { ClientError } from "./client-error";

export class AuthorizationError extends ClientError {
    readonly statusCode = 403; // WAJIB diisi di sini, karena di parent-nya cuma "dijanjikan" (abstract)

    constructor(message: string) {
        super(message);
        this.name = "AuthorizationError";
        Object.setPrototypeOf(this, AuthorizationError.prototype); // lihat poin 2
    }
}