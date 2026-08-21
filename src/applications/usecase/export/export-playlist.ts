// src/applications/usecase/export/export-playlist.ts

import { MessageBrokerService } from "@/applications/message/message-broker-service";
import { ExportValidator } from "@/applications/validation/export-validator";
import { DomainErrorCode } from "@/commons/exception/constants/domain-error-code";
import { PlaylistRepository } from "@/domains/playlist/playlist-repository";

interface ExportPlaylistUseCaseDependencies {
    messageBrokerService: MessageBrokerService;
    playlistRepository: PlaylistRepository;
    exportValidator: ExportValidator;
}

export class ExportPlaylistUseCase {
    private _messageBrokerService: MessageBrokerService;
    private _playlistRepository: PlaylistRepository;
    private _exportValidator: ExportValidator;

    constructor(deps: ExportPlaylistUseCaseDependencies) {
        this._messageBrokerService = deps.messageBrokerService;
        this._playlistRepository = deps.playlistRepository;
        this._exportValidator = deps.exportValidator;
    }

    async execute(userId: string, playlistId: string, payload: unknown): Promise<void> {
        // 1. Validasi struktur payload { targetEmail }
        const { targetEmail } = this._exportValidator.validateExportPlaylistPayload(payload);

        // 2. Cek apakah playlist ada & ambil ownerId
        const { ownerId } = await this._playlistRepository.getPlaylistOwnership(playlistId);

        // 3. Verifikasi kepemilikan (hanya owner playlist yang berhak mengekspor)
        if (ownerId !== userId) {
            throw new Error(DomainErrorCode.PLAYLIST_ACCESS_FORBIDDEN);
        }

        // 4. Siapkan pesan ke RabbitMQ sesuai spesifikasi v3
        const message = JSON.stringify({
            playlistId,
            targetEmail,
        });

        // 5. Kirim ke antrean 'export:playlists'
        // await this._messageBrokerService.sendMessage("export:playlists", message);
    }
}
