import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import rateLimit from 'axios-rate-limit';

export interface ApiClientConfig {
  baseURL: string;
  headers?: Record<string, string>;
  timeout?: number;
  maxRequests?: number;
  perMilliseconds?: number;
  retries?: number;
  maxRetryDelay?: number;
  securityHeaders?: boolean;
}

export class ApiClient {
  private client: AxiosInstance;
  private retries: number;
  private maxRetryDelay: number;

  constructor(config: ApiClientConfig) {
    const axiosInstance = axios.create({
      baseURL: config.baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      timeout: config.timeout || 30000,
      withCredentials: true,
    });

    // Add rate limiting
    this.client = rateLimit(axiosInstance, {
      maxRequests: config.maxRequests || 2,
      perMilliseconds: config.perMilliseconds || 1000,
    });

    this.retries = config.retries || 3;
    this.maxRetryDelay = config.maxRetryDelay || 10000;

    // Add request interceptor for authentication and security
    this.client.interceptors.request.use(
      (config) => {
        // Ensure headers exist
        config.headers = config.headers || {};
        
        // Security headers
        if (config.securityHeaders !== false) {
          config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
          config.headers['Pragma'] = 'no-cache';
          config.headers['X-Content-Type-Options'] = 'nosniff';
          config.headers['X-Frame-Options'] = 'DENY';
          config.headers['X-XSS-Protection'] = '1; mode=block';
          config.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
          config.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
          config.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()';
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling and retries
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config as AxiosRequestConfig & { retryCount?: number };
        if (!config) {
          return Promise.reject(error);
        }

        // Don't retry on certain status codes
        if (error.response?.status === 400 || error.response?.status === 401 || error.response?.status === 403) {
          return Promise.reject(error);
        }

        config.retryCount = config.retryCount || 0;

        if (config.retryCount >= this.retries) {
          return Promise.reject(error);
        }

        config.retryCount += 1;

        // Implement exponential backoff with max delay
        const backoffDelay = Math.min(
          Math.pow(2, config.retryCount) * 1000,
          this.maxRetryDelay
        );
        await new Promise(resolve => setTimeout(resolve, backoffDelay));

        return this.client(config);
      }
    );
  }

  private async handleRequest<T>(
    requestFn: () => Promise<{ data: T }>
  ): Promise<T> {
    try {
      const response = await requestFn();
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized: Please check your authentication');
      }
      if (error.response?.status === 403) {
        throw new Error('Forbidden: You do not have permission to access this resource');
      }
      if (error.response?.status === 429) {
        throw new Error('Too Many Requests: Please try again later');
      }
      if (error.response?.status === 400) {
        throw new Error(`Bad Request: ${error.response.data?.message || 'Invalid request'}`);
      }
      if (error.response?.status === 500) {
        throw new Error('Internal Server Error: Please try again later');
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request Timeout: The server took too long to respond');
      }
      if (!error.response) {
        throw new Error('Network Error: Please check your connection');
      }
    }
    throw error;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.handleRequest(() => this.client.get<T>(url, config));
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.handleRequest(() => this.client.post<T>(url, data, config));
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.handleRequest(() => this.client.put<T>(url, data, config));
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.handleRequest(() => this.client.delete<T>(url, config));
  }
}

// Fetch API client
export class FetchApiClient {
  private baseURL: string;
  private headers: Record<string, string>;
  private maxRetryDelay: number;
  private retries: number;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    this.maxRetryDelay = config.maxRetryDelay || 10000;
    this.retries = config.retries || 3;

    // Add security headers
    if (config.securityHeaders !== false) {
      this.headers = {
        ...this.headers,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      };
    }
  }

  private async handleRequest<T>(url: string, options: RequestInit, retryCount = 0): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        ...options,
        headers: this.headers,
        credentials: 'include',
      });

      if (!response.ok) {
        // Don't retry on certain status codes
        if (response.status === 400 || response.status === 401 || response.status === 403) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Retry with exponential backoff
        if (retryCount < this.retries) {
          const backoffDelay = Math.min(
            Math.pow(2, retryCount) * 1000,
            this.maxRetryDelay
          );
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          return this.handleRequest(url, options, retryCount + 1);
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request Timeout: The server took too long to respond');
        }
        if (!navigator.onLine) {
          throw new Error('Network Error: Please check your connection');
        }
      }
      throw error;
    }
  }

  async get<T>(url: string, config?: RequestInit): Promise<T> {
    return this.handleRequest<T>(url, {
      method: 'GET',
      ...config,
    });
  }

  async post<T>(url: string, data?: unknown, config?: RequestInit): Promise<T> {
    return this.handleRequest<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...config,
    });
  }

  async put<T>(url: string, data?: unknown, config?: RequestInit): Promise<T> {
    return this.handleRequest<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...config,
    });
  }

  async delete<T>(url: string, config?: RequestInit): Promise<T> {
    return this.handleRequest<T>(url, {
      method: 'DELETE',
      ...config,
    });
  }
} 