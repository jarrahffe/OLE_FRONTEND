import React from 'react';
import { DateMapContext, WeekContext } from '../../../contexts';
import { Typography } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';
import { DayCardContext } from '../../../contexts';
import moment from 'moment';

type Props = {
  day: string
}

const DayCard = (props: Props) => {

  const { dayCard, setDayCard } = React.useContext(DayCardContext);
  const [hovered, setHovered] = React.useState(false);
  const { dateMap } = React.useContext(DateMapContext);

  const currentIsoDate = dateMap.get(props.day.slice(0, 3).toLowerCase())?.split("-");
  const day = removeLeadingZeros(currentIsoDate?.at(2) as string);
  const month = removeLeadingZeros(currentIsoDate?.at(1) as string);
  const isCurrentDay = dateMap.get(props.day.slice(0, 3).toLowerCase()) === moment().format("YYYY-MM-DD");

  const [springs, api] = useSpring(() => ({
    from: {
      backgroundColor: "#eceff1",
      color: "black"
    }
  }));

  React.useEffect(() => {
    if (isCurrentDay) return;

    if (dayCard === props.day.toLocaleLowerCase().slice(0, 3)) {
      setHovered(true);
      api.start({
        from: {
          backgroundColor: "#eceff1",
          color: "black"
        },
        to: {
          backgroundColor: "rgb(34,34,34)",
          color: "white"
        },
      });
    }
    else if (hovered) {
      setHovered(false);
      api.start({
        from: {
          backgroundColor: "rgb(34,34,34)",
          color: "white"
        },
        to: {
          backgroundColor: "#eceff1",
          color: "black"
        }
      });
    }
  }, [dayCard]);

  return (
    <div className="day-card">
      {
        isCurrentDay ?
          <div className="day-card-day-date"
          style={{backgroundColor: "#b71c1c", color: "white", opacity: moment().hours() + 1 >= 20 ? "25%" : "100%"}}>
            {
              window.innerWidth < 601 ?
                <p>{props.day} {day}/{month}</p>
                :
                <h4>{props.day} {day}/{month}</h4>
            }
          </div>
          :
          <animated.div className='day-card-day-date'
          style={{...springs, opacity: moment().isAfter(moment(currentIsoDate?.join("-"), "YYYY-MM-DD")) ? "25%" : "100%"}}>
            {
              window.innerWidth < 601 ?
                <p>{props.day} {day}/{month}</p>
                :
                <h4>{props.day} {day}/{month}</h4>
            }
          </animated.div>
      }
    </div>
  )
}

function removeLeadingZeros(s: string) {
  if (s.startsWith("0")) {
    return s.slice(1);
  }
  return s;
}

export default DayCard
