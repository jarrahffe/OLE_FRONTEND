import React from 'react';
import ActivitySelection from './ActivitySelection';
import ActivitySelectionPlaceholder from './ActivitySelectionPlaceholder';
import DeleteIcon from '@mui/icons-material/Delete';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import LyricsRoundedIcon from '@mui/icons-material/LyricsRounded';
import moment from 'moment';
import { Activity, makeActivity } from '../../../config/activity';
import { ClickContext, TimeCardContext, DayCardContext, WeekContext, MultiSelectContext, DateMapContext, UserInfoContext, SwapContext } from '../../../contexts';
import { animated, useSpring, useTransition } from '@react-spring/web';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { deleteActivity } from '../../../helpers/RequestHelpers';
import { CURRENT_WEEK } from '../../../config/CurrentWeek';
import StudioRadialMenu from './StudioRadialMenu';

const BLOCK_NAME = "block";

type Props = {
  activity?: Activity
  id: string
  day: string
  time: number
  dragging: React.MutableRefObject<boolean>
  setSwapped: React.Dispatch<React.SetStateAction<Activity|undefined>>
  irlMinute: number
}

const GridCell = (props: Props) => {

  // Contexts
  const { clicked, setClicked } = React.useContext(ClickContext);
  const { selectedWeek } = React.useContext(WeekContext);
  const { timeCard, setTimeCard } = React.useContext(TimeCardContext);
  const { dayCard, setDayCard } = React.useContext(DayCardContext);
  const { blockSelect, eventSelect, multiActivities, setMultiActivities, multiDelete, setMultiDelete } = React.useContext(MultiSelectContext);
  const { dateMap } = React.useContext(DateMapContext);
  const { firstName, lastName, token, account, isSuperUser } = React.useContext(UserInfoContext);
  const { setSwapMenuModal } = React.useContext(SwapContext);

  const gridCellDate = dateMap.get(props.day.slice(0, 3)) as string;

  // State
  const [activity, setActivity] = React.useState(props.activity);
  const [name, setName] = React.useState(firstName);
  const [opacity, setOpacity] = React.useState("100%")
  const [deleteAnchorEl, setDeleteAnchorEl] = React.useState<null | HTMLElement>(null);
  const [swapAnchorEl, setSwapAnchorEl] = React.useState<null | HTMLElement>(null);
  const [pastTimeTooltip, setPastTimeTooltip] = React.useState(false);
  const isInCurrentHourBracket = props.time === moment().hour() && gridCellDate === moment().format("YYYY-MM-DD");

  // Constants
  const time = props.time % 12 === 0 ? 12 : props.time % 12;
  const beingDragged = React.useRef(false);
  const deleteOpen = Boolean(deleteAnchorEl);
  const swapOpen = Boolean(swapAnchorEl);
  const hasExpired = moment().isAfter(moment(`${gridCellDate}-${props.time}`, "YYYY-MM-DD-kk"));
  const isGtOneWeekInAdvance = selectedWeek - CURRENT_WEEK > 1;
  const isOneWeekInAdvanceNotThursday = selectedWeek - CURRENT_WEEK === 1 && moment().weekday() < 4;

  let invalidBookMessage = "";
  if (hasExpired) invalidBookMessage = "Time is in the past!";
  else if (isGtOneWeekInAdvance) invalidBookMessage = `Time is ${selectedWeek - CURRENT_WEEK} weeks ahead!`;
  else if (isOneWeekInAdvanceNotThursday) invalidBookMessage = "Please wait until Thursday to book";

  const map = new Map();
  map.set("lesson", "#1565c0");
  map.set("block", "#607d8b");
  map.set("special", "#283593");
  map.set("select", "#eceff1");

  // Animations
  const transition = useTransition(clicked, {
    from: {
      height: "0%",
      opacity: "0%"
    },
    enter: {
      height: "300%",
      backgroundColor: "#eceff1",
      opacity: "100%"
    },
    leave: {
      height: "0%",
      opacity: "0%"
    },
  });

  const [springs, api] = useSpring(() => ({
    from: {
      opacity: "0%",
    },
  }));

  React.useEffect(() => {
    api.start({
      from: {
        opacity: "0%"
      },
      to: {
        opacity: "100%",
      },
    });
  }, []);


  // Functions
  function handleDeleteMenuClick(event: React.MouseEvent<HTMLElement>) {
    setDeleteAnchorEl(event.currentTarget);
  };

  function handleSwapMenuClick(event: React.MouseEvent<HTMLElement>) {
    setSwapAnchorEl(event.currentTarget);
  };

  function handleDeleteClose() {
    setDeleteAnchorEl(null);
  };

  function handleSwapClose() {
    setSwapAnchorEl(null);
  };

  // Set currently clicked cell
  function handleClick() {
    if (hasExpired) return;

    if (blockSelect || eventSelect) {

      if (activity && multiActivities && multiActivities.has(activity)) {
        multiActivities.delete(activity);
        setMultiActivities(multiActivities.size === 0 ? undefined : multiActivities);
        setActivity(undefined);
      }

      else if (activity && multiDelete && multiDelete.has(activity)) {
        multiDelete.delete(activity);
        setMultiDelete(multiDelete.size === 0 ? undefined : multiDelete);
        setOpacity("100%")
      }

      else if (activity) {
        if ((blockSelect && activity.type !== "block") || (eventSelect && activity.type !== "special")) return;
        setMultiDelete(multiDelete ? multiDelete.set(activity, setOpacity) : new Map<Activity, Function>([[activity, setOpacity]]));
        setOpacity("25%")
      }

      else {
        const newActivity =  blockSelect ? makeActivity(props.id, "block", "block", props.day, props.time, "", selectedWeek, gridCellDate, account)
        : makeActivity(props.id, "special", "", props.day, props.time, "", selectedWeek, gridCellDate, account);

        setActivity(newActivity);
        if (multiActivities) setMultiActivities(multiActivities.set(newActivity, setActivity))
        else setMultiActivities(new Map<Activity, Function>([[newActivity, setActivity]]));
      }
    }

    else clicked === props.id ? setClicked("") : setClicked(props.id);
  }

  // Set hovered cell to reflect in day/time cards
  function handleEnter() {
    if (props.dragging.current === true && !beingDragged.current && (blockSelect || eventSelect)) {
      beingDragged.current = true
      handleClick()
    }
    const time = props.time % 12 === 0 ? 12 : props.time % 12;
    setDayCard(props.day.toLowerCase().slice(0, 3));
    setTimeCard(time);
  }

  // Remove day/time card
  function handleLeave() {
    beingDragged.current = false;
    setDayCard("");
    setTimeCard(-1);
  }

  function handleMouseDown() {
    if (!beingDragged.current && (blockSelect || eventSelect)) {
      beingDragged.current = true
    }
    handleClick()
  }

  function isAfterCurrentDate() {
    return moment(`${gridCellDate}-${props.time}`, "YYYY-MM-DD-HH").isAfter(moment())
  }

  function createSwapRequest() {
    props.setSwapped(props.activity);
    setSwapMenuModal(true);
  }

  return activity ?
    (
      <animated.div className="grid-cell-blank"
      style={springs}
      id={activity.id}
      onMouseEnter={() => handleEnter()}
      onMouseDown={() => handleMouseDown()}
      onMouseUp={() => beingDragged.current = false}
      onMouseLeave={() => handleLeave()}
      >
        {
          multiActivities?.has(activity) ?
            <div className='multi-select-glow'>
                <div className="grid-cell-multi-select" style={{backgroundColor: map.get(activity.type)}}/>
            </div>
          :
            <div className="grid-cell-activity" style={{ backgroundColor: map.get(activity.type), opacity: hasExpired ? "25%" : opacity}} >
              {
                dayCard === props.day.toLowerCase().slice(0, 3) && timeCard === time && !blockSelect && !eventSelect && (props.activity?.account === account || isSuperUser) && token && !hasExpired ?
                  <Tooltip title="Delete">
                    <IconButton onClick={handleDeleteMenuClick} sx={{position: "absolute", right: "5%"}}><DeleteIcon htmlColor='lightgray'/></IconButton>
                  </Tooltip>
                :
                null
              }
              <Menu
                anchorEl={deleteAnchorEl}
                id="account-menu"
                open={deleteOpen}
                onClose={handleDeleteClose}
                onClick={handleDeleteClose}
                sx={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >

                  <MenuItem onClick={() => {
                    deleteActivity(props.id, token);
                    setActivity(undefined);
                  }}>
                    Delete Activity
                  </MenuItem>

              </Menu>

              {
                dayCard === props.day.toLowerCase().slice(0, 3) && timeCard === time && !blockSelect && !eventSelect && props.activity?.account !== account && token && isAfterCurrentDate() && !hasExpired && props.activity?.type === "lesson"?
                  <Tooltip title="Swap">
                    <IconButton onClick={handleSwapMenuClick} sx={{position: "absolute", left: "5%"}}><SwapHorizIcon htmlColor='lightgray'/></IconButton>
                  </Tooltip>
                :
                null
              }
              <Menu
                anchorEl={swapAnchorEl}
                id="account-menu"
                open={swapOpen}
                onClose={handleSwapClose}
                onClick={handleSwapClose}
                sx={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >

                <MenuItem onClick={() => createSwapRequest()}>
                  Create Swap Request
                </MenuItem>

              </Menu>

              {
                activity.name.toLowerCase() === "studio" && dayCard === props.day.toLowerCase().slice(0, 3) && timeCard === time && !blockSelect && !eventSelect ?
                <StudioRadialMenu/>
                :
                null
              }

              <div className='grid-cell-name' style={{textDecoration: opacity !== "100%" ? "line-through" : "none"}}>
                { activity.type !== BLOCK_NAME ?  <p>{activity.name}</p> : null }
              </div>

              {
                clicked !== props.id && isInCurrentHourBracket ?
                  <>
                    <div className="grid-cell-time-indicator" style={{top: `${props.irlMinute / 60 * 100}%`}}/>
                    <div className="grid-cell-time-indicator-ball" style={{top: `${props.irlMinute / 60 * 100 - 7.5}%`}}/>
                  </>
                  :
                  null
              }
            </div>
          }
        </animated.div>
    ) :
    (
      <Tooltip
      PopperProps={{
        disablePortal: true,
      }}
      open={pastTimeTooltip}
      placement='top'
      disableFocusListener
      disableHoverListener
      disableTouchListener
      title={invalidBookMessage}
      >

        <div className="grid-cell-blank"
        onMouseEnter={() => handleEnter()}
        onMouseDown={() => {
          if (hasExpired || (isGtOneWeekInAdvance && !isSuperUser) || (isOneWeekInAdvanceNotThursday && !isSuperUser)) {
            setPastTimeTooltip(true);
            setTimeout(() => {
              setPastTimeTooltip(false);
            }, 1000);
          }
          else if (clicked !== props.id) handleMouseDown();
        }}
        onMouseLeave={() => handleLeave()}
        onMouseUp={() => beingDragged.current = false}
        >
          <div className="grid-cell-blank" />
          {
            transition((style, clicked) =>
              clicked === props.id ? <animated.div className="activity-selection" style={style}> <ActivitySelection name={name} setName={setName} day={props.day} time={props.time} setActivity={setActivity} /> </animated.div> : null
            )
          }
          {
            clicked === props.id ?
              <ActivitySelectionPlaceholder name={name} />
              :
              null
          }
          {
            clicked !== props.id && isInCurrentHourBracket ?
              <>
                <div className="grid-cell-time-indicator" style={{top: `${props.irlMinute / 60 * 100}%`}}/>
                <div className="grid-cell-time-indicator-ball" style={{top: `${props.irlMinute / 60 * 100 - 7.5}%`}}/>
              </>
              :
              null
          }
        </div>
      </Tooltip>
    )
}

export default GridCell;