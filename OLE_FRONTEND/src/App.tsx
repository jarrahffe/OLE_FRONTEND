import './App.css'
import Timetable from './components/timetable/Timetable';
import NavBar from './components/nav/NavBar';
import './components/timetable/Timetable.css';
import 'tippy.js/dist/tippy.css';
import './components/nav/Nav.css';
import { ThemeProvider } from '@emotion/react';
import React from 'react';
import axios from 'axios';
import Theme from './Theme';
import { CircularProgress } from '@mui/material';
import moment from 'moment';
import { DateMapContext, MultiSelectContext, WeekContext } from './Contexts';
import { mapDaysToDate } from './helpers/DateHelpers';
import { Activity } from './config/activity';

function App() {

  const [loaded, setLoaded] = React.useState(false);

  const [selectedWeek, setSelectedWeek] = React.useState(moment().diff(moment("2023-07-17", "YYYY-MM-DD"), "weeks") + 1);

  const [dateMap, setDateMap] = React.useState(mapDaysToDate(0));

  const [blockSelect, setBlockSelect] = React.useState(false);
  const [eventSelect, setEventSelect] = React.useState(false);
  const [multiActivities, setMultiActivities] = React.useState<Map<Activity, Function>>();
  const [multiSelectModal, setMultiSelectModal] = React.useState(false);

  React.useEffect(() => {
    setLoaded(false);
    axios.get(`${import.meta.env.VITE_BE_API_TIMETABLE}`, {
    }).then(response => {
      sessionStorage.setItem("data", JSON.stringify(response.data));
      setLoaded(true);
    }).catch(function(error) {
      setLoaded(true)
      console.log(error);
    });
  }, []);

  return (
    <DateMapContext.Provider value={{ dateMap, setDateMap }}>
      <WeekContext.Provider value={{selectedWeek, setSelectedWeek}}>
        <MultiSelectContext.Provider value={{blockSelect, setBlockSelect, eventSelect, setEventSelect,
          multiActivities, setMultiActivities, multiSelectModal, setMultiSelectModal}}>
          <ThemeProvider theme={Theme}>
            <div className="App">
              <NavBar />
              { loaded ? <Timetable /> : <CircularProgress/> }
            </div>
          </ThemeProvider>
        </MultiSelectContext.Provider>
      </WeekContext.Provider>
    </DateMapContext.Provider>
  );
}

export default App;