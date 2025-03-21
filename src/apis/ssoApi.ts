import { DefaultApi } from "../generated";

const apiClient = new DefaultApi();

export const ssoApi = {
  /**
   * 取得登入流程
   * @param flowId 登入流程 ID
   */
  getLoginFlow: async (flowId: string) => {
    try {
      const res = await apiClient.getSelfServiceLoginFlow({ id: flowId });
      if (res && res.status === 200) {
        const { return_to, ui } = res.data;
        if (return_to) {
          await stores.setReturnUrl(return_to);
        }
        ui.nodes.forEach((input) => {
          if (input.attributes.name === "csrf_token") {
            stores.setToken(input.attributes?.value || "");
          }
        });
        return res.data;
      }
    } catch (error) {
      console.error("Failed to fetch login flow:", error);
      throw error;
    }
  },

  /**
   * OIDC 登入
   * @param provider OIDC Provider（如 Line, Google, Apple）
   * @param flowId 流程 ID
   * @param method 登入方式（login or registration）
   */
  authenticateOidc: async (provider: "line" | "google" | "apple", flowId: string, method: "login" | "registration") => {
    try {
      const response = await apiClient.submitSelfServiceLoginFlow({
        id: flowId,
        loginFlowBody: {
          methods: "oidc",
          csrf_token: stores.token,
          provider,
        },
      });
      return response.data;
    } catch (error) {
      console.error("OIDC Authentication failed:", error);
      throw error;
    }
  },
};
////--------------------------------------------------------------------------------------------------------------------------
import { ApiClient } from "../libs/apiClient";

const apiClient = new ApiClient("https://api.oosa.com", "axios"); // 預設使用 axios

export const ssoApi = {
  /** 取得登入或註冊流程 */
  getFlow: (flowId: string, method: "login" | "registration") =>
    apiClient.request(`/self-service/${method}/flows?id=${flowId}`, { method: "GET" }),

  /** 透過 OIDC 進行 SSO 登入或註冊 */
  authenticateOidc: (
    flowId: string,
    provider: "line" | "google" | "apple",
    method: "login" | "registration",
    csrfToken: string
  ) =>
    apiClient.request(`/self-service/${method}`, {
      method: "POST",
      body: JSON.stringify({
        methods: "oidc",
        csrf_token: csrfToken,
        provider,
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      params: { flow: flowId }, // ✅ 不會報錯，axios 與 fetch 都支援
    }),

  /** 確保回應包含重導向 URL */
  handleRedirect: (url: string) => {
    if (url) {
      window.location.href = url;
    } else {
      throw new Error(`Redirect URL is missing in headers`);
    }
  },
};