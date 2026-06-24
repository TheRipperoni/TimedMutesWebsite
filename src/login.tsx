import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {BskyAgent} from "@atproto/api";
import {getAgentLogin, oauthClient} from "./agent.ts";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
  Link,
  Divider
} from "@mui/material";
import {SiBluesky} from "react-icons/si";

function Login({
  setLoggedIn,
  setEmail,
  setAgent,
  setHandlename,
  setPfpUrl
}: {
  setLoggedIn: (v: boolean) => void
  setEmail: (v: string) => void
  setAgent: (agent: BskyAgent) => void
  setHandlename: (v: string) => void
  setPfpUrl: (v: string) => void
}) {
  const [email, setEmail2] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [oauthLoading, setOauthLoading] = useState(false)
  const [appPasswordLoading, setAppPasswordLoading] = useState(false)

  const navigate = useNavigate();

  const onButtonClick = () => {

    // Set initial error values to empty
    setEmailError("")
    setPasswordError("")

    // Check if the user has entered both fields correctly
    if ("" === email) {
      setEmailError("Please enter your handle")
      return
    }


    if ("" === password) {
      setPasswordError("Please enter your app password")
      return
    }

    setAppPasswordLoading(true)
    logIn()
  }

  // Log in a user using email and password
  function logIn() {
    const headers = {
      'Content-Type': 'application/json'
    };

    getAgentLogin(email, password).then((res) => {
        const accessJwt = res.session?.accessJwt;
        if (accessJwt === undefined) {
          alert("Invalid login");
          setAppPasswordLoading(false);
        } else {
          const tokens = accessJwt.split(".");
          const data = JSON.parse(atob(tokens[1]))
          if (data['scope'] !== 'com.atproto.access') {
            setAgent(res);
            axios.post(import.meta.env.VITE_API_HOST + '/login', {
              username: email, password: password
            }, {headers: headers})
              .then(function (response) {
                if (response.status == 200) {
                  res.getProfile({actor: res.session!.did}).then((profile) => {
                    if (profile.data.avatar != null) {
                      setPfpUrl(profile.data.avatar)
                    }
                    setHandlename(profile.data.handle)
                    setLoggedIn(true)
                    setEmail(email)
                    setAppPasswordLoading(false)
                    navigate(import.meta.env.VITE_BASE_PATH)
                  }).catch(() => {
                    setAppPasswordLoading(false)
                  })
                } else {
                  alert("Invalid login")
                  setAppPasswordLoading(false)
                }
              })
              .catch(function (error) {
                alert("Invalid login: " + error.toString())
                setAppPasswordLoading(false)
              });
          } else {
            alert("Invalid login, please try again with an App Password");
            setAppPasswordLoading(false);
          }
        }
      }
    ).catch((e) => {
      console.error(e.toString())
      alert("Invalid login");
      setAppPasswordLoading(false);
    });
  }

  const onOAuthClick = async () => {
    try {
      if ("" === email) {
        setEmailError("Please enter your handle to sign in with Bluesky");
        return;
      }
      setOauthLoading(true);
      await oauthClient.signIn(email);
      // OAuth redirects away, so we don't reset loading here
    } catch (e) {
      console.error(e);
      alert("Failed to initiate OAuth login");
      setOauthLoading(false);
    }
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{mt: 8, mb: 4, textAlign: 'center'}}>
        <Paper elevation={0}
               sx={{p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 2}}>
          <Typography variant="h4" component="h1" gutterBottom sx={{fontWeight: 700}}>
            Login
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{mb: 4}}>
            Sign in with your Bluesky account.
          </Typography>

          <Box component="form" noValidate
               sx={{mt: 1, display: 'flex', flexDirection: 'column', gap: 2}}>

            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={oauthLoading || appPasswordLoading}
              startIcon={oauthLoading ? <CircularProgress size={20} color="inherit"/> : <SiBluesky/>}
              onClick={onOAuthClick}
              sx={{
                backgroundColor: '#0085ff',
                '&:hover': {
                  backgroundColor: '#0074e0',
                },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {oauthLoading ? "Signing in..." : "Sign in with Bluesky"}
            </Button>

            <Divider sx={{my: 2}}>
              <Typography variant="body2" color="text.secondary">
                or use an App Password
              </Typography>
            </Divider>

            <TextField
              fullWidth
              label="Handle"
              variant="outlined"
              value={email}
              placeholder="e.g. handle.bsky.social"
              error={!!emailError}
              helperText={emailError}
              onChange={ev => setEmail2(ev.target.value)}
            />
            <TextField
              fullWidth
              label="App Password"
              variant="outlined"
              type="password"
              value={password}
              error={!!passwordError}
              helperText={passwordError}
              onChange={ev => setPassword(ev.target.value)}
            />

            <Button
              fullWidth
              variant="outlined"
              size="large"
              disabled={oauthLoading || appPasswordLoading}
              sx={{mt: 1}}
              onClick={onButtonClick}
            >
              {appPasswordLoading ? <CircularProgress size={20} color="inherit"/> : "Log In with App Password"}
            </Button>

            <Typography variant="caption" color="text.secondary" sx={{mt: 2}}>
              We recommend using an App Password for security. You can create one in your Bluesky
              settings.
            </Typography>

            <Link
              href="https://bsky.app/settings/app-passwords"
              target="_blank"
              rel="noopener"
              variant="caption"
              sx={{textDecoration: 'none'}}
            >
              Manage App Passwords
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login