// src/Infrastructures/container.ts
import { createContainer } from "instances-container";

// Database & Cache
import { postgresql } from "./database/postgresql/postgre-sql";
import { RedisClientService } from "./cache/redis/redis-service";
import { RedisConnection } from "./cache/redis/redis-connection";

// Logger
import { WinstonLoggerService } from "./logger/winston/winston-service";

// Repositories (Prisma & Axios)
import { PlaylistRepositoryPrisma } from "./repository/prisma/playlist-repository";
import { PlaylistSongRepositoryPrisma } from "./repository/prisma/playlist-song-repository";
import { PlaylistActivityRepositoryPrisma } from "./repository/prisma/playlist-activity-repository";
import { CachedSongRepositoryPrisma } from "./repository/prisma/cached-song-repository";
import { CollaborationRepositoryPrisma } from "./repository/prisma/collaboration-repository";
import { UserRepositoryAxios } from "./repository/axios/user-repository";
import { SongRepositoryAxios } from "./repository/axios/song-repository";

// Validators
import { ZodPlaylistValidator } from "./validation/zod/playlist-schema";
import { ZodCollaborationValidator } from "./validation/zod/collaboration-schema";
import { ZodExportValidator } from "./validation/zod/export-schema";

// Message Broker
import { RabbitMQService } from "./message/rabbitmq/rabbitmq-service";
import { RabbitMQConnection } from "./message/rabbitmq/rabbitmq-connection";
import { RabbitMQListener } from "./message/rabbitmq/rabbitmq-listener";

// Use Cases
import { AddPlaylistUseCase } from "@/applications/usecase/playlist/add-playlist";
import { GetPlaylistsUseCase } from "@/applications/usecase/playlist/get-playlists";
import { DeletePlaylistUseCase } from "@/applications/usecase/playlist/delete-playlist";
import { AddSongToPlaylistUseCase } from "@/applications/usecase/playlist/add-song-to-playlist";
import { RemoveSongFromPlaylistUseCase } from "@/applications/usecase/playlist/remove-song-from-playlist";
import { GetSongsInPlaylistUseCase } from "@/applications/usecase/playlist/get-songs-in-playlist";
import { GetPlaylistActivitiesUseCase } from "@/applications/usecase/playlist/get-playlist-activities";
import { AddCollaborationUseCase } from "@/applications/usecase/collaboration/add-collaboration";
import { RemoveCollaborationUseCase } from "@/applications/usecase/collaboration/remove-collaboration";
import { ExportPlaylistUseCase } from "@/applications/usecase/export/export-playlist";
import { AddCachedSongUseCase } from "@/applications/usecase/cached-song/add-cached-song";
import { ZodCachedSongValidator } from "./validation/zod/cached-song-schema";
import { UpdateCachedSongUseCase } from "@/applications/usecase/cached-song/update-cached-song";
import { RemoveCachedSongUseCase } from "@/applications/usecase/cached-song/remove-cached-song";
import { AxiosApiSevice } from "./api/axios/axios-service";
import { OpposumCircuitBreakerService } from "./circuit-breaker/opposum/opposum-service";
import { authClient, catalogClient } from "@/commons/config";

const container = createContainer();

// ==========================================
// REGISTER INFRASTRUCTURE & REPOSITORIES
// ==========================================

const catalogAxiosService = new AxiosApiSevice(catalogClient);
const userAxiosService = new AxiosApiSevice(authClient)
container.register([


    {
        key: WinstonLoggerService.name,
        Class: WinstonLoggerService,
        parameter: { dependencies: [] },
    },
    {
        key: OpposumCircuitBreakerService.name,
        Class: OpposumCircuitBreakerService,
        parameter: {
            injectType: "destructuring",

            dependencies: [
                { name: "logger", internal: WinstonLoggerService.name }
            ]
        }
    },
    {
        key: AxiosApiSevice.name,
        Class: AxiosApiSevice,
        parameter: { dependencies: [] }
    },
    {
        key: RedisConnection.name,
        Class: RedisConnection,
        parameter: {
            dependencies: [
                { internal: WinstonLoggerService.name },
            ],
        },
    },
    {
        key: RedisClientService.name,
        Class: RedisClientService,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "logger", internal: WinstonLoggerService.name },
                { name: "connection", internal: RedisConnection.name },
            ]
        },
    },
    {
        key: PlaylistRepositoryPrisma.name,
        Class: PlaylistRepositoryPrisma,
        parameter: {
            dependencies: [
                { concrete: postgresql },
                { internal: WinstonLoggerService.name },
            ],
        },
    },
    {
        key: PlaylistSongRepositoryPrisma.name,
        Class: PlaylistSongRepositoryPrisma,
        parameter: {
            dependencies: [
                { concrete: postgresql },
                { internal: WinstonLoggerService.name },
                { internal: RedisClientService.name },
            ],
        },
    },
    {
        key: PlaylistActivityRepositoryPrisma.name,
        Class: PlaylistActivityRepositoryPrisma,
        parameter: {
            dependencies: [
                { concrete: postgresql },
                { internal: WinstonLoggerService.name },
            ],
        },
    },
    {
        key: CachedSongRepositoryPrisma.name,
        Class: CachedSongRepositoryPrisma,
        parameter: {
            dependencies: [
                { concrete: postgresql },
                { internal: WinstonLoggerService.name },
                { internal: RedisClientService.name },
            ],
        },
    },
    {
        key: CollaborationRepositoryPrisma.name,
        Class: CollaborationRepositoryPrisma,
        parameter: {
            dependencies: [
                { concrete: postgresql },
                { internal: WinstonLoggerService.name },
            ],
        },
    },
    {
        key: UserRepositoryAxios.name,
        Class: UserRepositoryAxios,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "axiosService", concrete: userAxiosService },
                { name: "circuitBreakerService", internal: OpposumCircuitBreakerService.name },
            ]
        },
    },

    {
        key: SongRepositoryAxios.name,
        Class: SongRepositoryAxios,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "axiosService", concrete: catalogAxiosService },
                { name: "circuitBreakerService", internal: OpposumCircuitBreakerService.name },
            ]
        },
    },
    {
        key: RabbitMQConnection.name,
        Class: RabbitMQConnection,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "logger", internal: WinstonLoggerService.name }
            ]
        }
    },
    {
        key: RabbitMQService.name,
        Class: RabbitMQService,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "logger", internal: WinstonLoggerService.name },
                { name: "connection", internal: RabbitMQConnection.name }
            ]
        }
    },
    {
        key: RabbitMQListener.name,
        Class: RabbitMQListener,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "logger", internal: WinstonLoggerService.name },
                { name: "connection", internal: RabbitMQConnection.name }
            ]
        }
    },

    // Validators
    {
        key: ZodPlaylistValidator.name,
        Class: ZodPlaylistValidator,
        parameter: { dependencies: [] },
    },
    {
        key: ZodCollaborationValidator.name,
        Class: ZodCollaborationValidator,
        parameter: { dependencies: [] },
    },
    {
        key: ZodExportValidator.name,
        Class: ZodExportValidator,
        parameter: { dependencies: [] },
    },
    {
        key: ZodCachedSongValidator.name,
        Class: ZodCachedSongValidator,
        parameter: { dependencies: [] }
    }
]);

// ==========================================
// REGISTER USE CASES
// ==========================================
container.register([
    {
        key: AddCachedSongUseCase.name,
        Class: AddCachedSongUseCase,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "cachedSongRepository", internal: CachedSongRepositoryPrisma.name },
                { name: "cachedSongValidator", internal: ZodCachedSongValidator.name },
            ],
        },
    },
    {
        key: UpdateCachedSongUseCase.name,
        Class: UpdateCachedSongUseCase,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "cachedSongRepository", internal: CachedSongRepositoryPrisma.name },
                { name: "cachedSongValidator", internal: ZodCachedSongValidator.name },
            ],
        }
    },
    {
        key: RemoveCachedSongUseCase.name,
        Class: RemoveCachedSongUseCase,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "cachedSongRepository", internal: CachedSongRepositoryPrisma.name },
            ]
        }
    },
    {
        key: AddPlaylistUseCase.name,
        Class: AddPlaylistUseCase,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "playlistRepository", internal: PlaylistRepositoryPrisma.name },
                { name: "playlistValidator", internal: ZodPlaylistValidator.name },
            ],
        },
    },
    {
        key: GetPlaylistsUseCase.name,
        Class: GetPlaylistsUseCase,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "playlistRepository", internal: PlaylistRepositoryPrisma.name },
                { name: "userRepository", internal: UserRepositoryAxios.name },
            ],
        },
    },
    {
        key: DeletePlaylistUseCase.name,
        Class: DeletePlaylistUseCase,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "playlistRepository", internal: PlaylistRepositoryPrisma.name },
            ],
        },
    },
    {
        key: GetSongsInPlaylistUseCase.name,
        Class: GetSongsInPlaylistUseCase,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "playlistRepository", internal: PlaylistRepositoryPrisma.name },
                { name: "playlistSongRepository", internal: PlaylistSongRepositoryPrisma.name },
                { name: "playlistValidator", internal: ZodPlaylistValidator.name },
                { name: "loggerService", internal: WinstonLoggerService.name },
            ],
        },
    },
    {
        key: AddSongToPlaylistUseCase.name,
        Class: AddSongToPlaylistUseCase,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "playlistRepository", internal: PlaylistRepositoryPrisma.name },
                { name: "playlistValidator", internal: ZodPlaylistValidator.name },
                { name: "playlistSongRepository", internal: PlaylistSongRepositoryPrisma.name },
                { name: "playlistActivityRepository", internal: PlaylistActivityRepositoryPrisma.name },
                { name: "songRepository", internal: SongRepositoryAxios.name },
                { name: "cachedSongRepository", internal: CachedSongRepositoryPrisma.name },
            ],
        },
    },
    {
        key: RemoveSongFromPlaylistUseCase.name,
        Class: RemoveSongFromPlaylistUseCase,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "playlistRepository", internal: PlaylistRepositoryPrisma.name },
                { name: "playlistValidator", internal: ZodPlaylistValidator.name },
                { name: "playlistSongRepository", internal: PlaylistSongRepositoryPrisma.name },
                { name: "playlistActivityRepository", internal: PlaylistActivityRepositoryPrisma.name },
            ],
        },
    },
    {
        key: GetPlaylistActivitiesUseCase.name,
        Class: GetPlaylistActivitiesUseCase,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "playlistRepository", internal: PlaylistRepositoryPrisma.name },
                { name: "playlistActivityRepository", internal: PlaylistActivityRepositoryPrisma.name },
                { name: "userRepository", internal: UserRepositoryAxios.name },
            ],
        },
    },
    {
        key: AddCollaborationUseCase.name,
        Class: AddCollaborationUseCase,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "playlistRepository", internal: PlaylistRepositoryPrisma.name },
                { name: "collaborationRepository", internal: CollaborationRepositoryPrisma.name },
                { name: "userRepository", internal: UserRepositoryAxios.name },
                { name: "collaborationValidator", internal: ZodCollaborationValidator.name },
            ],
        },
    },
    {
        key: RemoveCollaborationUseCase.name,
        Class: RemoveCollaborationUseCase,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "playlistRepository", internal: PlaylistRepositoryPrisma.name },
                { name: "collaborationRepository", internal: CollaborationRepositoryPrisma.name },
                { name: "collaborationValidator", internal: ZodCollaborationValidator.name },
            ],
        },
    },
    {
        key: ExportPlaylistUseCase.name,
        Class: ExportPlaylistUseCase,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "playlistRepository", internal: PlaylistRepositoryPrisma.name },
                { name: "messageBrokerService", internal: RabbitMQService.name },
                { name: "exportValidator", internal: ZodExportValidator.name },
            ],
        },
    },
]);

function getInstance<T>(key: string): T {
    return container.getInstance(key) as T;
}

export { container, getInstance };
