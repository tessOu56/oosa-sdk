import { useMutation, useQuery, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import type { AuthMethod, AuthenticateSSOParams, UiContainer } from '@oosa-types/sso'
import type { LoginFlow } from '../apis/generated'
import type { SSOApiInterface } from '@apis/apiInterfaces/ssoApiInterface'

export type SSOError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type SSOFlowOptions = {
  staleTime?: number;
  retry?: boolean | number;
  retryDelay?: number;
  refetchOnWindowFocus?: boolean;
}

export type SSOAuthOptions = {
  onSuccess?: (data: UiContainer | null) => void;
  onError?: (error: SSOError) => void;
  onSettled?: () => void;
}

export interface SSOHooks {
  useLoginFlow: (
    flowId?: string,
    options?: Omit<UseQueryOptions<LoginFlow | null, SSOError>, 'queryKey' | 'queryFn'> & SSOFlowOptions
  ) => ReturnType<typeof useQuery<LoginFlow | null, SSOError>>
  
  useSSOAuthenticate: (
    method: AuthMethod,
    options?: UseMutationOptions<UiContainer | null, SSOError, AuthenticateSSOParams> & SSOAuthOptions
  ) => ReturnType<typeof useMutation<UiContainer | null, SSOError, AuthenticateSSOParams>>
}

export const createUseSSOHooks = (ssoApi: SSOApiInterface): SSOHooks => {
  const useLoginFlow = (
    flowId?: string,
    options?: Omit<UseQueryOptions<LoginFlow | null, SSOError>, 'queryKey' | 'queryFn'> & SSOFlowOptions
  ) => {
    return useQuery<LoginFlow | null, SSOError>({
      queryKey: ['login-flow', flowId],
      enabled: !!flowId,
      queryFn: () => ssoApi.getFlow(flowId!, 'login'),
      staleTime: options?.staleTime ?? 1000 * 60 * 5, // 5 minutes
      retry: options?.retry ?? false,
      retryDelay: options?.retryDelay,
      refetchOnWindowFocus: options?.refetchOnWindowFocus,
      ...options,
    })
  }

  const useSSOAuthenticate = (
    method: AuthMethod,
    options?: UseMutationOptions<UiContainer | null, SSOError, AuthenticateSSOParams> & SSOAuthOptions
  ) => {
    return useMutation<UiContainer | null, SSOError, AuthenticateSSOParams>({
      mutationFn: ({ flowId, provider, csrfToken }) =>
        ssoApi.authenticateOidc(flowId, method, provider, csrfToken),
      onSuccess: options?.onSuccess,
      onError: options?.onError,
      onSettled: options?.onSettled,
      ...options,
    })
  }

  return { useLoginFlow, useSSOAuthenticate }
}