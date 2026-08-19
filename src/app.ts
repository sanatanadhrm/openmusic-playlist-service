import { config } from "./commons/config";
import { createServer } from "./Infrastructures/http/create-server";
import { container } from "./Infrastructures/container";
import { createBroker } from "./Infrastructures/message/create-broker";

(async () => {
    const app = await createServer(container);
    await createBroker(container);

    app.listen(config.app.port, () => {
        console.log(`Server is running on http://${config.app.host}:${config.app.port}`);
    });
})();