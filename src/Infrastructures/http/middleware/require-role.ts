import { AuthorizationError } from "@/commons/exception/authorization-error";
import { DomainErrorCode } from "@/commons/exception/constants/domain-error-code";
import { Request, Response, NextFunction } from "express";

export function requireRole(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const userRole = req.user?.role; // lihat catatan soal tipe req.user di bawah

            if (!userRole || !allowedRoles.includes(userRole)) {
                throw new AuthorizationError(DomainErrorCode.USER_NOT_AUTHORIZED_TO_USE_THIS_ACTION);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}