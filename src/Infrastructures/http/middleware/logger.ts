import logger from "@/Infrastructures/logger/winston/winston-config";
import morgan from "morgan";

const morganMiddleware = morgan(
    ":method :url :status :response-time ms",
    {
        stream: {
            write: (message: string) => logger.info(message.trim()),
        },
    }
);

export default morganMiddleware;
