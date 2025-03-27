export const mockSSOUser = {
  id: 'mock-user-id',
  email: 'mock@oosa.dev',
  name: 'Mock SSO User',
  avatarUrl: 'https://source.unsplash.com/100x100/?face',
}

export const mockSSOSession = {
  sessionId: 'mock-session-id',
  token: 'mock-token-123456',
  expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
}