import { Box } from '@mui/system';
import { Typography, Button, Slider, Switch, Alert, IconButton, Badge, Icon, Tooltip } from '@mui/material';
import React from 'react';
import moment from 'moment';
import { DateMapContext, MultiSelectContext, SwapContext, UserInfoContext, WeekContext } from '../../contexts';
import { mapDaysToDate } from '../../helpers/DateHelpers';
import { Activity } from '../../config/activity';
import ProfileDropdown from './ProfileDropdown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import usyd_logo from '../../assets/usyd_logo.png'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

type Props = {
  setLoginModalActive: React.Dispatch<React.SetStateAction<boolean>>
  isLoggedIn: boolean
}

const NavBar = (props: Props) => {

  const isMobile = window.innerWidth < 601;

  const TEACHER_NAME = "Ole";
  const HEADER_FONT_SIZE = isMobile ? "h6" : "h5";
  const HEADER_WIDTH = isMobile ? "50%" : "15%";
  const HEADER_DIST_FROM_TOP = isMobile ? "1.5%" : "5%";
  const HEADER_DIST_FROM_SIDE = isMobile ? "0%" : "2.5%";

  const CURRENT_WEEK = moment().diff(moment("2023-08-07", "YYYY-MM-DD"), "weeks") + 1;
  const NUM_WEEKS_TOTAL = 14;

  const { selectedWeek, setSelectedWeek } = React.useContext(WeekContext);
  const { dateMap, setDateMap } = React.useContext(DateMapContext);
  const {
    blockSelect, setBlockSelect,
    eventSelect, setEventSelect,
    multiActivities, setMultiActivities,
    multiDelete, setMultiDelete,
    multiSelectModal, setMultiSelectModal
  } = React.useContext(MultiSelectContext);

  const { isSuperUser } = React.useContext(UserInfoContext);

  const { swapHubModal, setSwapHubModal, swapMenuModal, setSwapMenuModal } = React.useContext(SwapContext);

  function handleSliderChange(val: number) {
    if (val > 14 || val < 1) return
    setSelectedWeek(val);
    setDateMap(mapDaysToDate(val - CURRENT_WEEK));
  }

  function handleEventCheck() {
    if (blockSelect) setBlockSelect(false);
    setEventSelect(!eventSelect);
  }

  function handleBlockCheck() {
    if (eventSelect) setEventSelect(false);
    setBlockSelect(!blockSelect);
  }

  function handleUndo() {
    if (multiActivities) {
      for (const setActivity of (multiActivities as Map<Activity, Function>).values()) {
        setActivity(undefined);
      }
    }
    if (multiDelete) {
      for (const setOpacity of (multiDelete as Map<Activity, Function>).values()) {
        setOpacity("100%")
      }
    }
    setMultiDelete(undefined);
    setMultiActivities(undefined);
  }

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
        // color: "whitesmoke",
        left: HEADER_DIST_FROM_SIDE,
        // borderRadius: "0.25rem",
      }}>
        {/* <Typography variant={HEADER_FONT_SIZE} component="h5">
          {TEACHER_NAME}'s 🎻 Studio
        </Typography> */ }
        <img src={usyd_logo} style={{width: "80%"}}/>
        {/* <img src={con_logo} style={{width: "100%"}}/> */}
      </Box>

      { isSuperUser ?
      <Box sx={{display: "flex", position: "absolute", left: "19%", width: "20%", justifyContent: "space-evenly", alignItems:"center", }}>
        <Box sx={{ display: "flex", flexDirection: "column",  alignItems: "center"}}>
          <Typography sx={{fontSize: "0.8rem"}}>Busy</Typography>
          <Switch
          color='error'
          checked={blockSelect}
          onChange={() => handleBlockCheck()}
          name="multiselect"
          disabled={multiActivities !== undefined}/>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", justifyContent:"center", alignItems: "center", position: "relative", }}>
          <Button
          color={eventSelect ? "info" : "error"}
          onClick={() => multiActivities || multiDelete ? setMultiSelectModal(true) : null}
          variant={ multiActivities || multiDelete ? 'contained' : 'outlined'} size='small'>
            Save
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column",  alignItems: "center"}}>
          <Typography sx={{fontSize: "0.8rem"}}>Event</Typography>
          <Switch disabled={multiActivities !== undefined} color='info' checked={eventSelect} onChange={() => handleEventCheck()} name="multiselect" />
        </Box>
      </Box>
      : null }

      <Box sx={{ height: "100%", width: "20%", position: "relative",
      left: "25%", display: "flex", flexDirection: "column"}}>

        <Typography sx={{display: "flex", justifyContent: "center", fontSize: "1rem"}}>
          Week {selectedWeek}
        </Typography>

          {
            multiActivities === undefined && multiDelete === undefined ?
            <>
              <Slider
              sx={{position: "absolute", top: "50%"}}
              aria-label="Week"
              defaultValue={CURRENT_WEEK}
              step={1}
              marks
              min={1}
              value={selectedWeek}
              max={NUM_WEEKS_TOTAL}
              onChange={(e, val) => handleSliderChange(val as number)}
              />
              <IconButton  sx={{position: "absolute", right: "0%", top: "100%"}} onClick={() => handleSliderChange(selectedWeek + 1)}><ArrowForwardIcon fontSize='small' color='primary'/></IconButton>
              <IconButton sx={{position: "absolute", left: "0%", top: "100%"}} onClick={() => handleSliderChange(selectedWeek - 1)}><ArrowBackIcon fontSize='small' color='primary'/></IconButton>
              <Button size='small' sx={{position: "absolute", left: "30%", right: "30%", top: "110%"}} onClick={() => handleSliderChange(CURRENT_WEEK)}>This Week</Button>
            </>
            :
            <Alert
            severity='warning'
            action={
              <Button sx={{position: "absolute", right: "0%"}} onClick={() => handleUndo()} size='small' color='inherit'>Undo all</Button>
            }
            >Unsaved changes!</Alert>
          }
      </Box>

      {/* {
        <div className='navbar-swap-menu'>

          <div className='navbar-swap-menu-time' style={{left: "0%"}}>
            <Typography sx={{fontWeight: 1000, color: "gold"}}>Fri 1pm</Typography>
          </div>

          <div className='navbar-arrow-glow'>
            <div className='navbar-swap-menu-arrow'>
              <div className='navbar-arrowhead-glow arrowhead-lower'/>
              <div className='navbar-arrowhead-glow arrowhead-upper'/>
            </div>
          </div>

          <div className='navbar-swap-menu-time' style={{right: "0%"}}>
            <Typography sx={{fontWeight: 1000}}>Thurs 10am</Typography>
          </div>

        </div>
      } */}

      {
        props.isLoggedIn ?
        <Box sx={{position: "absolute", right: "8%"}}>
            <Tooltip title="Swaps">
              <IconButton onClick={() => setSwapHubModal(!swapHubModal)} size='large'>
                <SwapHorizIcon fontSize='large' htmlColor='gray'/>
              </IconButton>
            </Tooltip>
        </Box>
        :
        null
      }

      <Box sx={{
        position: "absolute",
        height: "100%",
        right: HEADER_DIST_FROM_SIDE,
        display: "flex",
        alignItems: "center",
      }}>
        {
          props.isLoggedIn ?
            <ProfileDropdown/>
            :
            <Button
            variant="contained"
            size="medium"
            color='success'
            onClick={() => props.setLoginModalActive(true)}
            >
              Login
            </Button>
        }
      </Box>

    </Box>
  )
}

export default NavBar;