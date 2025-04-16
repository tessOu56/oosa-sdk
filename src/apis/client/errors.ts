import { ApiError } from './types';

export class ApiClientError extends Error {
  public code: string;
  public details?: any;
  public timestamp: number;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiClientError';
    this.code = error.code;
    this.details = error.details;
    this.timestamp = error.timestamp;
  }

  static fromAxiosError(error: any): ApiClientError {
    const apiError: ApiError = {
      code: error.response?.status?.toString() || 'UNKNOWN_ERROR',
      message: error.response?.data?.message || error.message || 'An unknown error occurred',
      details: error.response?.data?.details || error.response?.data,
      timestamp: Date.now(),
    };

    return new ApiClientError(apiError);
  }

  static fromError(error: Error): ApiClientError {
    const apiError: ApiError = {
      code: 'INTERNAL_ERROR',
      message: error.message,
      timestamp: Date.now(),
    };

    return new ApiClientError(apiError);
  }
} 