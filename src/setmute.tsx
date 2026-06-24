import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Snackbar,
  TextField, Typography
} from "@mui/material";
import {useState} from "react";

const SetMute = ({setRefresh}: { setRefresh: (v: number) => void }) => {
  const ONE_DAY = 86400
  const ONE_WEEK = 604800
  const ONE_MONTH = 2629743
  const [mutedActor, setMutedActor] = useState("")
  const [expireLength, setExpireLength] = useState(ONE_DAY)
  const [loading, setLoading] = useState(false)
  const [handleError, setHandleError] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  const onButtonClick = () => {
    // Validate handle before submitting
    const trimmed = mutedActor.trim();
    if (!trimmed) {
      setHandleError("Please enter a handle");
      return;
    }
    if (!trimmed.includes('.') || trimmed.startsWith('@')) {
      setHandleError("Enter a valid handle (e.g. handle.bsky.social)");
      return;
    }
    setHandleError("")
    setLoading(true)

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        muted_actor_handle: trimmed,
        expiration_length: expireLength,
      })
    };
    fetch(import.meta.env.VITE_API_HOST + '/timed-mute', requestOptions)
      .then(response => {
        if (response.status == 200) {
          setRefresh(Math.random())
          setMutedActor("")
          setLoading(false)
          const durationLabel = expireLength === ONE_DAY ? "24 hours" : expireLength === ONE_WEEK ? "7 days" : "30 days"
          setSnackbarMessage(`User muted for ${durationLabel}`)
          setSnackbarOpen(true)
          return response
        } else {
          response.json().then((data) => {
            alert(data['error'])
            setLoading(false)
          }).catch(() => {
            alert('Unexpected error submitting')
            setLoading(false)
          })
        }
      }).catch((err) => {
        console.error('Failed to submit mute:', err);
        alert('Network error submitting mute');
        setLoading(false)
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
        Mute User
      </Typography>
      <FormControl fullWidth variant="outlined" sx={{gap: 3}}>
        <TextField
          fullWidth
          label="User's handle"
          placeholder="e.g. handle.bsky.social"
          variant="outlined"
          value={mutedActor}
          error={!!handleError}
          helperText={handleError}
          onChange={ev => {
            setMutedActor(ev.target.value);
            if (handleError) setHandleError("");
          }}
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
          disabled={loading}
          onClick={() => onButtonClick()}
        >
          {loading ? <CircularProgress size={24} color="inherit"/> : "Mute User"}
        </Button>
      </FormControl>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SetMute