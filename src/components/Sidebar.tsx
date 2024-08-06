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
    <Box height={'80px'} width={'100%'} display={'flex'} alignItems={'center'} gap={4} p={2}
         sx={{
           background: '#272727'
         }}>
      <Typography variant={"h4"} component={"h1"} color={"white"}>BSky Tool</Typography>
      <AccountButton loggedIn={loggedIn} setLoggedIn={setLoggedIn} setPfpUrl={setPfpUrl} setHandlename={setHandlename}/>
      <Typography>{handleName}</Typography>
      <Avatar alt="pfp" src={pfpUrl} sx={{marginRight: 'auto'}}/>
    </Box>
  );
};

export default Sidebar;
