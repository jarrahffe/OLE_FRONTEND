import './App.css';
import './index.css';
import './components/timetable/Swap.css';
import Timetable from './components/timetable/Timetable';
import NavBar from './components/nav/NavBar';
import './components/timetable/Timetable.css';
import 'tippy.js/dist/tippy.css';
import './components/nav/Nav.css';
import { ThemeProvider } from '@emotion/react';
import React from 'react';
import axios from 'axios';
import Theme from './Theme';
import { CircularProgress, Typography } from '@mui/material';
import { DateMapContext, MultiSelectContext, WeekContext, UserInfoContext, SwapContext } from './contexts';
import { mapDaysToDate } from './helpers/DateHelpers';
import { Activity } from './config/activity';
import { animated, useTransition } from '@react-spring/web';
import LoginCard from './components/timetable/Auth/LoginCard';
import { CURRENT_WEEK } from './config/CurrentWeek';

function App() {

  // App is loaded
  const [loaded, setLoaded] = React.useState(false);

  // Currently selected week
  const [selectedWeek, setSelectedWeek] = React.useState(CURRENT_WEEK);

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

  // Modal for swap menu
  const [swapMenuModal, setSwapMenuModal] = React.useState(false);
  const [swappedFrom, setSwappedFrom] = React.useState<Activity>();
  const [swappedTo, setSwappedTo] = React.useState<Activity>();

  // Modal for incoming and outgoing swap menu
  const [swapHubModal, setSwapHubModal] = React.useState(false);
  const [swapNotifications, setSwapNotifications] = React.useState();

  // Modal for logging in
  const [loginModalActive, setLoginModalActive] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // User info
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [token, setToken] = React.useState("");
  const [account, setAccount] = React.useState(-1);
  const [isSuperUser, setIsSuperUser] = React.useState(false);

  React.useEffect(() => {
    setLoaded(false);
    axios.get(`${import.meta.env.VITE_BE_API_TIMETABLE}`, {
    }).then(response => {
      sessionStorage.setItem("data", JSON.stringify(response.data.activities));
      sessionStorage.setItem("swaps", JSON.stringify(response.data.swaps));
      setLoaded(true);
    }).catch(function(error) {
      setLoaded(true);
      console.log(error);
    });

    if (window.localStorage.getItem("user")) {
      const userInfo = JSON.parse(window.localStorage.getItem("user") as string)
      setFirstName((userInfo.first_name as string).charAt(0).toUpperCase() + (userInfo.first_name as string).slice(1));
      setLastName(userInfo.last_name);
      setEmail(userInfo.email);
      setToken(userInfo.token);
      setAccount(userInfo.account);
      setIsSuperUser(userInfo.is_superuser);
      setIsLoggedIn(true);
      if (userInfo.rememberMe === false) {
        window.localStorage.removeItem("user");
      }
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

  function getTimetable() {
    if (window.innerWidth < 601) {
      return (
        <>
          <Typography sx={{position: "relative", color: "black"}}>Cadenza for mobile is coming soon!</Typography>
          <Typography sx={{position: "relative", color: "black"}}>Please try it out on your computer :)</Typography>
        </>
      )
    }
    else if (loaded) {
      return (
        <Timetable/>
      )
    }
    else return (
      <CircularProgress/>
    )
  }

  return (
    <DateMapContext.Provider value={{ dateMap, setDateMap }}>
      <WeekContext.Provider value={{selectedWeek, setSelectedWeek}}>
        <MultiSelectContext.Provider
        value={{blockSelect, setBlockSelect, eventSelect, setEventSelect,multiActivities,
        setMultiActivities, multiDelete, setMultiDelete, multiSelectModal, setMultiSelectModal
        }}
        >
          <SwapContext.Provider
          value={{swapMenuModal, setSwapMenuModal, swapHubModal,
            setSwapHubModal, swappedFrom, setSwappedFrom, swappedTo, setSwappedTo
          }}
          >
            <UserInfoContext.Provider value={{firstName, lastName, email, token, account, isSuperUser}}>
              <ThemeProvider theme={Theme}>
                <div className="App"
                onClick={() => setSwapHubModal(false)}>

                  { loginModalTransition((style, loginModalActive) =>
                    loginModalActive ?
                      <animated.div
                      style={style}
                      className='login-card-outer'
                      onClick={() => setLoginModalActive(false)}
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

                  {
                    window.innerWidth < 601 ?
                    null
                    :
                    <NavBar
                    isLoggedIn={isLoggedIn}
                    setLoginModalActive={setLoginModalActive}
                    />
                  }

                  { getTimetable() }

                  {
                    window.innerWidth < 601 ?
                    null
                    :
                    <Typography sx={{position: "absolute", bottom: "1%", right: "5%", color: "darkgrey"}}>Anything going wrong? Please email app.cadenza@gmail.com for support</Typography>
                  }
                </div>
              </ThemeProvider>
            </UserInfoContext.Provider>
          </SwapContext.Provider>
        </MultiSelectContext.Provider>
      </WeekContext.Provider>
    </DateMapContext.Provider>
  );
}

export default App;