import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { getTokenLocal } from "../utils/localStorage.utils";
import HttpClient from "../apis/index.api";
import ApiRoutes from "../configs/endpoints.config";

// 🔹 Request type
type CreateCenterRequest = {
    name: string;
    address?: string;
    pcsCount: number;
    consoleCount: number;
};

type UpdateCenterRequest = {
    id: string;
    name: string;
    address?: string;
    pcsCount: number;
    consoleCount: number;
};


// 🔹 API Config type
type ApiConfig = {
    Method: AxiosRequestConfig["method"];
    Endpoint: string;
};

const baseURL: string = import.meta.env.VITE_API_URL || "";

class Centers extends HttpClient {

    private createCenterConfig: ApiConfig = ApiRoutes.Centers.CreateCenters;
    private getAllCentersConfig: ApiConfig = ApiRoutes.Centers.GetAllCenters;
    private updateCenterConfig: ApiConfig = ApiRoutes.Centers.UpdateCenter;
    private deleteCenterConfig: ApiConfig = ApiRoutes.Centers.DeleteCenter;

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

    //  Create Center API
    public createCenter = async (
        reqBody: CreateCenterRequest
    ): Promise<AxiosResponse> => {
        return this.instance({
            method: this.createCenterConfig.Method,
            url: this.createCenterConfig.Endpoint,
            data: reqBody,
        });
    };

    // Get All Centers API
    public getAllCenters = async (
        page = 1,
        limit = 10
    ): Promise<AxiosResponse> => {
        return this.instance({
            method: this.getAllCentersConfig.Method,
            url: `${this.getAllCentersConfig.Endpoint}?page=${page}&limit=${limit}`,
        });
    };

    public updateCenter = async (
        reqBody: UpdateCenterRequest
    ): Promise<AxiosResponse> => {
        return this.instance({
            method: this.updateCenterConfig.Method,
            url: `${this.updateCenterConfig.Endpoint}/${reqBody.id}`,
            data: reqBody,
        });
    };

    public deleteCenter = async (id: string): Promise<AxiosResponse> => {
        return this.instance({
            method: this.deleteCenterConfig.Method,
            url: `${this.deleteCenterConfig.Endpoint}/${id}`,
        });
    };
}

export default Centers;