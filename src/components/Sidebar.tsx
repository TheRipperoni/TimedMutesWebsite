import AccountButton from "./AccountButton.tsx";
import {Avatar, Box, Typography} from "@mui/material";

const Sidebar = ({
  loggedIn,
  setLoggedIn,
  handleName,
  pfpUrl,
  setPfpUrl,
  setHandlename
}: {
  loggedIn: boolean,
  setLoggedIn: (v: boolean) => void,
  handleName: string,
  pfpUrl: string,
  setPfpUrl: (v: string) => void,
  setHandlename: (v: string) => void,
}) => {
  return (
    <Box
      component="header"
      sx={{
        height: '64px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        px: 3,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        gap: 2
      }}
    >
      <Typography variant="h6" component="h1"
                  sx={{fontWeight: 700, color: 'primary.main', flexGrow: 0}}>
        Timed Mutes
      </Typography>

      <Box sx={{flexGrow: 1}}/>

      {loggedIn && (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
          <Typography variant="body2" sx={{color: 'text.secondary'}}>
            {handleName}
          </Typography>
          <Avatar
            alt={handleName}
            src={pfpUrl}
            sx={{width: 32, height: 32, border: '1px solid', borderColor: 'divider'}}
          />
        </Box>
      )}

      <AccountButton loggedIn={loggedIn} setLoggedIn={setLoggedIn} setPfpUrl={setPfpUrl}
                     setHandlename={setHandlename}/>
    </Box>
  );
};

export default Sidebar;
