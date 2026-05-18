import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { getTokenLocal } from "../utils/localStorage.utils";
import HttpClient from "../apis/index.api";
import ApiRoutes from "../configs/endpoints.config";
// import type { Snacks } from "../modules/snacks";

// 🔹 Request type
type CreateSnacksRequest = {
    name: string;
    price: number;
    stock: number;
};

type UpdateSnacksRequest = {
    id: string;
    name: string;
    price: number;
    stock: number;
};


// 🔹 API Config type
type ApiConfig = {
    Method: AxiosRequestConfig["method"];
    Endpoint: string;
};

const baseURL: string = import.meta.env.VITE_API_URL || "";

class SnacksApi extends HttpClient {

    private createSnacksConfig: ApiConfig = ApiRoutes.Snacks.CreateSnacks;
    private getAllSnacksConfig: ApiConfig = ApiRoutes.Snacks.GetAllSnacks;
    private updateSnacksConfig: ApiConfig = ApiRoutes.Snacks.UpdateSnacks;
    private deleteSnacksConfig: ApiConfig = ApiRoutes.Snacks.DeleteSnacks;

    constructor() {
        super(baseURL);
        this._initializeRequestInterceptor();
        this._initializeResponseInterceptor();
    }

    // 🔐 Attach token
    protected _initializeRequestInterceptor = (): void => {
        this.instance.interceptors.request.use((config) => {
            const token = getTokenLocal();
            if (token && config.headers) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
            return config;
        });
    };

    // 🔄 Handle response
    protected _initializeResponseInterceptor = (): void => {
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error) => Promise.resolve(error.response)
        );
    };

    //  Create Snacks API
    public createSnacks = async (
        reqBody: CreateSnacksRequest
    ): Promise<AxiosResponse> => {
        return this.instance({
            method: this.createSnacksConfig.Method,
            url: this.createSnacksConfig.Endpoint,
            data: reqBody,
        });
    };

    // Get All Snacks API
    public getAllSnacks = async (
        page = 1,
        limit = 10
    ): Promise<AxiosResponse> => {
        return this.instance({
            method: this.getAllSnacksConfig.Method,
            url: `${this.getAllSnacksConfig.Endpoint}?page=${page}&limit=${limit}`,
        });
    };

    public updateSnacks = async (
        reqBody: UpdateSnacksRequest
    ): Promise<AxiosResponse> => {
        return this.instance({
            method: this.updateSnacksConfig.Method,
            url: `${this.updateSnacksConfig.Endpoint}/${reqBody.id}`,
            data: reqBody,
        });
    };

    public deleteSnacks = async (id: string): Promise<AxiosResponse> => {
        return this.instance({
            method: this.deleteSnacksConfig.Method,
            url: `${this.deleteSnacksConfig.Endpoint}/${id}`,
        });
    };
}

export default SnacksApi;