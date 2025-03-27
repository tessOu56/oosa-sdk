export interface ApiResponse<T> {
  data: T | null;
  error?: string;
}
  
export interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
  body?: string | FormData;
  params?: Record<string, string | number>;
}
  
export type ClientType = "fetch" | "axios";
