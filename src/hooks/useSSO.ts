import { useQuery, useMutation } from "@tanstack/react-query";
import { ssoApi } from "../apis/ssoApi";
import { ApiError } from "../libs/apiError";
import { useNavigate } from "react-router-dom";

export function useSSOLoginFlow(flowId: string | null) {
  const navigate = useNavigate();

  return useQuery({
    queryKey: ["ssoLoginFlow", flowId],
    queryFn: async () => {
      if (!flowId) throw new ApiError(400, "Missing flow ID", "SSO_ERROR");
      try {
        const res = await ssoApi.getFlow(flowId, "login");
        return res.data;
      } catch (err) {
        if (err instanceof ApiError && err.errorType === "SSO_ERROR") {
          navigate("/error", { state: { id: flowId } });
        }
        throw err;
      }
    },
    enabled: !!flowId,
  });
}

export function useSSOAuthenticate(method: "login" | "registration") {
  return useMutation(
    ({
      flowId,
      provider,
      csrfToken,
    }: {
      flowId: string;
      provider: "line" | "google" | "apple";
      csrfToken: string;
    }) => ssoApi.authenticateOidc(flowId, provider, method, csrfToken)
  );
}