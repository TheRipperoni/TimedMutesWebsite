import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Typography
} from "@mui/material";
import {useState} from "react";

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
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const t = new Date(0);
  t.setUTCSeconds(entry.expiration_date);

  const handleUnmute = () => {
    setDialogOpen(true);
  };

  const confirmUnmute = () => {
    setDialogOpen(false);
    setLoading(true);
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({muted_word: entry.muted_word})
    };
    fetch(import.meta.env.VITE_API_HOST + '/deleteTimedMuteWord', requestOptions)
      .then(response => {
        if (response.status == 200) {
          setRefresh(Math.random())
          setLoading(false)
          setSnackbarOpen(true)
        } else {
          console.warn('Failed to unmute word: status ' + response.status);
          setLoading(false)
        }
      }).catch((err) => {
        console.error('Failed to unmute word:', err);
        setLoading(false)
      });
  };

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
            disabled={loading}
            onClick={handleUnmute}
          >
            {loading ? <CircularProgress size={20} color="inherit"/> : "Unmute"}
          </Button>
        </Box>
      </CardContent>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>Confirm Unmute</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to unmute the word "{entry.muted_word}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmUnmute} color="error" variant="contained">Unmute</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)} variant="filled">
          Word unmuted
        </Alert>
      </Snackbar>
    </Card>
  )
}
