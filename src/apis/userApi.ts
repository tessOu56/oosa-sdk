import { sharedApiClient } from "./core/_shared";

export const userApi = {
  getUser: (id: string) =>
    sharedApiClient.request(`/users/${id}`, { method: "GET" }),

  getUsers: () =>
    sharedApiClient.request("/users", { method: "GET" }),

  createUser: (data: Record<string, any>) =>
    sharedApiClient.request("/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }),

  updateUser: (id: string, data: Record<string, any>) =>
    sharedApiClient.request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }),

  deleteUser: (id: string) =>
    sharedApiClient.request(`/users/${id}`, { method: "DELETE" }),
};