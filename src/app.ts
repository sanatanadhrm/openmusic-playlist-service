import { config } from "./commons/config";
import { createServer } from "./Infrastructures/http/create-server";
import { container } from "./Infrastructures/container";
import { createBroker } from "./Infrastructures/message/create-broker";
import { WinstonLoggerService } from "./Infrastructures/logger/winston/winston-service";
import { createCacheRedis } from "./Infrastructures/cache/redis/create-redis";

(async () => {
    const logger = container.getInstance(WinstonLoggerService.name)

    try {
        const app = await createServer(container);
        await createBroker(container);
        await createCacheRedis(container);

        app.listen(config.app.port, () => {
            logger.info(`Catalog Service running on http://${config.app.host}:${config.app.port}`);
        });
    } catch (error) {
        logger.error("Gagal menjalankan Catalog Service:", error);
        process.exit(1);
    }
})();