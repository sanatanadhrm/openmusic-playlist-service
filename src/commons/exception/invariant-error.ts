import { ClientError } from "./client-error";

export class InvariantError extends ClientError {
    readonly statusCode = 400; // WAJIB diisi di sini, karena di parent-nya cuma "dijanjikan" (abstract)

    constructor(message: string) {
        super(message);
        this.name = "InvariantError";
        Object.setPrototypeOf(this, InvariantError.prototype); // lihat poin 2
    }
}