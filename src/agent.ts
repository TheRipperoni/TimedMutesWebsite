import {BskyAgent} from '@atproto/api'
import {BrowserOAuthClient} from '@atproto/oauth-client-browser'

export const oauthClient = new BrowserOAuthClient({
  clientMetadata: {
    client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
    client_name: 'Timed Mutes',
    client_uri: import.meta.env.VITE_API_HOST,
    redirect_uris: [import.meta.env.VITE_OAUTH_REDIRECT_URI],
    scope: import.meta.env.VITE_OAUTH_SCOPE,
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
    token_endpoint_auth_method: 'none',
    application_type: 'web',
    dpop_bound_access_tokens: true,
  },
  handleResolver: 'https://bsky.social', // Default handle resolver
})

export async function getAgentLogin(username: string, password: string): Promise<BskyAgent> {
  const agent = new BskyAgent({
    service: 'https://bsky.social',
  })

  await agent.login({
    identifier: username,
    password: password,
  })
  return agent
}

export async function resumeAgentSession(accessJwt: string, refreshJwt: string, active: boolean, did: string, handle: string): Promise<BskyAgent | null> {
  const agent = new BskyAgent({
    service: 'https://bsky.social',
  })
  const response = await agent.resumeSession({
    accessJwt: accessJwt,
    did: did,
    active: active,
    handle: handle,
    refreshJwt: refreshJwt
  })

  if (response.success) {
    return agent
  } else {
    return null
  }
}