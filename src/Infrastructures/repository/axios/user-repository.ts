import { authClient } from "@/commons/config";
import { DomainErrorCode } from "@/commons/exception/constants/domain-error-code";
import { NotFoundError } from "@/commons/exception/not-found-error";
import { UserByIdsResponse } from "@/domains/user/types/user-by-ids";
import { UserRepository, UserSummary } from "@/domains/user/user-repository";

export class UserRepositoryAxios implements UserRepository {
    async verifyUserExists(userId: string): Promise<void> {
        try {
            const response = await authClient.get(`user/${userId}`);
            if (response.status !== 200) {
                throw new NotFoundError(DomainErrorCode.USER_NOT_FOUND);
            }
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new NotFoundError(DomainErrorCode.USER_NOT_FOUND);
        }
    }

    async getUserByIds(userId: string[]): Promise<UserSummary[]> {
        try {
            const response = await authClient.post<UserByIdsResponse>(`user/ids`, { userIds: userId });
            if (response.status !== 200) {
                throw new NotFoundError(DomainErrorCode.USER_NOT_FOUND);
            }
            return response.data.data.user;
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new Error(error);
        }
    }
}