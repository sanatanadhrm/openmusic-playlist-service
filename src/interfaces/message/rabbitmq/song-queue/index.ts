import { Container } from "instances-container";
import { BrokerRouter } from "@/Infrastructures/message/middleware/broker-router";
import { routes } from "./routes";
import { SongQueueHandler } from "./handler";
import { AddCachedSongUseCase } from "@/applications/usecase/cached-song/add-cached-song";
import { UpdateCachedSongUseCase } from "@/applications/usecase/cached-song/update-cached-song";
import { RemoveCachedSongUseCase } from "@/applications/usecase/cached-song/remove-cached-song";

export const songQueue = (container: Container): BrokerRouter => {
    const router = new BrokerRouter();
    const addCachedSongUseCase = container.getInstance(AddCachedSongUseCase.name);
    const updateCachedSongUseCase = container.getInstance(UpdateCachedSongUseCase.name);
    const removeCachedSongUseCase = container.getInstance(RemoveCachedSongUseCase.name);
    const handler = new SongQueueHandler({
        addCachedSongUseCase,
        updateCachedSongUseCase,
        removeCachedSongUseCase
    });

    routes(router, handler);

    return router;
};
