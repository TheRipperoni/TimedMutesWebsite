import {Box, Button, Typography} from "@mui/material";

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
    <Box p={1} m={1} bgcolor={'#9e9e9e'}>
      <Typography>{entry.muted_word}</Typography>
      <Button
        variant={'contained'}
        onClick={() => callUnMute(entry.muted_word, setRefresh)}
      >Unmute</Button>
      <Typography>Expires at: {t.toLocaleString()}</Typography>
    </Box>
  )
}
