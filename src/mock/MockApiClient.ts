import type { ApiClientInterface } from '../apis/apiClientInterface'
import type { SSOUser, SSOSession } from '../types/sso'
import { mockSSOUser, mockSSOSession } from './data/sso.mock'

export class MockApiClient implements ApiClientInterface {
  getSSOUser(): Promise<SSOUser> {
    return Promise.resolve(mockSSOUser)
  }

  loginWithSSO(flowId: string): Promise<SSOSession> {
    if (flowId === 'invalid') {
      return Promise.reject(new Error('Invalid flow ID'))
    }
    return Promise.resolve(mockSSOSession)
  }
}