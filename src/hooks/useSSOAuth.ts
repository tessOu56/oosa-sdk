import { useMutation, useQuery } from '@tanstack/react-query'
import type { AuthMethod, AuthenticateSSOParams, UiContainer } from '@oosa-types/sso'
import type { SSOApiInterface } from '@apis/apiInterfaces/ssoApiInterface'

export const createUseSSOHooks = (ssoApi: SSOApiInterface) => {
  const useLoginFlow = (flowId?: string) => {
    return useQuery({
      queryKey: ['login-flow', flowId],
      enabled: !!flowId,
      queryFn: () => ssoApi.getFlow(flowId!, 'login'),
      staleTime: 1000 * 60 * 5,
      retry: false,
    })
  }

  const useSSOAuthenticate = (method: AuthMethod) => {
    return useMutation<UiContainer | null, Error, AuthenticateSSOParams>({
      mutationFn: ({ flowId, provider, csrfToken }) =>
        ssoApi.authenticateOidc(flowId, method, provider, csrfToken),
    })
  }

  return { useLoginFlow, useSSOAuthenticate }
}