// @client/apis/eventApi.ts
import type { ApiClient } from '@apis/apiClient'
import type { EventApiInterface } from '@apis/apiInterfaces/eventApiInterface'
import type { Event, EventListResponse } from '@oosa-types/event'

export const createEventApi = (apiClient: ApiClient): EventApiInterface => ({
  listEvents: async (filters) => {
    const res = await apiClient.request<EventListResponse>('/events', {
      method: 'GET',
      params: filters
    })
    return res.data
  },

  getEventById: async (id) => {
    const res = await apiClient.request<Event>(`/events/${id}`, {
      method: 'GET'
    })
    return res.data
  }
})