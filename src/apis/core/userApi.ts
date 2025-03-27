import type { ApiClient } from '@apis/apiClient'
import type { UserApiInterface } from '@apis/apiInterfaces/userApiInterface'
import type { User } from '@oosa-types/user'

export const createUserApi = (apiClient: ApiClient): UserApiInterface => ({
  getSelf: async () => {
    const res = await apiClient.request<User>('/users/me', { method: 'GET' })
    return res.data
  },

  updateSelf: async (data) => {
    const res = await apiClient.request<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    return res.data
  }
})