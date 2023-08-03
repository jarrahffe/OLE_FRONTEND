import { Box } from '@mui/system';
import { Typography, Button, Slider, Switch, FormControlLabel, Alert } from '@mui/material';
import React from 'react';
import moment from 'moment';
import { DateMapContext, MultiSelectContext, WeekContext } from '../../Contexts';
import { mapDaysToDate } from '../../helpers/DateHelpers';
import { animated, useSpring } from '@react-spring/web';
import DeleteIcon from '@mui/icons-material/Delete';
import { Activity } from '../../config/activity';

const NavBar = () => {

  const isMobile = window.innerWidth < 601;

  const LOGGED_IN = window.sessionStorage.getItem("token");
  const TEACHER_NAME = "Ole";
  const HEADER_FONT_SIZE = isMobile ? "h6" : "h5";
  const HEADER_WIDTH = isMobile ? "50%" : "15%";
  const HEADER_DIST_FROM_TOP = isMobile ? "1.5%" : "5%";
  const HEADER_DIST_FROM_SIDE = isMobile ? "0%" : "2.5%";

  const CURRENT_WEEK = moment().diff(moment([2023, 6, 17]), "weeks") + 1;
  const NUM_WEEKS_TOTAL = 13;

  const { selectedWeek, setSelectedWeek } = React.useContext(WeekContext);
  const { dateMap, setDateMap } = React.useContext(DateMapContext);
  const {
    blockSelect, setBlockSelect,
    eventSelect, setEventSelect,
    multiActivities, setMultiActivities,
    multiSelectModal, setMultiSelectModal
  } = React.useContext(MultiSelectContext);

  function handleSliderChange(val: number) {
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
    for (const setActivity of (multiActivities as Map<Activity, Function>).values()) {
      setActivity(undefined);
    }
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

      {/* title */}
      <Box sx={{
        width: HEADER_WIDTH,
        position: "relative",
        textAlign: "center",
        backgroundColor: "#1565c0",
        color: "whitesmoke",
        left: HEADER_DIST_FROM_SIDE,
        borderRadius: "0.25rem",
        boxShadow: "1px 2px 7px grey"
      }}>
        <Typography variant={HEADER_FONT_SIZE} component="h5">
          {TEACHER_NAME}'s 🎻 Studio
        </Typography>
      </Box>

      {/* have to check if admin is logged in */}
      { 1 === 1 ?
      <Box sx={{display: "flex", position: "absolute", left: "19%", width: "20%", justifyContent: "space-evenly", alignItems:"center", }}>
        <Box sx={{ display: "flex", flexDirection: "column",  alignItems: "center"}}>
          <Typography sx={{fontSize: "0.8rem"}}>Busy</Typography>
          <Switch
          color='warning'
          checked={blockSelect}
          onChange={() => handleBlockCheck()}
          name="multiselect"
          disabled={eventSelect && multiActivities !== undefined}/>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", justifyContent:"center", alignItems: "center", position: "relative", }}>
          <Button
          onClick={() => multiActivities ? setMultiSelectModal(true) : null}
          variant={ multiActivities ? 'contained' : 'outlined'} size='small'>
            Save
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column",  alignItems: "center"}}>
          <Typography sx={{fontSize: "0.8rem"}}>Event</Typography>
          <Switch disabled={blockSelect && multiActivities !== undefined} color='primary' checked={eventSelect} onChange={() => handleEventCheck()} name="multiselect" />
        </Box>
      </Box>
      : null }

      <Box sx={{ height: "100%", width: "20%", position: "relative",
      left: "25%", display: "flex", flexDirection: "column"}}>

        <Typography sx={{display: "flex", justifyContent: "center", fontSize: "1rem"}}>
          Week {selectedWeek}
        </Typography>

          {
            multiActivities === undefined ?
            <Slider
            sx={{position: "absolute", top: "50%"}}
            aria-label="Week"
            defaultValue={CURRENT_WEEK}
            step={1}
            marks
            min={1}
            max={NUM_WEEKS_TOTAL}
            onChange={(e, val) => handleSliderChange(val as number)}
            />
            :
            <Alert
            severity='warning'
            action={
              <Button sx={{position: "absolute", right: "0%"}} onClick={() => handleUndo()} size='small' color='inherit'>Undo</Button>
            }
            >Unsaved changes!</Alert>
          }
      </Box>

      <Box sx={{
        position: "absolute",
        height: "100%",
        right: HEADER_DIST_FROM_SIDE,
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

export default NavBar;