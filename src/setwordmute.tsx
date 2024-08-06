import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField
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
    <FormControl variant={'filled'} margin={'normal'} sx={{background: '#9e9e9e', p: 2, minWidth: 250}}>
      <TextField id="outlined-basic" label="Enter text to mute
        here" variant={"standard"} onChange={ev => setMuteWord(ev.target.value)}/>
      <FormLabel id="demo-radio-buttons-group-label">Duration</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="24 hours"
        name="radio-buttons-group"
      >
        <FormControlLabel onChange={() => {
          setExpireLength(ONE_DAY)
        }} value="24 hours" control={<Radio/>} label="24 hours"/>
        <FormControlLabel onChange={() => {
          setExpireLength(ONE_WEEK)
        }} value="7 days" control={<Radio/>} label="7 days"/>
        <FormControlLabel onChange={() => {
          setExpireLength(ONE_MONTH)
        }} value="30 days" control={<Radio/>} label="30 days"/>
        <Button type="submit" variant="contained"
                onClick={() => onButtonClick()}>
          Submit
        </Button>
      </RadioGroup>
    </FormControl>
  );
}

export default SetWordMute