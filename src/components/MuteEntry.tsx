import {ProfileViewDetailed} from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import {Avatar, Box, Button, Card, CardContent, Typography} from "@mui/material";

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
    <Card sx={{minWidth: 240, height: '100%', display: 'flex', flexDirection: 'column'}}>
      <CardContent sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 1
      }}>
        <Avatar src={entry.profile.avatar} sx={{width: 56, height: 56, mb: 1}}/>
        <Typography variant="subtitle1" sx={{fontWeight: 600, lineHeight: 1.2}}>
          {entry.profile.displayName || entry.profile.handle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
          @{entry.profile.handle}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Expires: {t.toLocaleString()}
        </Typography>
        <Box sx={{mt: 'auto', pt: 2, width: '100%'}}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            size="small"
            onClick={() => callUnMute(entry.muted_actor, entry.expiration_date, setRefresh)}
          >
            Unmute
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
