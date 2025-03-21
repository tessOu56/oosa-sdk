import { sharedApiClient } from "./core/_shared";

export const ideaApi = {
  getIdea: (id: string) =>
    sharedApiClient.request(`/ideas/${id}`, { method: "GET" }),

  getIdeas: () =>
    sharedApiClient.request("/ideas", { method: "GET" }),

  createIdea: (data: Record<string, any>) =>
    sharedApiClient.request("/ideas", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }),

  updateIdea: (id: string, data: Record<string, any>) =>
    sharedApiClient.request(`/ideas/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }),

  deleteIdea: (id: string) =>
    sharedApiClient.request(`/ideas/${id}`, { method: "DELETE" }),
};