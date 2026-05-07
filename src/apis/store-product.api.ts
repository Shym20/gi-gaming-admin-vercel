import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { getTokenLocal } from "../utils/localStorage.utils";
import HttpClient from "../apis/index.api";
import ApiRoutes from "../configs/endpoints.config";
// import type { Snacks } from "../modules/snacks";

// 🔹 Request type
type CreateStoreProductRequest = {
    name: string;
    categoryId: string;
    productType: string;
    serialNumber: string;
    condition: string;
    price: number;
    stock: number;
    deposit: number;
};

type UpdateStoreProductRequest = {
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

class StoreProductApi extends HttpClient {

    private createStoreProductConfig: ApiConfig = ApiRoutes.StoreProduct.CreateStoreProduct;
    private getAllStoreProductsConfig: ApiConfig = ApiRoutes.StoreProduct.GetAllStoreProducts;
    private updateStoreProductConfig: ApiConfig = ApiRoutes.StoreProduct.UpdateStoreProduct;
    private deleteStoreProductConfig: ApiConfig = ApiRoutes.StoreProduct.DeleteStoreProduct;

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

    //  Create Store Products API
    public createStoreProduct = async (
        reqBody: CreateStoreProductRequest
    ): Promise<AxiosResponse> => {
        return this.instance({
            method: this.createStoreProductConfig.Method,
            url: this.createStoreProductConfig.Endpoint,
            data: reqBody,
        });
    };

    // Get All Store Products API
    public getAllStoreProducts = async (): Promise<AxiosResponse> => {
        return this.instance({
            method: this.getAllStoreProductsConfig.Method,
            url: this.getAllStoreProductsConfig.Endpoint,
        });
    };

    // Update Store Products API
    public updateStoreProduct = async (
        reqBody: UpdateStoreProductRequest
    ): Promise<AxiosResponse> => {
        return this.instance({
            method: this.updateStoreProductConfig.Method,
            url: `${this.updateStoreProductConfig.Endpoint}/${reqBody.id}`,
            data: reqBody,
        });
    };

    public deleteStoreProducts = async (id: string): Promise<AxiosResponse> => {
        return this.instance({
            method: this.deleteStoreProductConfig.Method,
            url: `${this.deleteStoreProductConfig.Endpoint}/${id}`,
        });
    };
}

export default StoreProductApi;