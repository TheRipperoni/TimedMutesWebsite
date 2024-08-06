import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";

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

  const onButtonClick = () => {
    if (loggedIn) {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      };
      fetch(import.meta.env.VITE_API_HOST + '/logout', requestOptions)
        .then(() => {
          setLoggedIn(false)
          setPfpUrl("");
          setHandlename("");
          navigate(import.meta.env.VITE_BASE_PATH + "/login")
        });
    } else {
      navigate(import.meta.env.VITE_BASE_PATH + "/login")
    }
  }

  return <div className={"buttonContainer"}>
    <Button variant={"contained"} onClick={onButtonClick}>{loggedIn ? "Log out" : "Log in"}</Button>
    {(loggedIn ? <div>
    </div> : <div/>)}
  </div>
}

export default AccountButton