// src/Infrastructures/http/middlewares/authenticateJWT.ts
import { TokenPayload } from "@/commons/types/token";
import { AuthenticationError } from "@/commons/exception/authentication-error";
import { DomainErrorCode } from "@/commons/exception/constants/domain-error-code";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "@/commons/config";

export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
    try {
        const apiKey = req.header('x-internal-api-key')
        const playlist_api_key = config.playlistService.apiKey
        if (apiKey === playlist_api_key) {
            req.user = {
                id: req.headers['x-user-id'] as string,
                username: req.headers['x-user-username'] as string,
                role: req.headers['x-user-role'] as string
            };
            return next();
        }
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            throw new AuthenticationError(DomainErrorCode.ACCESS_TOKEN_MISSING);
        }

        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_KEY as string) as TokenPayload;
        req.user = verified;
        next();
    } catch (err) {
        next(err); // dilempar ke error handler terpusat, BUKAN res.status manual di sini
    }
}