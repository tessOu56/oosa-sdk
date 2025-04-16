import { ApiClient } from './apiClient'
import { createSSOApi } from './core/ssoApi'

export const createOosaSDK = (options?: { baseUrl?: string; clientType?: 'fetch' | 'axios' }) => {
  const apiClient = new ApiClient(
    options?.baseUrl ?? import.meta.env.VITE_API_URL,
    options?.clientType ?? 'fetch'
  )

  return {
    sso: createSSOApi(apiClient),
    rawClient: apiClient.getInstance(), // 若要用 openapi 的 DefaultApi 方法
    request: apiClient.request.bind(apiClient) // 可用於自訂需求
  }
}