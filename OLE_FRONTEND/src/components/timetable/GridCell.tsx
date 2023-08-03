import React from 'react';
import { Activity, makeActivity } from '../../config/activity';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import ActivitySelection from './cards/ActivitySelection';
import { ClickContext, TimeCardContext, DayCardContext, WeekContext, MultiSelectContext, DateMapContext } from '../../contexts';
import ActivitySelectionPlaceholder from './cards/ActivitySelectionPlaceholder';
import { animated, useSpring, useTransition } from '@react-spring/web';
import { Box } from '@mui/material';


const BLOCK_NAME = "block";

type Props = {
  activity?: Activity
  id: string
  day: string
  time: number
}

const GridCell = (props: Props) => {

  const map = new Map();
  // MUI teal 400
  map.set("lesson", "#26a69a");
  // MUI red 400
  map.set("block", "#c2185b");
  // MUI deepPurple 400
  map.set("special", "#1a237e");

  map.set("select", "#eceff1");

  const { clicked, setClicked } = React.useContext(ClickContext);
  const { selectedWeek } = React.useContext(WeekContext);
  const { setTimeCard } = React.useContext(TimeCardContext);
  const { dayCard, setDayCard } = React.useContext(DayCardContext);
  const { blockSelect, eventSelect, multiActivities, setMultiActivities } = React.useContext(MultiSelectContext);
  const { dateMap } = React.useContext(DateMapContext);

  const [activity, setActivity] = React.useState(props.activity);

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

      else if (!activity) {
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
  const handleEnter = () => {
    const time = props.time % 12 === 0 ? 12 : props.time % 12;
    setDayCard(props.day.toLowerCase().slice(0, 3));
    setTimeCard(time);
  }

  // Remove day/time card
  const handleLeave = () => {
    setDayCard("");
    setTimeCard(-1);
  }

  return activity ?
    (
      <Tippy content={<p>{activity.id}</p>} >
        <animated.div className="grid-cell-blank"
        style={springs}
        id={activity.id}
        onMouseOver={() => handleEnter()}
        onMouseLeave={() => handleLeave()}
        >
          <div className="grid-cell-activity" style={{ backgroundColor: map.get(activity.type)}}
          onClick={() => handleClick()} >

            {
              multiActivities?.has(activity) ?
              <Box sx={{outline: "#2196f3 solid 4px", width: "97%", height: "85%"}}/>
              : null
            }

            <div className="grid-cell-name">
              { activity.type !== BLOCK_NAME ?  <p>{activity.name}</p> : null }
            </div>

          </div>
        </animated.div>
      </Tippy>
    ) :
    (
      <div className="grid-cell-blank"
      onMouseEnter={() => handleEnter()}
      onMouseLeave={() => handleLeave()}
      >
        <div className="grid-cell-blank" onClick={() => handleClick()} />
        {
          transition((style, clicked) =>
            clicked === props.id ? <animated.div className="activity-selection" style={style}> <ActivitySelection day={props.day} time={props.time} setActivity={setActivity} /> </animated.div> : null
          )
        }
        {
          clicked === props.id ?
            <ActivitySelectionPlaceholder name="Cock Muskan-Chario" />
            :
            null
        }
      </div>
    )
}

export default GridCell;
