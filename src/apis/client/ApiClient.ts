import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Configuration, DefaultApi } from '../generated';
import { ApiCache } from './cache';
import { ApiClientError } from './errors';
import { ApiClientConfig, ApiResponse, RequestConfig } from './types';

export class ApiClient {
  private config: ApiClientConfig;
  private api: DefaultApi;
  private axiosInstance!: AxiosInstance;
  private cache: ApiCache;

  constructor(config: ApiClientConfig) {
    // 創建基礎配置
    const baseConfig: Configuration = {
      basePath: config.baseURL || 'https://api.example.com',
      baseOptions: {
        timeout: config.timeout || 30000,
      },
      isJsonMime: (mime: string): boolean => {
        const jsonMime: RegExp = new RegExp('^(application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
        return mime !== null && (jsonMime.test(mime) || mime.toLowerCase() === 'application/json-patch+json');
      },
    };

    // 合併配置
    this.config = {
      ...baseConfig,
      ...config,
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
      cacheEnabled: config.cacheEnabled ?? true,
      cacheTTL: config.cacheTTL || 5 * 60 * 1000,
      isJsonMime: baseConfig.isJsonMime, // 確保 isJsonMime 方法被正確設置
    } as ApiClientConfig;

    this.cache = new ApiCache(this.config.cacheTTL);
    this.setupAxiosInstance();
    this.api = new DefaultApi(this.config);
  }

  private setupAxiosInstance(): void {
    this.axiosInstance = axios.create({
      baseURL: this.config.basePath,
      timeout: this.config.baseOptions?.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 請求攔截器
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // 在這裡添加認證信息等
        return config;
      },
      (error) => {
        return Promise.reject(ApiClientError.fromError(error));
      }
    );

    // 響應攔截器
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        return Promise.reject(ApiClientError.fromAxiosError(error));
      }
    );
  }

  private async retryRequest<T>(
    request: () => Promise<T>,
    attempts: number = this.config.retryAttempts!,
    delay: number = this.config.retryDelay!
  ): Promise<T> {
    try {
      return await request();
    } catch (error) {
      if (attempts > 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(request, attempts - 1, delay);
      }
      throw error;
    }
  }

  private generateCacheKey(url: string, params?: any): string {
    return `${url}:${JSON.stringify(params || {})}`;
  }

  private async request<T>(
    config: AxiosRequestConfig,
    requestConfig: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      retry = true,
      retryAttempts = this.config.retryAttempts,
      retryDelay = this.config.retryDelay,
      cache = this.config.cacheEnabled,
      cacheTTL = this.config.cacheTTL,
      timeout = this.config.baseOptions?.timeout,
    } = requestConfig;

    const cacheKey = this.generateCacheKey(config.url!, config.params);

    if (cache && this.cache.has(cacheKey)) {
      const cachedData = this.cache.get<T>(cacheKey);
      if (cachedData) {
        return {
          data: cachedData,
          status: 200,
          message: 'OK',
          timestamp: Date.now(),
        };
      }
    }

    const request = async () => {
      const response = await this.axiosInstance.request<T>({
        ...config,
        timeout,
      });

      if (cache) {
        this.cache.set(cacheKey, response.data, cacheTTL);
      }

      return {
        data: response.data,
        status: response.status,
        message: 'OK',
        timestamp: Date.now(),
      };
    };

    try {
      if (retry) {
        return await this.retryRequest(request, retryAttempts, retryDelay);
      }
      return await request();
    } catch (error) {
      throw ApiClientError.fromAxiosError(error);
    }
  }

  // 封裝常用的 HTTP 方法
  async get<T>(url: string, params?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
    }, config);
  }

  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
    }, config);
  }

  async put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
    }, config);
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
    }, config);
  }

  // 清除緩存
  clearCache(): void {
    this.cache.clear();
  }

  // 獲取原始 API 實例
  getApi(): DefaultApi {
    return this.api;
  }
} 