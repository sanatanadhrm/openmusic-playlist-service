export interface SongRepository {
    getSongById<TResult>(songId: string): Promise<TResult>;
}