export type ApiErrorType = "SSO_ERROR" | "RESOURCE_ERROR" | "NETWORK_ERROR" | "UNKNOWN_ERROR";

export class ApiError extends Error {
  status: number;
  errorType: ApiErrorType;
  details?: any;

  constructor(
    status: number,
    message: string,
    errorType: ApiErrorType = "UNKNOWN_ERROR",
    details?: any
  ) {
    super(message);
    this.status = status;
    this.errorType = errorType;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static async fromResponse(
    response: Response,
    errorType: ApiErrorType = "UNKNOWN_ERROR"
  ): Promise<ApiError> {
    try {
      const errorBody = await response.json();
      return new ApiError(response.status, errorBody?.message || "Unknown error", errorType, errorBody);
    } catch {
      return new ApiError(response.status, "Unknown error", errorType);
    }
  }
}