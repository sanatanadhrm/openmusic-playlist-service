export interface UserSummary {
    id: string;
    username: string;
}

export interface UserRepository {
    verifyUserExists(userId: string): Promise<void>;
    getUserByIds(userId: string[]): Promise<UserSummary[]>;
}