import { AddCachedSongUseCase } from "@/applications/usecase/cached-song/add-cached-song";
import { RemoveCachedSongUseCase } from "@/applications/usecase/cached-song/remove-cached-song";
import { UpdateCachedSongUseCase } from "@/applications/usecase/cached-song/update-cached-song";
import logger from "@/Infrastructures/logger/winston/winston-config";

export interface SongQueueHandlerDependencies {
    addCachedSongUseCase: AddCachedSongUseCase;
    updateCachedSongUseCase: UpdateCachedSongUseCase;
    removeCachedSongUseCase: RemoveCachedSongUseCase;
}

export class SongQueueHandler {
    private readonly addCachedSongUseCase: AddCachedSongUseCase;
    private readonly updateCachedSongUseCase: UpdateCachedSongUseCase;
    private readonly removeCachedSongUseCase: RemoveCachedSongUseCase;

    constructor(deps: SongQueueHandlerDependencies) {
        this.addCachedSongUseCase = deps.addCachedSongUseCase;
        this.updateCachedSongUseCase = deps.updateCachedSongUseCase;
        this.removeCachedSongUseCase = deps.removeCachedSongUseCase;
    }

    handleSongCreated = async (payload: any): Promise<void> => {
        try {
            await this.addCachedSongUseCase.execute(payload);
            logger.info(`Song queue processed: song.created for id ${payload.id}`);
        } catch (error) {
            logger.error(`Error processing song.created:`, error);
            throw error;
        }
    }

    handleSongUpdated = async (payload: any): Promise<void> => {
        try {
            await this.updateCachedSongUseCase.execute(payload);
            logger.info(`Song queue processed: song.updated for id ${payload.id}`);
        } catch (error) {
            logger.error(`Error processing song.updated:`, error);
            throw error;
        }
    }

    handleSongDeleted = async (payload: any): Promise<void> => {
        try {
            await this.removeCachedSongUseCase.execute(payload.id);
            logger.info(`Song queue processed: song.deleted for id ${payload.id}`);
        } catch (error) {
            logger.error(`Error processing song.deleted:`, error);
            throw error;
        }
    }
}
