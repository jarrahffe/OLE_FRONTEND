import React from 'react';
import DayCard from './cards/DayCard';
import TimeGrid from './Grid';
import TimeCard from './cards/TimeCard';
import { TimeCardContext, DayCardContext } from '../../contexts';

const timetable = () => {
  const days = ["Mon", "Tues", "Wed", "Thurs", "Fri"];
  const times = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7];
  const [timeCard, setTimeCard] = React.useState(0);
  const [dayCard, setDayCard] = React.useState("");


  return (
    <div className="timetable">
      <DayCardContext.Provider value={{ dayCard, setDayCard }}>
        <TimeCardContext.Provider value={{ timeCard, setTimeCard }}>
          <div className="day-cards">
            {days.map((day) => <DayCard day={day} key={day} />)}
          </div>

          <TimeGrid />

          <div className="time-cards">
            {times.map(time => <TimeCard time={time} key={time} />)}
          </div>

        </TimeCardContext.Provider>
      </DayCardContext.Provider>
    </div>
  )
}




export default timetable
