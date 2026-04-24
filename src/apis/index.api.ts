import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
} from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const baseURL: string = import.meta.env.VITE_API_URL || "";

export class HttpClient {
  protected instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    });

    this._initializeResponseInterceptor();
  }

  private _initializeResponseInterceptor = (): void => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError
    );
  };

  private _handleResponse = <T>(
    response: AxiosResponse<T>
  ): AxiosResponse<T> => {
    return response;
  };

  private _handleError = async (
    error: AxiosError
  ): Promise<never> => {
    const response = error.response;

    console.log(
      "HTTP ERROR RESPONSE outside:",
      response?.status
    );

    // if (response?.status === 401) {
    //   toast.error("Session expired! Please log in again.");

    //   console.log(
    //     "HTTP ERROR RESPONSE inside:",
    //     response.data
    //   );

    //   // clear auth cookies
    //   Cookies.remove("gi-gaming-admin_ufo");
    //   Cookies.remove("giGamingAdmin_auth_token");

    //   // redirect to login
    //   window.location.href = "/login";
    // }

    return Promise.reject(error);
  };
}

export default HttpClient;