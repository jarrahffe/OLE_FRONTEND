import React from 'react';
import { Activity } from '../../config/activity';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import ActivitySelection from './cards/ActivitySelection';
import { ClickContext, TimeCardContext, DayCardContext } from '../../contexts';
import ActivitySelectionPlaceholder from './cards/ActivitySelectionPlaceholder';


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
  map.set("special", "#7e57c2");

  const { clicked, setClicked } = React.useContext(ClickContext);
  const { setTimeCard } = React.useContext(TimeCardContext);
  const { dayCard, setDayCard } = React.useContext(DayCardContext);
  const [activity, setActivity] = React.useState(props.activity);

  const handleClick = () => {
    clicked === props.id ? setClicked("") : setClicked(props.id)
  }

  const handleEnter = () => {
    const time = props.time % 12 === 0 ? 12 : props.time % 12;
    setDayCard(props.day.toLowerCase().slice(0, 3));
    setTimeCard(time);
  }

  const handleLeave = () => {
    setDayCard("");
    setTimeCard(-1);
  }

  return activity ?
    (
      <Tippy content={<p>{activity.notes}</p>} disabled={activity.notes === ""}>
        <div className="grid-cell-blank"
        id={activity.id}
        onMouseEnter={() => handleEnter()}
        onMouseLeave={() => handleLeave()}
        >
          <div className="grid-cell-activity"
            style={{ backgroundColor: map.get(activity.type) }}
          >
            <div className="grid-cell-name">
              {
                activity.type !== BLOCK_NAME ?
                  <p>{activity.name}</p>
                  :
                  null
              }
            </div>
          </div>
        </div>
      </Tippy>
    ) :
    (
      <div className="grid-cell-blank"
      onMouseEnter={() => handleEnter()}
      onMouseLeave={() => handleLeave()}
      >
        <div className="grid-cell-blank" onClick={() => handleClick()} />
        {
          clicked === props.id ?
            <ActivitySelection day={props.day} time={props.time} setActivity={setActivity}/>
            :
            null
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
