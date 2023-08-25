import React from 'react';
import { Activity } from '../../config/activity';
import GridCell from './GridCell';
import { ClickContext, DateMapContext, DayCardContext, MultiSelectContext, TimeCardContext, WeekContext } from '../../contexts';
import MultiSelectModal from './cards/MultiSelectModal';
import { animated, useTransition } from '@react-spring/web';

const TimeGrid = () => {

  const [clicked, setClicked] = React.useState("");

  const { selectedWeek } = React.useContext(WeekContext);
  const { timeCard } = React.useContext(TimeCardContext);
  const { dayCard } = React.useContext(DayCardContext);
  const { dateMap } = React.useContext(DateMapContext);
  const { multiSelectModal, setMultiSelectModal, multiActivities, setMultiActivities } = React.useContext(MultiSelectContext);

  const dragging = React.useRef(false);

  const transition = useTransition(multiSelectModal, {
    from: {
      height: "0%",
      opacity: "0%"
    },
    enter: {
      height: "100%",
      opacity: "100%"
    },
    leave: {
      height: "0%",
      opacity: "0%"
    },
  });


  // Generates an array of grid cells. Then formatted as a matrix with css
  function generateCells() {
    const data: Activity[] = JSON.parse(window.sessionStorage.getItem("data") || "[]")
    const cellArray: JSX.Element[] = [];

    const map = new Map();
    map.set(0, "monday");
    map.set(1, "tuesday");
    map.set(2, "wednesday");
    map.set(3, "thursday");
    map.set(4, "friday");

    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 5; j++) {
        const date = dateMap.get(map.get(j).slice(0,3));
        const activity = data.find(activity => activity.start_time === i + 8 && activity.date === date);
        const id = activity ? activity.id : `${date}:${i + 8}`
        cellArray.push(<GridCell activity={activity} id={id} key={`${id}:${selectedWeek}`} day={map.get(j)} time={i + 8} dragging={dragging}/>)
      }
    }
    return cellArray;
  }

  const cellArray = generateCells();

  return (
    <ClickContext.Provider value={{clicked, setClicked}}>
      <div className='time-grid'
      id='timegrid'
      onMouseDown={() => dragging.current = true}
      onMouseUp={() => dragging.current = false}
      onMouseLeave={() => dragging.current = false}
      >
        { transition((style, modal) =>
        modal ?
          <animated.div
          style={style}
          className='multiselect-modal-outer'
          >
            <MultiSelectModal />
          </animated.div>
        :
        null)}

        {cellArray}
      </div>
    </ClickContext.Provider>
  );
}

export default TimeGrid;