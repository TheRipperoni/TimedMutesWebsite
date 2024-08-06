import {ProfileViewDetailed} from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import {Avatar, Box, Button, Typography} from "@mui/material";

function callUnMute(actor: string, expiration_time: number, setRefresh: (v: number) => void) {
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({muted_actor_did: actor, expiration_date: expiration_time})
  };
  fetch(import.meta.env.VITE_API_HOST + '/deleteTimedMute', requestOptions)
    .then(response => {
      if (response.status == 200) {
        setRefresh(Math.random())
      }
      return response
    });
}

export const MuteEntry = (
  {
    entry,
    setRefresh
  }: {
    entry: {
      actor: string,
      muted_actor: string,
      created_date: number,
      expiration_date: number,
      profile: ProfileViewDetailed,
    },
    setRefresh: (v: number) => void
  }) => {
  const t = new Date(0);
  t.setUTCSeconds(entry.expiration_date);
  return (
    <Box p={1} m={1} bgcolor={'#9e9e9e'}>
      <Avatar src={entry.profile.avatar}/>
      <Typography>{entry.profile.handle}</Typography>
      <Button
        variant={'contained'}
        onClick={() => callUnMute(entry.muted_actor, entry.expiration_date, setRefresh)}
      >Unmute</Button>
      <Typography>Expires at: {t.toLocaleString()}</Typography>
    </Box>
  )
}
