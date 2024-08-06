import {BskyAgent} from '@atproto/api'

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