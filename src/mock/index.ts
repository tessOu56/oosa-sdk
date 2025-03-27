// mock/index.ts
import { setupWorker } from 'msw/browser'
import { ssoHandlers } from './handlers/sso.handler'

const worker = setupWorker(...ssoHandlers)

/**
 * 啟動 Mock Server
 * 僅應在開發環境或 Storybook / local 使用
 */
export const startMockServer = () => {
  if (typeof window === 'undefined') return
  worker.start({
    onUnhandledRequest: 'warn',
  })
}
