import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { getTokenLocal } from "../utils/localStorage.utils";
import HttpClient from "../apis/index.api";
import ApiRoutes from "../configs/endpoints.config";
// import type { Snacks } from "../modules/snacks";

// 🔹 Request type
type CreateRentalRequest = {
    name: string;
    categoryId: string;
    rentalType: string;
    status: string;
    basePrice: number;
    deposit: number;
    stock: number;
    items: {
        productId: string;
        quantity: number;
    }[];
};

type UpdateRentalRequest = {
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

class RentalApi extends HttpClient {

    private createRentalConfig: ApiConfig = ApiRoutes.Rental.CreateRental;
    private getAllRentalsConfig: ApiConfig = ApiRoutes.Rental.GetAllRentals;
    private updateRentalConfig: ApiConfig = ApiRoutes.Rental.UpdateRental;
    private deleteRentalConfig: ApiConfig = ApiRoutes.Rental.DeleteRental;

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

    //  Create Rentlas API
    public createRental = async (
        reqBody: CreateRentalRequest
    ): Promise<AxiosResponse> => {
        return this.instance({
            method: this.createRentalConfig.Method,
            url: this.createRentalConfig.Endpoint,
            data: reqBody,
        });
    };

    // Get All Rentlas API
    public getAllRentals = async (): Promise<AxiosResponse> => {
        return this.instance({
            method: this.getAllRentalsConfig.Method,
            url: this.getAllRentalsConfig.Endpoint,
        });
    };

    public updateRentals = async (
        reqBody: UpdateRentalRequest
    ): Promise<AxiosResponse> => {
        return this.instance({
            method: this.updateRentalConfig.Method,
            url: `${this.updateRentalConfig.Endpoint}/${reqBody.id}`,
            data: reqBody,
        });
    };

    public deleteRentals = async (id: string): Promise<AxiosResponse> => {
        return this.instance({
            method: this.deleteRentalConfig.Method,
            url: `${this.deleteRentalConfig.Endpoint}/${id}`,
        });
    };
}

export default RentalApi;