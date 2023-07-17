import './App.css'
import Timetable from './components/timetable/Timetable';
import NavBar from './components/nav/NavBar';
import './components/timetable/Timetable.css';
import 'tippy.js/dist/tippy.css';
import axios from 'axios';
import React from 'react';
import './components/nav/Nav.css';
import { ThemeProvider } from '@emotion/react';
import Theme from './Theme';
import { CircularProgress } from '@mui/material';

function App() {

  const [loaded, setLoaded] = React.useState(false);
  const [weekOffset, setWeekOffset] = React.useState(0);

  React.useEffect(() => {
    setLoaded(false);
    axios.get(`${import.meta.env.VITE_BE_API_TIMETABLE}`, {
      headers: {

      }
    }).then(function(response) {
      sessionStorage.setItem("data", JSON.stringify(response.data));
      setLoaded(true);
    }).catch(function(error) {
      setLoaded(true)
      console.log(error);
    })
  }, [weekOffset]);

  return (
    loaded ?
      <ThemeProvider theme={Theme}>
        <div className="App">
          <NavBar />
          <Timetable weekViewOffset={weekOffset} />
        </div>
      </ThemeProvider>
      :
      <div className='App'>
        <CircularProgress />
      </div>
  )
}

export default App
