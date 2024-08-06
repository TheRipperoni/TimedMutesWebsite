import {useEffect} from "react";
import {MuteEntry} from "./components/MuteEntry.tsx";
import {BskyAgent} from "@atproto/api";
import SetMute from "./setmute.tsx";
import {ProfileViewDetailed} from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import {Box, Divider} from "@mui/material";
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
  // const navigate = useNavigate();
  useEffect(() => {
    if (agent === undefined) {
      return
    }
    const requestOptions = {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    };
    fetch(import.meta.env.VITE_API_HOST + '/timed-mutes', requestOptions)
      .then(response => {
        if (response.status == 200) {
          response.json().then(value => {
            if (value.length === 0) {
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
              }
            )
          })
        }
      });
  }, [agent, setData, setRefresh, refresh]);

  return (
    <Box display={'flex'} flexDirection={'row'}>
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
          <Box margin={1} key={item.actor}>
            <MuteEntry entry={item} key={item.actor + "1"} setRefresh={setRefresh}/>
          </Box>
        ))}
    </Box>
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
  // const navigate = useNavigate();
  useEffect(() => {
    if (agent === undefined) {
      return
    }
    const requestOptions = {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    };
    fetch(import.meta.env.VITE_API_HOST + '/timed-mute-words', requestOptions)
      .then(response => {
        if (response.status == 200) {
          response.json().then(value => {
            if (value.length === 0) {
              return
            }
            setData(value);
          })
        }
      });
  }, [agent, setData, setRefresh, refresh]);

  return (
    <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'}>
      {data.map(
        (
          item: {
            muted_word: string,
            created_date: number,
            expiration_date: number,
          }
        ) => (
          <Box margin={1} key={item.muted_word}>
            <MuteWordEntry entry={item} key={item.muted_word + "1"} setRefresh={setRefresh}/>
          </Box>
        ))}
    </Box>
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
  return <Box display={'flex'} margin={1}>
    {loggedIn
      ? (
        <Box>
          <Box display={'flex'}>
            <Box>
              {/*<Typography variant={"h4"} component={"h1"} color={"white"}>Mute User</Typography>*/}
              <SetMute setRefresh={setRefresh}/>
            </Box>
            <Box margin={2}>
              <MuteEntries agent={agent} data={data} setData={setData} refresh={refresh}
                           setRefresh={setRefresh}/>
            </Box>
          </Box>
          <Divider />
          <Box display={'flex'}>
            <SetWordMute setRefresh={setRefresh}/>
            <MuteWordEntries agent={agent} data={muteWords} setData={setMuteWords} refresh={refresh}
                         setRefresh={setRefresh}/>
          </Box>
        </Box>
      )
      : (<></>)}
  </Box>
}

export default Home