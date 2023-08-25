import './App.css';
import './index.css';
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
import { DateMapContext, MultiSelectContext, WeekContext, UserInfoContext } from './contexts';
import { mapDaysToDate } from './helpers/DateHelpers';
import { Activity } from './config/activity';
import { animated, useTransition } from '@react-spring/web';
import LoginCard from './components/timetable/cards/LoginCard';

function App() {

  // App is loaded
  const [loaded, setLoaded] = React.useState(false);

  // Currently selected week
  const [selectedWeek, setSelectedWeek] = React.useState(moment().diff(moment("2023-07-17", "YYYY-MM-DD"), "weeks") + 1);

  // Map of days -> date
  const [dateMap, setDateMap] = React.useState(mapDaysToDate(0));

  // Is in block select state
  const [blockSelect, setBlockSelect] = React.useState(false);

  // Is in event select state
  const [eventSelect, setEventSelect] = React.useState(false);

  // Map of activity objects -> their function to set them
  const [multiActivities, setMultiActivities] = React.useState<Map<Activity, Function>>();
  const [multiDelete, setMultiDelete] = React.useState<Map<Activity, Function>>();

  // Modal for multi select activities
  const [multiSelectModal, setMultiSelectModal] = React.useState(false);

  // Modal for logging in
  const [loginModalActive, setLoginModalActive] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // User info
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [token, setToken] = React.useState("");

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
    if (window.localStorage.getItem("user")) {
      const userInfo = JSON.parse(window.localStorage.getItem("user") as string)
      setFirstName(userInfo.first_name)
      setLastName(userInfo.last_name)
      setEmail(userInfo.email)
      setToken(userInfo.token)
      setIsLoggedIn(true)
    }
  }, []);

  const loginModalTransition = useTransition(loginModalActive, {
    from: {
      height: "0%",
      opacity: "0%",
      right: "0%"
    },
    enter: {
      height: "100%",
      opacity: "100%",
      right: "0%"
    },
    leave: {
      height: "0%",
      opacity: "0%",
      right: "0%"
    }
  });


  return (
    <DateMapContext.Provider value={{ dateMap, setDateMap }}>
      <WeekContext.Provider value={{selectedWeek, setSelectedWeek}}>
        <MultiSelectContext.Provider value={{blockSelect, setBlockSelect, eventSelect, setEventSelect,
          multiActivities, setMultiActivities, multiDelete, setMultiDelete, multiSelectModal, setMultiSelectModal}}>
          <UserInfoContext.Provider value={{firstName, lastName, email, token}}>
            <ThemeProvider theme={Theme}>
              <div className="App">

                { loginModalTransition((style, loginModalActive) =>
                  loginModalActive ?
                    <animated.div
                    style={style}
                    className='login-card-outer'
                    >
                      <LoginCard
                      loginModalActive={loginModalActive}
                      setLoginModalActive={setLoginModalActive}
                      />
                    </animated.div>
                  :
                  null
                  )
                }

                <NavBar
                isLoggedIn={isLoggedIn}
                setLoginModalActive={setLoginModalActive}/>

                { loaded ? <Timetable /> : <CircularProgress/> }
              </div>
            </ThemeProvider>
          </UserInfoContext.Provider>
        </MultiSelectContext.Provider>
      </WeekContext.Provider>
    </DateMapContext.Provider>
  );
}

export default App;