
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { getTokenLocal } from "../utils/localStorage.utils";
import HttpClient from "../apis/index.api";
import ApiRoutes from "../configs/endpoints.config";

// 🔹 API Config type
type ApiConfig = {
    Method: AxiosRequestConfig["method"];
    Endpoint: string;
};

type UpdateUserDetailRequest = {
    name: string;
    email: string;
    // avatar: string;
    address: string;
    city: string;
    state: string;
    country: string;
};

type CreateUserRequest = {
    phone: string;
    email: string;
    name: string;
    city: string;
    state: string;
    country: string;
    address: string;
};

const baseURL: string = import.meta.env.VITE_API_URL || "";

class UserApi extends HttpClient {

    // =========================
    // API CONFIGS
    // =========================

    private createUserConfig: ApiConfig =
        ApiRoutes.User.CreateUser;

    private getAllUserConfig: ApiConfig =
        ApiRoutes.User.GetAllUsers;

    private getUserByIdConfig: ApiConfig =
        ApiRoutes.User.GetUserById;

    private updateUserDetailConfig: ApiConfig =
        ApiRoutes.User.UpdateUserDetail;

    private rechargeUserWalletConfig: ApiConfig =
        ApiRoutes.User.RechargeUserWallet;

    private walletTransactionConfig: ApiConfig =
        ApiRoutes.User.WalletTransaction;

    private toggleUserStatusConfig: ApiConfig =
        ApiRoutes.User.ToggleUserStatus

    constructor() {
        super(baseURL);

        this._initializeRequestInterceptor();
        this._initializeResponseInterceptor();
    }

    // =========================
    // REQUEST INTERCEPTOR
    // =========================

    protected _initializeRequestInterceptor = (): void => {
        this.instance.interceptors.request.use((config) => {
            const token = getTokenLocal();

            if (token && config.headers) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }

            return config;
        });
    };

    // =========================
    // RESPONSE INTERCEPTOR
    // =========================

    protected _initializeResponseInterceptor = (): void => {
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error) => Promise.resolve(error.response)
        );
    };

    public createUser = async (
        payload: CreateUserRequest
    ): Promise<AxiosResponse> => {
        return this.instance({
            method: this.createUserConfig.Method,
            url: this.createUserConfig.Endpoint,
            data: payload,
        });
    };

    // =========================
    // GET USER BY ID
    // =========================

    public getAllUsers = async (
        page = 1,
        limit = 10
    ): Promise<AxiosResponse> => {
        return this.instance({
            method: this.getAllUserConfig.Method,
            url: `${this.getAllUserConfig.Endpoint}?page=${page}&limit=${limit}`,
        });
    };

    public getUserById = async (id: string): Promise<AxiosResponse> => {
        return this.instance({
            method: this.getUserByIdConfig.Method,
            url: `${this.getUserByIdConfig.Endpoint}/${id}`,
        });
    };

    public updateUserDetail = async (
        id: string,
        payload: UpdateUserDetailRequest
    ): Promise<AxiosResponse> => {
        return this.instance({
            method: this.updateUserDetailConfig.Method,
            url: `${this.updateUserDetailConfig.Endpoint}/${id}`,
            data: payload,
        });
    };

    public rechargeUserWallet = async (
        id: string,
        payload: {
            amount: number;
        },
    ): Promise<AxiosResponse> => {
        return this.instance({
            method: this.rechargeUserWalletConfig.Method,
            url: `${this.rechargeUserWalletConfig.Endpoint}/${id}`,
            data: payload,
        });
    };

    public getWalletTransaction = async (
        id: string,
        page = 1,
        limit = 10
    ): Promise<AxiosResponse> => {
        const params = new URLSearchParams();

        params.append("page", String(page));
        params.append("limit", String(limit));

        return this.instance({
            method: this.walletTransactionConfig.Method,
            url: `${this.walletTransactionConfig.Endpoint}/${id}?${params.toString()}`,
        });
    };

    public toggleUserStatus = async (
        id: string,
        payload: {
            status: "ACTIVE" | "SUSPENDED";
        }
    ): Promise<AxiosResponse> => {
        return this.instance({
            method: this.toggleUserStatusConfig.Method,
            url: `${this.toggleUserStatusConfig.Endpoint}/${id}`,
            data: payload,
        });
    };

}

export default UserApi;