import type { SSOApiInterface } from '@apis/apiInterfaces/ssoApiInterface'
import type { UiContainer, SelfServiceLoginFlow } from '@oosa-types/sso'
import type { ApiClient } from '../apiClient'

export const createSSOApi = (apiClient: ApiClient): SSOApiInterface => ({
  getFlow: async (flowId, method) => {
    const res = await apiClient.request<SelfServiceLoginFlow>(`/self-service/${method}/flows`, {
      method: 'GET',
      params: { id: flowId }
    })
    return res.data
  },

  authenticateOidc: async (flowId, method, provider, csrfToken) => {
    const res = await apiClient.request<UiContainer>(`/self-service/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      params: { flow: flowId },
      body: JSON.stringify({
        methods: 'oidc',
        csrf_token: csrfToken,
        provider
      })
    })
    return res.data
  }
})