import type {
    AuthMethod,
    AuthenticateSSOParams,
    UiContainer,
    SelfServiceLoginFlow
  } from '@oosa-types/sso'
  
  export interface SSOApiInterface {
    getFlow(flowId: string, method: AuthMethod): Promise<SelfServiceLoginFlow | null>
    authenticateOidc(
      flowId: string,
      method: AuthMethod,
      provider: AuthenticateSSOParams['provider'],
      csrfToken: string
    ): Promise<UiContainer | null>
  }