import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {BskyAgent} from "@atproto/api";
import {getAgentLogin, oauthClient} from "./agent.ts";
import {
  Box,
  Button,
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
                    navigate(import.meta.env.VITE_BASE_PATH)
                  })
                } else {
                  alert("Invalid login")
                }
              })
              .catch(function (error) {
                alert("Invalid login: " + error.toString())
              });
          } else {
            alert("Invalid login, please try again with an App Password");
          }
        }
      }
    ).catch((e) => {
      console.error(e.toString())
      alert("Invalid login");
    });
  }

  const onOAuthClick = async () => {
    try {
      if ("" === email) {
        // If email is empty, we might want to prompt for a handle if it's required for some OAuth flows,
        // but typically ATProto OAuth starts with a handle to resolve the PDS.
        // Some implementations allow starting without it if the client is restricted to one service.
        await oauthClient.signIn("https://bsky.social");
      } else {
        await oauthClient.signIn(email);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to initiate OAuth login");
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
              startIcon={<SiBluesky/>}
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
              Sign in with Bluesky
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
              sx={{mt: 1}}
              onClick={onButtonClick}
            >
              Log In with App Password
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