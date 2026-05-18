
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { getTokenLocal } from "../utils/localStorage.utils";
import HttpClient from "../apis/index.api";
import ApiRoutes from "../configs/endpoints.config";

// 🔹 API Config type
type ApiConfig = {
  Method: AxiosRequestConfig["method"];
  Endpoint: string;
};

const baseURL: string = import.meta.env.VITE_API_URL || "";

class CategoryApi extends HttpClient {

  // =========================
  // API CONFIGS
  // =========================

  private getAllCategoriesConfig: ApiConfig =
    ApiRoutes.Category.GetAllCategories;

  private createCategoryConfig: ApiConfig =
    ApiRoutes.Category.CreateCategory;

  private updateCategoryConfig: ApiConfig =
    ApiRoutes.Category.UpdateCategory;

  private deleteCategoryConfig: ApiConfig =
    ApiRoutes.Category.DeleteCategory;

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

  // =========================
  // GET ALL CATEGORIES
  // =========================

  public getAllCategories = async (
  page = 1,
  limit = 10
): Promise<AxiosResponse> => {
  return this.instance({
    method: this.getAllCategoriesConfig.Method,
    url: `${this.getAllCategoriesConfig.Endpoint}?page=${page}&limit=${limit}`,
  });
};

  // =========================
  // CREATE CATEGORY
  // =========================

  public createCategory = async (
    payload: {
  name: string;
}
  ): Promise<AxiosResponse> => {
    return this.instance({
      method: this.createCategoryConfig.Method,
      url: this.createCategoryConfig.Endpoint,
      data: payload,
    });
  };

  // =========================
  // UPDATE CATEGORY
  // =========================

  public updateCategory = async (
    payload: {
      name: string;
    }, id: string
  ): Promise<AxiosResponse> => {
    return this.instance({
      method: this.updateCategoryConfig.Method,
      url: `${this.updateCategoryConfig.Endpoint}/${id}`,
      data: payload,
    });
  };

  // =========================
  // DELETE CATEGORY
  // =========================

  public deleteCategory = async (
    id: string
  ): Promise<AxiosResponse> => {
    return this.instance({
      method: this.deleteCategoryConfig.Method,
      url: `${this.deleteCategoryConfig.Endpoint}/${id}`,
    });
  };
}

export default CategoryApi;