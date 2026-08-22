import { DomainErrorCode } from "@/commons/exception/constants/domain-error-code";
import { NotFoundError } from "@/commons/exception/not-found-error";
import { UserByIdsResponse } from "@/domains/user/types/user-by-ids";
import { UserRepository, UserSummary } from "@/domains/user/user-repository";
import { AxiosApiSevice } from "@/Infrastructures/api/axios/axios-service";
import { OpposumCircuitBreakerService } from "@/Infrastructures/circuit-breaker/opposum/opposum-service";
import { AxiosResponse } from "axios";


interface UserRepositoryAxiosDeps {
    axiosService: AxiosApiSevice;
    circuitBreakerService: OpposumCircuitBreakerService
}

export class UserRepositoryAxios implements UserRepository {
    private readonly _axiosService: AxiosApiSevice;
    private readonly _circuitBreakerService: OpposumCircuitBreakerService;

    constructor(deps: UserRepositoryAxiosDeps) {
        this._axiosService = deps.axiosService;
        this._circuitBreakerService = deps.circuitBreakerService;

        this._circuitBreakerService.register(
            'verifyUserExists',
            async (userId: string) => {
                return await this._axiosService.get(`user/${userId}`);
            }
        );
        this._circuitBreakerService.register(
            'getUserByIds',
            async (userId: string[]) => {
                return await this._axiosService.post(`user/ids`, { userIds: userId });
            }
        );
    }
    async verifyUserExists(userId: string): Promise<void> {
        try {
            const verifyUserExistsWithBreaker = this._circuitBreakerService.execute<[string], AxiosResponse<unknown>>('verifyUserExists');
            const response = await verifyUserExistsWithBreaker(userId);
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
            const getUserByIdsWithBreaker = this._circuitBreakerService.execute<[string[]], AxiosResponse<UserByIdsResponse>>('getUserByIds');
            const response = await getUserByIdsWithBreaker(userId);
            console.log(response.data.data)
            if (response.status !== 200) {
                throw new NotFoundError(DomainErrorCode.USER_NOT_FOUND);
            }
            console.log(response.data, "masuk")
            return response.data.data.user;
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new Error(error);
        }
    }
}