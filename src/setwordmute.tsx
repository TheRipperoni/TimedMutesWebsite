import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField, Typography
} from "@mui/material";
import {useState} from "react";


const SetWordMute = ({setRefresh}: { setRefresh: (v: number) => void }) => {
  const ONE_DAY = 86400
  const ONE_WEEK = 604800
  const ONE_MONTH = 2629743
  const [muteWord, setMuteWord] = useState("")
  const [expireLength, setExpireLength] = useState(ONE_DAY)

  const onButtonClick = () => {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        muted_word: muteWord,
        expiration_length: expireLength,
      })
    };
    fetch(import.meta.env.VITE_API_HOST + '/timed-mute-word', requestOptions)
      .then(response => {
        if (response.status == 200) {
          setRefresh(Math.random())
          return response
        } else {
          response.json().then((data) => {
            alert(data['error'])
          }).catch(() => {
            alert('Unexpected error submitting')
          })
        }
      });
  }

  return (
    <Box sx={{
      p: 3,
      bgcolor: 'background.paper',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider',
      width: '100%',
      maxWidth: 400
    }}>
      <Typography variant="h6" gutterBottom sx={{fontWeight: 600}}>
        Mute Words
      </Typography>
      <FormControl fullWidth variant="outlined" sx={{gap: 3}}>
        <TextField
          fullWidth
          label="Text to mute"
          placeholder="e.g. spoiler"
          variant="outlined"
          onChange={ev => setMuteWord(ev.target.value)}
        />

        <Box>
          <FormLabel sx={{
            mb: 1,
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>Duration</FormLabel>
          <RadioGroup
            row
            defaultValue="24 hours"
            name="radio-buttons-group"
          >
            <FormControlLabel
              value="24 hours"
              control={<Radio size="small"/>}
              label={<Typography variant="body2">24h</Typography>}
              onChange={() => setExpireLength(ONE_DAY)}
            />
            <FormControlLabel
              value="7 days"
              control={<Radio size="small"/>}
              label={<Typography variant="body2">7d</Typography>}
              onChange={() => setExpireLength(ONE_WEEK)}
            />
            <FormControlLabel
              value="30 days"
              control={<Radio size="small"/>}
              label={<Typography variant="body2">30d</Typography>}
              onChange={() => setExpireLength(ONE_MONTH)}
            />
          </RadioGroup>
        </Box>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          onClick={() => onButtonClick()}
        >
          Mute Word
        </Button>
      </FormControl>
    </Box>
  );
}

export default SetWordMute