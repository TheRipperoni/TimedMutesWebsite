import {ProfileViewDetailed} from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import {
  Alert,
  Avatar,
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
      body: JSON.stringify({muted_actor_did: entry.muted_actor, expiration_date: entry.expiration_date})
    };
    fetch(import.meta.env.VITE_API_HOST + '/deleteTimedMute', requestOptions)
      .then(response => {
        if (response.status == 200) {
          setRefresh(Math.random())
          setLoading(false)
          setSnackbarOpen(true)
        } else {
          console.warn('Failed to unmute: status ' + response.status);
          setLoading(false)
        }
      }).catch((err) => {
        console.error('Failed to unmute:', err);
        setLoading(false)
      });
  };

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
            Are you sure you want to unmute {entry.profile.displayName || entry.profile.handle}?
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
          User unmuted
        </Alert>
      </Snackbar>
    </Card>
  )
}
