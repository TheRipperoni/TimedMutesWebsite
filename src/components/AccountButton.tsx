import {useNavigate} from "react-router-dom";
import {Button, CircularProgress} from "@mui/material";
import {useState} from "react";

const AccountButton = ({
  loggedIn,
  setLoggedIn,
  setPfpUrl,
  setHandlename,
}: {
  loggedIn: boolean,
  setLoggedIn: (v: boolean) => void,
  setPfpUrl: (v: string) => void,
  setHandlename: (v: string) => void
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onButtonClick = () => {
    if (loggedIn) {
      setLoading(true);
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      };
      fetch(import.meta.env.VITE_API_HOST + '/logout', requestOptions)
        .then((response) => {
          if (response.status == 200) {
            setLoggedIn(false)
            setPfpUrl("");
            setHandlename("");
            navigate(import.meta.env.VITE_BASE_PATH + "/login")
          } else {
            console.warn('Logout returned status ' + response.status);
          }
          setLoading(false);
        }).catch((err) => {
          console.error('Failed to log out:', err);
          setLoading(false);
          // Still navigate away so the user isn't stuck
          setLoggedIn(false);
          navigate(import.meta.env.VITE_BASE_PATH + "/login")
        });
    } else {
      navigate(import.meta.env.VITE_BASE_PATH + "/login")
    }
  }

  return <div>
    <Button variant={"contained"} disabled={loading} onClick={onButtonClick}>
      {loading ? <CircularProgress size={20} color="inherit"/> : (loggedIn ? "Log out" : "Log in")}
    </Button>
  </div>
}

export default AccountButton