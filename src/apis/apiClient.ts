import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiError, ApiErrorType } from "@apis/apiError";
import { DefaultApi, Configuration } from "./generated";
import { ApiRequestOptions, ApiResponse, ClientType } from "@apis/apiClient.types";
import { normalizeHeaders, normalizeParams } from '../utils/apiUtils'

export class ApiClient {
  private baseUrl: string;
  private clientType: "fetch" | "axios";
  private axiosInstance: AxiosInstance | null = null;
  private api: DefaultApi;

  constructor(
    baseUrl: string = process.env.REACT_APP_API_URL || "https://api.oosa.com",
    clientType: "fetch" | "axios" = "fetch"
  ) {
    this.baseUrl = baseUrl;
    this.clientType = clientType;

    const config = new Configuration({ basePath: baseUrl });
    this.api = new DefaultApi(config);

    if (clientType === "axios") {
      this.axiosInstance = axios.create({
        baseURL: baseUrl,
        withCredentials: true,
        timeout: 5000,
        headers: { "Content-Type": "application/json" },
      });

      this.axiosInstance.interceptors.response.use(
        (res: AxiosResponse) => res,
        (error) => {
          const url = error.config?.url || "";
          const errorType: ApiErrorType = url.includes("/self-service")
            ? "SSO_ERROR"
            : url.includes("/idea") || url.includes("/event")
            ? "RESOURCE_ERROR"
            : "UNKNOWN_ERROR";

          if (axios.isCancel(error)) {
            return Promise.reject(new ApiError(408, "Request Canceled", "NETWORK_ERROR"));
          }

          if (error.response) {
            return Promise.reject(
              new ApiError(
                error.response.status,
                error.response.data?.message || "API Error",
                errorType,
                error.response.data
              )
            );
          }

          return Promise.reject(new ApiError(500, "Network Error", "NETWORK_ERROR"));
        }
      );
    }
  }

  getInstance() {
    return this.api;
  }

  async request<T>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const { params = {}, headers: userHeaders = {}, ...rest } = options || {};

    const { csrf_token } = params;
    const headers = normalizeHeaders({
      "Content-Type": "application/json",
      ...userHeaders,
      ...(csrf_token ? { "X-CSRF-Token": csrf_token } : {}),
    })

    if (this.clientType === "axios" && this.axiosInstance) {
      try {
        const res = await this.axiosInstance.request<T>({
          url: endpoint,
          method: rest.method as any,
          data: rest.body,
          headers,
          params,
        });
        return { data: res.data };
      } catch (error) {
        if (error instanceof ApiError) {
          return { data: null, error: error.message };
        }
        return { data: null, error: "Unexpected axios error" };
      }
    }

    // fetch 版本
    let urlWithParams = this.baseUrl + endpoint;
    if (params) {
      const query = new URLSearchParams(normalizeParams(params)).toString()
      urlWithParams += (endpoint.includes("?") ? "&" : "?") + query
    }

    const controller = new AbortController();
    const signal = controller.signal;
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(urlWithParams, {
        ...rest,
        signal,
        credentials: "include",
        headers,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorType: ApiErrorType = endpoint.includes("/self-service")
          ? "SSO_ERROR"
          : endpoint.includes("/idea") || endpoint.includes("/event")
          ? "RESOURCE_ERROR"
          : "UNKNOWN_ERROR";

        throw await ApiError.fromResponse(response, errorType);
      }

      const data: T = await response.json();
      return { data };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return { data: null, error: "Request Timeout" };
      }
      return { data: null, error: (error as Error).message };
    }
  }
}