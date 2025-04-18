import type { Identity, Session } from '../types/sso'

export interface ApiClientInterface {
  getSSOUser(): Promise<Identity>
  loginWithSSO(flowId: string): Promise<Session>
}