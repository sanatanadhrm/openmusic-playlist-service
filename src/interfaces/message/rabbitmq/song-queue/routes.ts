import { BrokerRouter } from "@/Infrastructures/message/middleware/broker-router";
import { SongQueueHandler } from "./handler";

export const routes = (router: BrokerRouter, handler: SongQueueHandler) => {
    router.on("song.created", handler.handleSongCreated);
    router.on("song.updated", handler.handleSongUpdated);
    router.on("song.deleted", handler.handleSongDeleted);
};
