import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './home';
import Login from './login';
import {useEffect, useState} from 'react';
import Sidebar from "./components/Sidebar.tsx";
import {BskyAgent} from "@atproto/api";
import {TimedMuteVo} from "./timedMuteVo.ts";
import {resumeAgentSession, oauthClient} from "./agent.ts";
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
    // Initial OAuth setup
    oauthClient.init().then(async (res) => {
      if (res?.session) {
        const oauthSession = res.session;
        // getTokenSet() is protected in TypeScript but the JS runtime allows it
        const tokenSet = await (oauthSession as any).getTokenSet();

        // Use the PDS URL (aud) as the service for the agent
        const agent = new BskyAgent({service: tokenSet.aud || 'https://bsky.social'});

        // Set the OAuth tokens as the agent session data
        agent.session = {
          accessJwt: tokenSet.access_token,
          refreshJwt: tokenSet.refresh_token || '',
          handle: oauthSession.sub,
          did: oauthSession.sub,
          active: true,
        };

        setAgent(agent);

        // Fetch the profile to get the user's handle, then create a backend session
        try {
          const profile = await agent.getProfile({actor: oauthSession.sub});
          if (profile.success) {
            const handle = profile.data.handle;
            setHandlename(handle);
            setPfpUrl(profile.data.avatar || "");

            // Create a backend session so subsequent API calls are authenticated
            await fetch(import.meta.env.VITE_API_HOST + '/session', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({did: oauthSession.sub, handle}),
            });
          }
        } catch (err) {
          console.error('Failed to setup session after OAuth init:', err);
        }

        setLoggedIn(true);

        // If we just finished a login, we might want to clear the URL parameters
        if (res.state) {
           window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }).catch(console.error);

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
            
            // For now, we keep auto-resume if a session is active in cookies/backend
            // This ensures returning users don't have to click "Login" every time if they haven't logged out.
            resumeAgentSession(access_jwt, refresh_jwt, active, did, handle).then((agent_res) => {
              if (agent_res !== null) {
                setLoggedIn(true);
                setAgent(agent_res)
                agent_res.getProfile({actor: did}).then((res) => {
                  if (res.success) {
                    setPfpUrl(res.data.avatar || "");
                  }
                }).catch((err) => {
                  console.error('Failed to fetch profile after session resume:', err);
                });
              }
            })
          }
          )
        } else {
          console.warn('Session check returned status ' + response.status + ' — user is not logged in on the backend.');
        }
      }).catch((err) => {
        console.error('Failed to check active session:', err);
      });
  }, [])

  const home_path = import.meta.env.VITE_BASE_PATH
  const login_path = import.meta.env.VITE_BASE_PATH + "/login"
  const oauth_callback_path = import.meta.env.VITE_BASE_PATH + "/oauth/callback"

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
        <Route path={oauth_callback_path}
               element={<Home loggedIn={loggedIn} agent={agent} muteWords={muteWords}
                              setMuteWords={setMuteWords} data={data} setData={setData}
                              refresh={refresh} setRefresh={setRefresh}/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
