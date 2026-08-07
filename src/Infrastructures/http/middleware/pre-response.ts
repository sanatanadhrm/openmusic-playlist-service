import { ClientError } from "@/commons/exception/client-error";
import { DomainErrorTranslator } from "@/commons/exception/domain-error-translator";
import { NextFunction, Request, Response } from "express";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    const translatedError = DomainErrorTranslator.translate(err);

    if (translatedError instanceof ClientError) {
        res.status(translatedError.statusCode).json({
            status: "fail",
            message: translatedError.message,
        });
        return;
    }
    console.log(err)
    res.status(500).json({
        status: "error",
        message: "Terjadi kegagalan pada server kami",
    });
}