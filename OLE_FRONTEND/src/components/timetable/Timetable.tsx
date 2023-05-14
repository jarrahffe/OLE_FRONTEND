import React from 'react';
import DayCard from './cards/DayCard';
import TimeGrid from './TimeGrid';
import TimeCard from './cards/TimeCard';

const timetable = () => {
  const [cellIds, setCellIds] = React.useState([]);
  const days = ["Mon", "Tues", "Wed", "Thurs", "Fri"];
  const times = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7];
  return (
    <div className="timetable">
      <div className="day-cards">
        {days.map(day => <DayCard day={day} />)}
      </div>
      <TimeGrid />
      <div className='time-cards'>
        {times.map(time => <TimeCard time={time} />)}
      </div>
    </div>
  )
}

export default timetable
