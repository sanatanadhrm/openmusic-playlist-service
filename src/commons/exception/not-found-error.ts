import { ClientError } from "./client-error";

export class NotFoundError extends ClientError {
    readonly statusCode = 404; // WAJIB diisi di sini, karena di parent-nya cuma "dijanjikan" (abstract)

    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
        Object.setPrototypeOf(this, NotFoundError.prototype); // lihat poin 2
    }
}