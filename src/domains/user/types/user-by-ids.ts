import { ApiResponse } from "@/commons/types/api-response";


export interface UserByIds {
    user: {
        id: string;
        username: string;
        fullname: string;
    }[]
}

export type UserByIdsResponse = ApiResponse<UserByIds>