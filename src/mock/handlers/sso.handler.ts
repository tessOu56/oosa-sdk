import { rest } from 'msw/http'
import type { RestRequest, ResponseComposition, RestContext } from 'msw'
import { mockSSOUser, mockSSOSession } from '../data/sso.mock'

export const ssoHandlers = [
  rest.get('/self-service/whoami', (
    req: RestRequest,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    return res(ctx.status(200), ctx.json(mockSSOUser))
  }),

  rest.get('/self-service/login/flows', (
    req: RestRequest,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    const flowId = req.url.searchParams.get('id')
    if (flowId === 'invalid') {
      return res(ctx.status(400), ctx.json({ error: 'Invalid flow ID' }))
    }

    return res(ctx.status(200), ctx.json(mockSSOSession))
  }),
]