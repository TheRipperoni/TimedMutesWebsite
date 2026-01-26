import {Box, Button, Card, CardContent, Typography} from "@mui/material";

function callUnMute(word: string, setRefresh: (v: number) => void) {
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({muted_word: word})
  };
  fetch(import.meta.env.VITE_API_HOST + '/deleteTimedMuteWord', requestOptions)
    .then(response => {
      if (response.status == 200) {
        setRefresh(Math.random())
      }
      return response
    });
}

export const MuteWordEntry = (
  {
    entry,
    setRefresh
  }: {
    entry: {
      muted_word: string,
      created_date: number,
      expiration_date: number,
    },
    setRefresh: (v: number) => void
  }) => {
  const t = new Date(0);
  t.setUTCSeconds(entry.expiration_date);
  return (
    <Card sx={{minWidth: 200, height: '100%', display: 'flex', flexDirection: 'column'}}>
      <CardContent sx={{flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1}}>
        <Typography variant="h6" sx={{wordBreak: 'break-all'}}>
          {entry.muted_word}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Expires: {t.toLocaleString()}
        </Typography>
        <Box sx={{mt: 'auto', pt: 2}}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            size="small"
            onClick={() => callUnMute(entry.muted_word, setRefresh)}
          >
            Unmute
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
