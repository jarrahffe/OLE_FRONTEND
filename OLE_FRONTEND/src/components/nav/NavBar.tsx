import { Box } from '@mui/system';
import { Typography, Button } from '@mui/material';

const NavBar = () => {

  const LOGGED_IN = window.sessionStorage.getItem("token")
  const TEACHER_NAME = "Ole"
  const HEADER_FONT_SIZE = window.innerWidth < 601 ? "h6" : "h5";
  const HEADER_WIDTH = window.innerWidth < 601 ? "50%" : "15%";
  const HEADER_DIST_FROM_TOP = window.innerWidth < 601 ? "1.5%" : "5%";
  const HEADER_DIST_FROM_LEFT = window.innerWidth < 601 ? "0%" : "2.5%";

  return (
    <Box sx={{
      width: "90%",
      height: "5%",
      position: 'absolute',
      top: HEADER_DIST_FROM_TOP,
      display: "flex",
      alignItems: "center",
    }}>

      <Box sx={{
        width: HEADER_WIDTH,
        position: "relative",
        textAlign: "center",
        backgroundColor: "#1565c0",
        color: "whitesmoke",
        left: HEADER_DIST_FROM_LEFT,
        borderRadius: "0.25rem",
        boxShadow: "1px 2px 7px grey"
      }}>

        <Typography variant={HEADER_FONT_SIZE} component="h5">
          {TEACHER_NAME}'s 🎻 Studio
        </Typography>

      </Box>

      <Box sx={{
        position: "absolute",
        height: "100%",
        right: HEADER_DIST_FROM_LEFT,
        display: "flex",
        alignItems: "center",
      }}>
        {
          LOGGED_IN ?
            <Button variant="contained" size="medium">
              User
            </Button>
            :
            <Button variant="contained" size="medium">
              Login
            </Button>
        }
      </Box>

    </Box>
  )
}

export default NavBar
