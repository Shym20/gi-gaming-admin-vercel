import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { getTokenLocal } from "../utils/localStorage.utils";
import HttpClient from "../apis/index.api";
import ApiRoutes from "../configs/endpoints.config";
// import type { Snacks } from "../modules/snacks";

// 🔹 Request type
type CreateUserRentalRequest = {
    userId: string;
    rentalProductId: string;
    startDate: string;
    endDate: string;
    basePrice: number;
    deposit: number;
    items?: {
        productId: string;
        quantity: number;
    }[];
};

type UpdateUserRentalRequest = {
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

class UserRentalApi extends HttpClient {

    private createUserRentalConfig: ApiConfig = ApiRoutes.UserRental.CreateUserRental;
    private getAllUserRentalConfig: ApiConfig = ApiRoutes.UserRental.GetAllUserRental;
    private updateUserRentalConfig: ApiConfig = ApiRoutes.UserRental.UpdateUserRental;
    private deleteUserRentalConfig: ApiConfig = ApiRoutes.UserRental.DeleteUserRental;
    private getOverdueRentalListingConfig: ApiConfig = ApiRoutes.UserRental.GetOverdueRentalList;
    private addLateFeesToUserRentalConfig: ApiConfig = ApiRoutes.UserRental.AddLateFeesToUserRental;
    private sendOverdueReminderToUserRentalConfig: ApiConfig = ApiRoutes.UserRental.SendOverdueReminderToUserRental;
    private getRentalLedgerConfig: ApiConfig = ApiRoutes.UserRental.getRentalLedger;
    private getUserRentalDetailConfig: ApiConfig = ApiRoutes.UserRental.getUserRentalDetail;
    private getRentalActivityTimelineConfig: ApiConfig = ApiRoutes.UserRental.getRentalActivityTimeline;

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

    //  Create UserRental API
    public createUserRental = async (
        reqBody: CreateUserRentalRequest
    ): Promise<AxiosResponse> => {
        return this.instance({
            method: this.createUserRentalConfig.Method,
            url: this.createUserRentalConfig.Endpoint,
            data: reqBody,
        });
    };

    // Get All UserRental API
    public getAllUserRental = async (
        page = 1,
        limit = 10,
        search?: string
    ): Promise<AxiosResponse> => {
        const params = new URLSearchParams()

        params.append("page", String(page))
        params.append("limit", String(limit))

        if (search?.trim()) {
            params.append("search", search.trim())
        }

        return this.instance({
            method: this.getAllUserRentalConfig.Method,
            url: `${this.getAllUserRentalConfig.Endpoint}?${params.toString()}`,
        })
    }

    public getOverdueRentalListing = async (
        page = 1,
        limit = 10,
        search?: string
    ): Promise<AxiosResponse> => {
        const params = new URLSearchParams();

        params.append("page", String(page));
        params.append("limit", String(limit));

        if (search?.trim()) {
            params.append("search", search.trim());
        }

        return this.instance({
            method: this.getOverdueRentalListingConfig.Method,
            url: `${this.getOverdueRentalListingConfig.Endpoint}?${params.toString()}`,
        });
    };

    public updateUserRental = async (
        reqBody: UpdateUserRentalRequest
    ): Promise<AxiosResponse> => {
        return this.instance({
            method: this.updateUserRentalConfig.Method,
            url: `${this.updateUserRentalConfig.Endpoint}/${reqBody.id}`,
            data: reqBody,
        });
    };

    public addLateFeesToUserRental = async (
        id: string,
        payload: {
            amount: number;
        }
    ): Promise<AxiosResponse> => {
        return this.instance({
            method: this.addLateFeesToUserRentalConfig.Method,
            url: `${this.addLateFeesToUserRentalConfig.Endpoint}/${id}`,
            data: payload,
        });
    };

    public sendOverdueReminderToUserRental = async (
        id: string,
    ): Promise<AxiosResponse> => {
        return this.instance({
            method: this.sendOverdueReminderToUserRentalConfig.Method,
            url: `${this.sendOverdueReminderToUserRentalConfig.Endpoint}/${id}`,
        });
    };

    public getRentalLedger = async (
        id: string,
        page = 1,
        limit = 10
    ): Promise<AxiosResponse> => {
        const params = new URLSearchParams();

        params.append("page", String(page));
        params.append("limit", String(limit));

        return this.instance({
            method: this.getRentalLedgerConfig.Method,
            url: `${this.getRentalLedgerConfig.Endpoint}/${id}?${params.toString()}`,
        });
    };

    public getUserRentalDetail = async (id: string): Promise<AxiosResponse> => {
        return this.instance({
            method: this.getUserRentalDetailConfig.Method,
            url: `${this.getUserRentalDetailConfig.Endpoint}/${id}`,
        });
    };

    public getRentalActivityTimeline = async (
        id: string,
        limit = 1000
    ): Promise<AxiosResponse> => {
        const params = new URLSearchParams();

        params.append("limit", String(limit));

        return this.instance({
            method: this.getRentalActivityTimelineConfig.Method,
            url: `${this.getRentalActivityTimelineConfig.Endpoint}/${id}?${params.toString()}`,
        });
    };

    public deleteUserRental = async (id: string): Promise<AxiosResponse> => {
        return this.instance({
            method: this.deleteUserRentalConfig.Method,
            url: `${this.deleteUserRentalConfig.Endpoint}/${id}`,
        });
    };
}

export default UserRentalApi;