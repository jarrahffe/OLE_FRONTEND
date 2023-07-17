import React from 'react';
import DayCard from './cards/DayCard';
import TimeGrid from './TimeGrid';
import TimeCard from './cards/TimeCard';
import { TimeCardContext, DateMapContext, DayCardContext } from '../../contexts';

type Props = {
  weekViewOffset: number
}

const timetable = (props: Props) => {

  // make pull from props to determine which week we are viewing
  // if week in advance, will be +7, if week before will be -7, etc.

  const [timeCard, setTimeCard] = React.useState(0);
  const [dayCard, setDayCard] = React.useState("");

  const days = ["Mon", "Tues", "Wed", "Thurs", "Fri"];
  const times = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7];

  const dateMap = mapDaysToDate(days, props.weekViewOffset);

  return (
    <div className="timetable">

      <DayCardContext.Provider value={{ dayCard, setDayCard }}>
        <DateMapContext.Provider value={{ dateMap }}>
          <div className="day-cards">
            {days.map((day) => {
              return <DayCard day={day} key={day} />
            })}
          </div>

          <TimeCardContext.Provider value={{ timeCard, setTimeCard }}>
            <TimeGrid />
            <div className="time-cards">
              {times.map(time => <TimeCard time={time} key={time} />)}
            </div>
          </TimeCardContext.Provider>
        </DateMapContext.Provider>
      </DayCardContext.Provider>

    </div>
  )
}


// Maps days from the start of the currently viewed week to their respective dates in locale time
function mapDaysToDate(days: Array<string>, weekViewOffset: number) {
  const date = new Date();
  const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);

  // initially start of week
  date.setDate(diff + weekViewOffset);

  const dateMap: Map<string, string> = new Map();
  for (const day of days) {
    // returns dd/mm/yyyy
    const dateStringArr = date.toLocaleDateString().split("/");
    const d = dateStringArr.at(0);
    const m = dateStringArr.at(1);
    const y = dateStringArr.at(2);
    const isoDate = `${y}-${m}-${d}`;
    // lowercase day prefix string(0,3) -> date string
    dateMap.set(day.substring(0, 3).toLocaleLowerCase(), isoDate);
    date.setDate(date.getDate() + 1);
  }
  return dateMap;
}

export default timetable
