import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { getTokenLocal } from "../utils/localStorage.utils";
import HttpClient from "../apis/index.api";
import ApiRoutes from "../configs/endpoints.config";
import type { Snacks } from "../modules/snacks";

// 🔹 API Config type
type ApiConfig = {
    Method: AxiosRequestConfig["method"];
    Endpoint: string;
};

const baseURL: string = import.meta.env.VITE_API_URL || "";

class CategoryApi extends HttpClient {

    private getAllCategoriesConfig: ApiConfig = ApiRoutes.Category.GetAllCategories;
    
    constructor() {
        super(baseURL);
        this._initializeRequestInterceptor();
        this._initializeResponseInterceptor();
    }

    // 🔐 Attach token
    private _initializeRequestInterceptor = (): void => {
        this.instance.interceptors.request.use((config) => {
            const token = getTokenLocal();
            if (token && config.headers) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
            return config;
        });
    };

    // 🔄 Handle response
    private _initializeResponseInterceptor = (): void => {
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error) => Promise.resolve(error.response)
        );
    };

    // Get All Categories API
    public getAllCategories = async (): Promise<AxiosResponse> => {
        return this.instance({
            method: this.getAllCategoriesConfig.Method,
            url: this.getAllCategoriesConfig.Endpoint,
        });
    };

}

export default CategoryApi;