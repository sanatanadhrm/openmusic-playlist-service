import cors from "cors";


export function CorsMiddleware() {
    const allowedOrigin = [
        "http://localhost:3000"
    ];
    return cors({
        origin: allowedOrigin,
        credentials: true
    })
}