import React from 'react';
import { Activity } from '../../../config/activity';
import GridCell from './GridCell';
import { ClickContext, DateMapContext, DayCardContext, MultiSelectContext, SwapContext, TimeCardContext, WeekContext } from '../../../contexts';
import MultiSelectModal from '../Modals/MultiSelectModal';
import { animated, useTransition } from '@react-spring/web';
import SwapMenuModal from '../Modals/SwapMenuModal';
import moment from 'moment';

const TimeGrid = () => {

  const interval = 15;

  const [clicked, setClicked] = React.useState("");
  const [irlMinute, setIrlMinute] = React.useState(moment().minute());

  const { selectedWeek } = React.useContext(WeekContext);
  const { timeCard } = React.useContext(TimeCardContext);
  const { dayCard } = React.useContext(DayCardContext);
  const { dateMap } = React.useContext(DateMapContext);
  const { multiSelectModal, setMultiSelectModal, multiActivities, setMultiActivities } = React.useContext(MultiSelectContext);
  const { swapMenuModal, setSwapMenuModal, swapHubModal, setSwapHubModal } = React.useContext(SwapContext);

  const dragging = React.useRef(false);

  const multiSelectTransition = useTransition(multiSelectModal, {
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

  const swapMenuTransition = useTransition(swapMenuModal, {
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
        cellArray.push(<GridCell activity={activity} id={id} key={`${id}:${selectedWeek}`} day={map.get(j)} time={i + 8} dragging={dragging} irlMinute={irlMinute}/>)
      }
    }
    return cellArray;
  }

  const cellArray = generateCells();

  function repeatEvery() {
    const now = moment().minute(), delay = interval - now % interval;
    function start() {
      setIrlMinute(moment().minute());
      repeatEvery();
    }
    setTimeout(start, delay);
  }

  React.useEffect(() => {
    repeatEvery();
  }, []);

  return (
    <ClickContext.Provider value={{clicked, setClicked}}>
      <div className='time-grid'
      id='timegrid'
      onMouseDown={() => dragging.current = true}
      onMouseUp={() => dragging.current = false}
      onMouseLeave={() => dragging.current = false}
      >
        { multiSelectTransition((style, modal) =>
          modal ?
            <animated.div
            style={style}
            className='multiselect-modal-outer'
            onClick={() => setMultiSelectModal(false)}
            >
              <MultiSelectModal />
            </animated.div>
          :
          null)
        }


        { cellArray }
      </div>
    </ClickContext.Provider>
  );
}

export default TimeGrid;