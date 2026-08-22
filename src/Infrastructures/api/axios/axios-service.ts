import { ApiService } from "@/applications/api/api-service";
import { AxiosInstance, AxiosResponse } from "axios";

export class AxiosApiSevice implements ApiService {
    private readonly _api: AxiosInstance;

    constructor(api: AxiosInstance) {
        this._api = api;
    }

    async get(url: string): Promise<AxiosResponse<any>> {
        const response = await this._api.get(url);
        return response;
    }
    async post(url: string, data: any): Promise<AxiosResponse<any>> {
        const response = await this._api.post(url, data);
        return response;
    }
    async put(url: string, data: any): Promise<AxiosResponse<any>> {
        const response = await this._api.put(url, data);
        return response;
    }
    async delete(url: string): Promise<AxiosResponse<any>> {
        const response = await this._api.delete(url);
        return response;
    }

}