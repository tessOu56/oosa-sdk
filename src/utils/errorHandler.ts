import { AxiosError } from 'axios';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof AxiosError) {
    return new ApiError(
      error.response?.status || 500,
      error.code || 'UNKNOWN_ERROR',
      error.message,
      error.response?.data
    );
  }

  if (error instanceof Error) {
    return new ApiError(500, 'UNKNOWN_ERROR', error.message);
  }

  return new ApiError(500, 'UNKNOWN_ERROR', 'An unknown error occurred');
} 