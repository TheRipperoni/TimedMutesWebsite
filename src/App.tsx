import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './home';
import Login from './login';
import {useEffect, useState} from 'react';
import Sidebar from "./components/Sidebar.tsx";
import {BskyAgent} from "@atproto/api";
import {TimedMuteVo} from "./timedMuteVo.ts";
import {resumeAgentSession} from "./agent.ts";
import {TimedMuteWordVo} from "./timedMuteWordVo.ts";

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [, setEmail] = useState("")
  const [agent, setAgent] = useState<BskyAgent>()
  const [handleName, setHandlename] = useState("")
  const [pfpUrl, setPfpUrl] = useState("")
  const [refresh, setRefresh] = useState(0)
  const [data, setData] = useState<TimedMuteVo[]>([]);
  const [muteWords, setMuteWords] = useState<TimedMuteWordVo[]>([]);

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(import.meta.env.VITE_API_HOST + '/active', requestOptions)
      .then(response => {
        if (response.status == 200) {
          response.json().then((body) => {
              const access_jwt: string = body['access_jwt']
              const refresh_jwt: string = body['refresh_jwt']
              const did: string = body['did']
              const active: boolean = body['active']
              const handle: string = body['handle']
              resumeAgentSession(access_jwt, refresh_jwt, active, did, handle).then((agent_res) => {
                if (agent_res !== null) {
                  setLoggedIn(true);
                  setAgent(agent_res)
                  agent_res.getProfile({actor: did}).then((res) => {
                    if (res.success) {
                      setPfpUrl(res.data.avatar);
                    }
                  })
                }
              })
            }
          )
        }
      });
  }, [])

  const home_path = import.meta.env.VITE_BASE_PATH
  const login_path = import.meta.env.VITE_BASE_PATH + "/login"

  return (
    <BrowserRouter>
      <Sidebar loggedIn={loggedIn} setLoggedIn={setLoggedIn} handleName={handleName}
               pfpUrl={pfpUrl} setPfpUrl={setPfpUrl} setHandlename={setHandlename}/>
      <Routes>
        <Route path={home_path}
               element={<Home loggedIn={loggedIn} agent={agent} muteWords={muteWords}
                              setMuteWords={setMuteWords} data={data} setData={setData}
                              refresh={refresh} setRefresh={setRefresh}/>}/>
        <Route path={login_path}
               element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} setAgent={setAgent}
                               setHandlename={setHandlename} setPfpUrl={setPfpUrl}/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
