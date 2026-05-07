import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { getTokenLocal } from "../utils/localStorage.utils";
import HttpClient from "../apis/index.api";
import ApiRoutes from "../configs/endpoints.config";

// Define types for request bodies (you can refine these later)

// type SignUpRequest = {
//   email: string;
//   password: string;
//   name?: string;
// };

type SendOtpRequest = {
  countryCode: string;
  phone: string;
};

type VerifyOtpRequest = {
  countryCode: string;
  phone: string;
  otp: string;
};

// Define API route config type
type ApiConfig = {
  Method: AxiosRequestConfig["method"];
  Endpoint: string;
};

const baseURL: string = import.meta.env.VITE_API_URL || "";

class Auth extends HttpClient {
  // private signUpConfig: ApiConfig = ApiRoutes.Auth.SignUp;
  private sendOtpConfig: ApiConfig = ApiRoutes.Auth.SendOtp;
  private verifyOtpConfig: ApiConfig = ApiRoutes.Auth.VerifyOtp;
  // private resendOtpConfig: ApiConfig = ApiRoutes.Auth.ResendOtp;

  constructor() {
    super(baseURL);
    this._initializeRequestInterceptor();
    this._initializeResponseInterceptor();
  }

  private _initializeRequestInterceptor = (): void => {
   this.instance.interceptors.request.use((config) => {
      const token = getTokenLocal();
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    });
  };

  private _initializeResponseInterceptor = (): void => {
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => Promise.resolve(error.response)
    );
  };

  // 🔐 API Methods


  // public signUp = async (reqBody: SignUpRequest): Promise<AxiosResponse> => {
  //   return this.instance({
  //     method: this.signUpConfig.Method,
  //     url: this.signUpConfig.Endpoint,
  //     data: reqBody,
  //   });
  // };


  public sendOtp = async (
    reqBody: SendOtpRequest
  ): Promise<AxiosResponse> => {
    return this.instance({
      method: this.sendOtpConfig.Method,
      url: this.sendOtpConfig.Endpoint,
      data: reqBody,
    });
  };

  public verifyOtp = async (
    reqBody: VerifyOtpRequest
  ): Promise<AxiosResponse> => {
    return this.instance({
      method: this.verifyOtpConfig.Method,
      url: this.verifyOtpConfig.Endpoint,
      data: reqBody,
    });
  };

  // public resendOtp = async (reqBody: OtpRequest): Promise<AxiosResponse> => {
  //   return this.instance({
  //     method: this.resendOtpConfig.Method,
  //     url: this.resendOtpConfig.Endpoint,
  //     data: reqBody,
  //   });
  // };
}

export default Auth;