import {ProfileViewDetailed} from "@atproto/api/dist/client/types/app/bsky/actor/defs";

export interface TimedMuteVo{
  actor: string,
  muted_actor: string,
  created_date: number,
  expiration_date: number,
  profile: ProfileViewDetailed,
}