import { sharedApiClient } from "./core/_shared";

export const eventApi = {
  getEvent: (id: string) =>
    sharedApiClient.request(`/events/${id}`, { method: "GET" }),

  getEvents: () =>
    sharedApiClient.request("/events", { method: "GET" }),

  createEvent: (data: Record<string, any>) =>
    sharedApiClient.request("/events", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }),

  updateEvent: (id: string, data: Record<string, any>) =>
    sharedApiClient.request(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }),

  deleteEvent: (id: string) =>
    sharedApiClient.request(`/events/${id}`, { method: "DELETE" }),
};