import React from 'react';
import { Activity, makeActivity } from '../../config/activity';
import ActivitySelection from './cards/ActivitySelection';
import { ClickContext, TimeCardContext, DayCardContext, WeekContext, MultiSelectContext, DateMapContext, UserInfoContext } from '../../contexts';
import ActivitySelectionPlaceholder from './cards/ActivitySelectionPlaceholder';
import { animated, useSpring, useTransition } from '@react-spring/web';
import { IconButton, Menu, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteActivity } from '../../helpers/RequestHelpers';


const BLOCK_NAME = "block";

type Props = {
  activity?: Activity
  id: string
  day: string
  time: number
  dragging: React.MutableRefObject<boolean>
}

const GridCell = (props: Props) => {

  const map = new Map();
  // light blue
  map.set("lesson", "#1565c0");
  // MUI light grey #37474f
  map.set("block", "#607d8b");
  // dark blue
  map.set("special", "#283593");

  map.set("select", "#eceff1");

  const { clicked, setClicked } = React.useContext(ClickContext);
  const { selectedWeek } = React.useContext(WeekContext);
  const { timeCard, setTimeCard } = React.useContext(TimeCardContext);
  const { dayCard, setDayCard } = React.useContext(DayCardContext);
  const { blockSelect, eventSelect, multiActivities, setMultiActivities, multiDelete, setMultiDelete } = React.useContext(MultiSelectContext);
  const { dateMap } = React.useContext(DateMapContext);
  const [activity, setActivity] = React.useState(props.activity);
  const { firstName, token } = React.useContext(UserInfoContext);
  const [name, setName] = React.useState(firstName);
  const [opacity, setOpacity] = React.useState("100%")

  // Delete icon menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleDeleteMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const time = props.time % 12 === 0 ? 12 : props.time % 12;

  const beingDragged = React.useRef(false);

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
  })

  const [springs, api] = useSpring(() => ({
    from: {
      opacity: "0%",
    },
  }));

  // Animate on render
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


  // Set currently clicked cell
  const handleClick = () => {
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
        setOpacity("40%")
      }

      else {
        const newActivity =  blockSelect ? makeActivity(props.id, "block", "block", props.day, props.time, "", selectedWeek, dateMap.get(props.day.slice(0,3)) as string)
        : makeActivity(props.id, "special", "", props.day, props.time, "", selectedWeek, dateMap.get(props.day.slice(0,3)) as string);

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
  const handleLeave = () => {
    beingDragged.current = false;
    setDayCard("");
    setTimeCard(-1);
  }

  const handleMouseDown = () => {
    if (!beingDragged.current && (blockSelect || eventSelect)) {
      beingDragged.current = true
      handleClick()
    }
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
            <div className="grid-cell-activity" style={{ backgroundColor: map.get(activity.type), opacity: opacity}} >
              {
                dayCard === props.day.toLowerCase().slice(0, 3) && timeCard === time  && !blockSelect && !eventSelect ?
                  <IconButton onClick={handleDeleteMenuClick} sx={{position: "absolute", right: "5%"}}><DeleteIcon htmlColor='gray'/></IconButton>
                :
                null
              }
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
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

              <div className='grid-cell-name' style={{textDecoration: opacity !== "100%" ? "line-through" : "none"}}>
                { activity.type !== BLOCK_NAME ?  <p>{activity.name}</p> : null }
              </div>
            </div>
        }
      </animated.div>
    ) :
    (
      <div className="grid-cell-blank"
      onMouseEnter={() => handleEnter()}
      onMouseDown={() => handleMouseDown()}
      onMouseLeave={() => handleLeave()}
      onMouseUp={() => beingDragged.current = false}
      >
        <div className="grid-cell-blank"  onClick={() => handleClick()}/>
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
      </div>
    )
}

export default GridCell;
