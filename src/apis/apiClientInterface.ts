import type { SSOUser, SSOSession } from '../types/sso'

export interface ApiClientInterface {
  getSSOUser(): Promise<SSOUser>
  loginWithSSO(flowId: string): Promise<SSOSession>
}