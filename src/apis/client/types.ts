import { Configuration } from '../generated/configuration';

// 擴展 Configuration 類型，保留所有原始屬性
export interface ApiClientConfig extends Configuration {
  // 自定義配置屬性
  baseURL?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  cacheEnabled?: boolean;
  cacheTTL?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
  timestamp: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}

export interface RequestConfig {
  retry?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
  cache?: boolean;
  cacheTTL?: number;
  timeout?: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
} 