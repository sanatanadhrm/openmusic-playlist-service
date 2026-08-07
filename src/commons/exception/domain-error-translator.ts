import { AuthenticationError } from "./authentication-error";
import { AuthorizationError } from "./authorization-error";
import { ClientError } from "./client-error";
import { DomainErrorCode } from "./constants/domain-error-code";
import { InvariantError } from "./invariant-error";
import { NotFoundError } from "./not-found-error";

// Record<string, ClientError>: object dengan key string bebas, tiap value WAJIB instance ClientError
const directories: Record<string, ClientError> = {
    // ============ AUTHENTICATIONS ============
    [DomainErrorCode.ACCESS_TOKEN_INVALID]: new AuthenticationError(
        "access token tidak valid atau sudah kedaluwarsa"
    ),
    [DomainErrorCode.ACCESS_TOKEN_MISSING]: new AuthenticationError(
        "access token tidak ditemukan pada request"
    ),

    // ============ ALBUMS ============
    [DomainErrorCode.ALBUM_NOT_CONTAIN_NEEDED_PROPERTY]: new InvariantError(
        "tidak dapat membuat album baru karena properti yang dibutuhkan tidak ada"
    ),
    [DomainErrorCode.ALBUM_NOT_MEET_DATA_TYPE_SPECIFICATION]: new InvariantError(
        "tidak dapat membuat album baru karena tipe data tidak sesuai"
    ),
    [DomainErrorCode.ALBUM_YEAR_CANNOT_BE_IN_THE_FUTURE]: new InvariantError(
        "tahun album tidak boleh melebihi tahun saat ini"
    ),
    [DomainErrorCode.ALBUM_NOT_FOUND]: new NotFoundError("album tidak ditemukan"),

    // ============ SONGS ============
    [DomainErrorCode.SONG_NOT_CONTAIN_NEEDED_PROPERTY]: new InvariantError(
        "tidak dapat membuat lagu baru karena properti yang dibutuhkan tidak ada"
    ),
    [DomainErrorCode.SONG_NOT_MEET_DATA_TYPE_SPECIFICATION]: new InvariantError(
        "tidak dapat membuat lagu baru karena tipe data tidak sesuai"
    ),
    [DomainErrorCode.SONG_YEAR_CANNOT_BE_IN_THE_FUTURE]: new InvariantError(
        "tahun lagu tidak boleh melebihi tahun saat ini"
    ),
    [DomainErrorCode.SONG_NOT_FOUND]: new NotFoundError("lagu tidak ditemukan"),

    // ============ PLAYLISTS ============
    [DomainErrorCode.PLAYLIST_PARAMS_NOT_MEET_DATA_TYPE_SPESIFICATION]: new InvariantError(
        "parameter yang diberikan tidak sesuai dengan spesifikasi"
    ),
    [DomainErrorCode.PLAYLIST_NOT_CONTAIN_NEEDED_PROPERTY]: new InvariantError(
        "tidak dapat membuat playlist baru karena properti yang dibutuhkan tidak ada"
    ),
    [DomainErrorCode.PLAYLIST_NOT_MEET_DATA_TYPE_SPECIFICATION]: new InvariantError(
        "tidak dapat membuat playlist baru karena tipe data tidak sesuai"
    ),
    [DomainErrorCode.PLAYLIST_NOT_FOUND]: new NotFoundError("playlist tidak ditemukan"),
    [DomainErrorCode.PLAYLIST_ACCESS_FORBIDDEN]: new AuthorizationError(
        "Anda tidak berhak mengakses resource ini"
    ),

    // ============ PLAYLIST SONGS ============
    [DomainErrorCode.PLAYLIST_SONG_NOT_CONTAIN_NEEDED_PROPERTY]: new InvariantError(
        "harus mengirimkan songId"
    ),
    [DomainErrorCode.PLAYLIST_SONG_NOT_MEET_DATA_TYPE_SPECIFICATION]: new InvariantError(
        "songId harus berupa string"
    ),
    [DomainErrorCode.PLAYLIST_SONG_ALREADY_EXISTS]: new InvariantError(
        "lagu sudah ada di dalam playlist ini"
    ),
    [DomainErrorCode.PLAYLIST_SONG_NOT_FOUND]: new NotFoundError(
        "lagu tidak ditemukan di dalam playlist ini"
    ),

    // ============ COLLABORATIONS ============
    [DomainErrorCode.COLLABORATION_NOT_CONTAIN_NEEDED_PROPERTY]: new InvariantError(
        "harus mengirimkan playlistId dan userId"
    ),
    [DomainErrorCode.COLLABORATION_NOT_MEET_DATA_TYPE_SPECIFICATION]: new InvariantError(
        "playlistId dan userId harus berupa string"
    ),
    [DomainErrorCode.COLLABORATION_ALREADY_EXISTS]: new InvariantError(
        "user tersebut sudah menjadi kolaborator pada playlist ini"
    ),
    [DomainErrorCode.COLLABORATION_NOT_FOUND]: new NotFoundError(
        "kolaborasi tidak ditemukan"
    ),
    [DomainErrorCode.COLLABORATION_ACCESS_FORBIDDEN]: new AuthorizationError(
        "hanya pemilik playlist yang dapat mengelola kolaborasi"
    ),

    // ============ ALBUM LIKES ============
    [DomainErrorCode.ALBUM_LIKE_ALREADY_EXISTS]: new InvariantError(
        "Anda sudah menyukai album ini sebelumnya"
    ),
    [DomainErrorCode.ALBUM_LIKE_NOT_FOUND]: new InvariantError(
        "Anda belum menyukai album ini"
    ),

    // ============ EXPORTS ============
    [DomainErrorCode.EXPORT_NOT_CONTAIN_NEEDED_PROPERTY]: new InvariantError(
        "harus mengirimkan targetEmail"
    ),
    [DomainErrorCode.EXPORT_NOT_MEET_DATA_TYPE_SPECIFICATION]: new InvariantError(
        "targetEmail harus berupa string"
    ),
    [DomainErrorCode.EXPORT_TARGET_EMAIL_INVALID]: new InvariantError(
        "targetEmail harus berupa format email yang valid"
    ),

    // ============ UPLOADS ============
    [DomainErrorCode.UPLOAD_COVER_IMAGE_TYPE_NOT_ALLOWED]: new InvariantError(
        "tipe file yang diunggah tidak didukung, gunakan format gambar yang valid"
    ),
    [DomainErrorCode.UPLOAD_COVER_SIZE_EXCEEDS_LIMIT]: new InvariantError(
        "ukuran file yang diunggah melebihi batas maksimum 512KB"
    ),
    [DomainErrorCode.UPLOAD_COVER_FILE_MISSING]: new InvariantError(
        "harus menyertakan file cover"
    ),

    // ============ AUTHORIZATION ============
    [DomainErrorCode.USER_NOT_AUTHORIZED_TO_USE_THIS_ACTION]: new AuthorizationError(
        "anda tidak berhak menggunakan aksi ini"
    ),

    // ========= USER =============
    [DomainErrorCode.USER_NOT_FOUND]: new NotFoundError("user tidak ditemukan"),
};

export const DomainErrorTranslator = {
    translate(error: unknown): Error {
        if (error instanceof Error && error.message in directories) {
            return directories[error.message];
        }
        return error instanceof Error ? error : new Error("Unknown error");
    },
};