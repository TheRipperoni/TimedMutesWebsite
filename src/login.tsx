import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {BskyAgent} from "@atproto/api";
import {getAgentLogin} from "./agent.ts";
import {
  Button,
  FormControl,
  TextField,
  Typography
} from "@mui/material";

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
      setEmailError("Please enter your email")
      return
    }


    if ("" === password) {
      setPasswordError("Please enter a password")
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

  return (
    <FormControl margin={'normal'} sx={{
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      m: 2,
    }}>
      <Typography sx={{m:'1px'}} variant={"h4"} component={"h1"}>Login</Typography>
      <TextField
        sx={{m:'1px'}}
        value={email}
        placeholder="Enter your handle here"
        onChange={ev => setEmail2(ev.target.value)}/>
      <Typography sx={{m:'1px'}}>{emailError}</Typography>
      <TextField
        sx={{m:'1px'}}
        value={password}
        type="password"
        placeholder="Enter your password here"
        onChange={ev => setPassword(ev.target.value)}/>
      <Typography sx={{m:'1px'}}>{passwordError}</Typography>
      <Button sx={{m:'1px'}} variant={'contained'} onClick={onButtonClick}>Log in</Button>
    </FormControl>
  );
}

export default Login