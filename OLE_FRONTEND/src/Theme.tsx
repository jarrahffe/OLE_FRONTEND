import { createTheme } from "@mui/material";

const Theme = createTheme({
  palette: {
    // black
    primary: {
      main: "rgb(34, 34, 34)",
    },
    // save orange
    warning: {
      main: "#b71c1c",
      contrastText: "#fff"
    },
    // lesson blue
    secondary: {
      main: "#1976d2"
    },
    //red
    error: {
      main: "#b71c1c"
    },
    // event darkblue
    info: {
      main: "#303f9f"
    },
    // green
    success: {
      main: "#00897b"
    },

  }
});

export default Theme