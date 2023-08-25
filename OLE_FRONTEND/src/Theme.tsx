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
    // block gray
    // error: {
    //   main: "#37474f"
    // },
    // event darkblue
    info: {
      main: "#303f9f"
    },
    // RED
    success: {
      main: "#b71c1c"
    }


  }
});

export default Theme