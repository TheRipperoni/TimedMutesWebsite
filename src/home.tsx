import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {MuteEntry} from "./components/MuteEntry.tsx";
import {BskyAgent} from "@atproto/api";
import SetMute from "./setmute.tsx";
import {ProfileViewDetailed} from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import {Box, Button, CircularProgress, Container, Divider, Grid, Typography} from "@mui/material";
import {TimedMuteVo} from "./timedMuteVo.ts";
import SetWordMute from "./setwordmute.tsx";
import {MuteWordEntry} from "./components/MuteWordEntry.tsx";
import {TimedMuteWordVo} from "./timedMuteWordVo.ts";

const MuteEntries = ({
  agent,
  data,
  setData,
  refresh,
  setRefresh
}: {
  agent: BskyAgent | undefined
  data: TimedMuteVo[]
  setData: (v: TimedMuteVo[]) => void
  refresh: number
  setRefresh: (v: number) => void
}) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (agent === undefined) {
      return
    }
    setLoading(true);
    const requestOptions = {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    };
    fetch(import.meta.env.VITE_API_HOST + '/timed-mutes', requestOptions)
      .then(response => {
        if (response.status == 200) {
          response.json().then(value => {
            if (value.length === 0) {
              setData([])
              setLoading(false);
              return
            }
            const did_list = new Set<string>();
            for (const val of value) {
              did_list.add(val['muted_actor'])
            }
            agent.getProfiles({actors: Array.from(did_list)}).then(
              (res) => {
                const profileMap = new Map()
                res.data.profiles.map((obj) => {
                  profileMap.set(obj.did, obj)
                })
                const mutes = value
                for (const mute of mutes) {
                  mute['profile'] = profileMap.get(mute['muted_actor'])
                }
                setData(mutes)
                setLoading(false);
              }
            )
          })
        } else {
          console.warn('Failed to fetch timed mutes: status ' + response.status);
          setLoading(false);
        }
      }).catch((err) => {
        console.error('Failed to fetch timed mutes:', err);
        setLoading(false);
      });
  }, [agent, setData, setRefresh, refresh]);

  if (loading) {
    return (
      <Box sx={{py: 4, textAlign: 'center'}}>
        <CircularProgress size={32}/>
      </Box>
    )
  }

  if (data.length === 0) {
    return (
      <Box sx={{
        py: 4,
        textAlign: 'center',
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px dashed',
        borderColor: 'divider'
      }}>
        <Typography color="text.secondary">No active user mutes</Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={2}>
      {data.map(
        (
          item: {
            actor: string,
            muted_actor: string,
            created_date: number,
            expiration_date: number,
            profile: ProfileViewDetailed,
          }
        ) => (
          <Grid item xs={12} sm={6} md={4} key={item.muted_actor + item.expiration_date}>
            <MuteEntry entry={item} setRefresh={setRefresh}/>
          </Grid>
        ))}
    </Grid>
  )
}

const MuteWordEntries = ({
  agent,
  data,
  setData,
  refresh,
  setRefresh
}: {
  agent: BskyAgent | undefined
  data: TimedMuteWordVo[]
  setData: (v: TimedMuteWordVo[]) => void
  refresh: number
  setRefresh: (v: number) => void
}) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (agent === undefined) {
      return
    }
    setLoading(true);
    const requestOptions = {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    };
    fetch(import.meta.env.VITE_API_HOST + '/timed-mute-words', requestOptions)
      .then(response => {
        if (response.status == 200) {
          response.json().then(value => {
            setData(value);
            setLoading(false);
          })
        } else {
          console.warn('Failed to fetch timed mute words: status ' + response.status);
          setLoading(false);
        }
      }).catch((err) => {
        console.error('Failed to fetch timed mute words:', err);
        setLoading(false);
      });
  }, [agent, setData, setRefresh, refresh]);

  if (loading) {
    return (
      <Box sx={{py: 4, textAlign: 'center'}}>
        <CircularProgress size={32}/>
      </Box>
    )
  }

  if (data.length === 0) {
    return (
      <Box sx={{
        py: 4,
        textAlign: 'center',
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px dashed',
        borderColor: 'divider'
      }}>
        <Typography color="text.secondary">No active word mutes</Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={2}>
      {data.map(
        (
          item: {
            muted_word: string,
            created_date: number,
            expiration_date: number,
          }
        ) => (
          <Grid item xs={12} sm={4} md={3} key={item.muted_word}>
            <MuteWordEntry entry={item} setRefresh={setRefresh}/>
          </Grid>
        ))}
    </Grid>
  )
}

const Home = ({
  agent,
  loggedIn,
  data,
  setData,
  refresh,
  setRefresh,
  muteWords,
  setMuteWords,
}: {
  agent: BskyAgent | undefined
  loggedIn: boolean
  data: TimedMuteVo[]
  setData: (v: TimedMuteVo[]) => void
  refresh: number
  setRefresh: (v: number) => void
  muteWords: TimedMuteWordVo[]
  setMuteWords: (v: TimedMuteWordVo[]) => void
}) => {
  const navigate = useNavigate();

  if (!loggedIn) {
    return (
      <Container maxWidth="md" sx={{py: 10, textAlign: 'center'}}>
        <Typography variant="h3" gutterBottom sx={{fontWeight: 800}}>
          Timed Mutes for Bluesky
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{mb: 4}}>
          Take a break from certain users or topics. Set a timer and we'll handle the unmuting for
          you.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(import.meta.env.VITE_BASE_PATH + "/login")}
          sx={{px: 4, py: 1.5, fontSize: '1.1rem', fontWeight: 600}}
        >
          Get Started
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{py: 4}}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            position: {md: 'sticky'},
            top: 84
          }}>
            <SetMute setRefresh={setRefresh}/>
            <SetWordMute setRefresh={setRefresh}/>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{mb: 6}}>
            <Typography variant="h5" sx={{mb: 3, fontWeight: 700}}>Active User Mutes</Typography>
            <MuteEntries agent={agent} data={data} setData={setData} refresh={refresh}
                         setRefresh={setRefresh}/>
          </Box>

          <Divider sx={{mb: 6}}/>

          <Box>
            <Typography variant="h5" sx={{mb: 3, fontWeight: 700}}>Active Word Mutes</Typography>
            <MuteWordEntries agent={agent} data={muteWords} setData={setMuteWords} refresh={refresh}
                             setRefresh={setRefresh}/>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Home