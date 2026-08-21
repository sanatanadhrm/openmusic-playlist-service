import { BrokerRouter } from "@/Infrastructures/message/middleware/broker-router";
import { SongQueueHandler } from "./handler";
import { SONG_QUEUE } from "@/domains/song/constants/song-queue";

export const routes = (router: BrokerRouter, handler: SongQueueHandler) => {
    router.on(SONG_QUEUE.EVENT.CREATE_SONG, handler.handleSongCreated);
    router.on(SONG_QUEUE.EVENT.UPDATE_SONG, handler.handleSongUpdated);
    router.on(SONG_QUEUE.EVENT.DELETE_SONG, handler.handleSongDeleted);
};
