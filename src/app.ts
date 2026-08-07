import { config } from "./commons/config";
import { postgresql } from "./Infrastructures/database/postgresql/postgre-sql";
import { createServer } from "./Infrastructures/http/create-server";
import { startSongConsumer } from "./Infrastructures/message/rabbitmq/song-consumer";

(async () => {
    const app = await createServer();

    // Start CQRS Consumer
    await startSongConsumer(postgresql);

    app.listen(config.app.port, () => {
        console.log(`Server is running on http://${config.app.host}:${config.app.port}`);
    });
})();