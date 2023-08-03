import React from 'react';
import { DateMapContext } from '../../../contexts';
import { Typography } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';
import { DayCardContext } from '../../../contexts';

type Props = {
  day: string
}

const DATE_FONT_SIZE = window.innerWidth < 601 ? "" : "h6";

const DayCard = (props: Props) => {

  const { dayCard, setDayCard } = React.useContext(DayCardContext);
  const [hovered, setHovered] = React.useState(false);
  const { dateMap } = React.useContext(DateMapContext);

  const currentIsoDate = dateMap.get(props.day.slice(0, 3).toLocaleLowerCase())?.split("-");
  const day = removeLeadingZeros(currentIsoDate?.at(2) as string)
  const month = removeLeadingZeros(currentIsoDate?.at(1) as string)


  const [springs, api] = useSpring(() => ({
    from: {
      backgroundColor: "#eceff1",
      boxShadow: "2px 2px 3px #cfd8dc",
      color: "black"
    }
  }));

  React.useEffect(() => {
    if (dayCard === props.day.toLocaleLowerCase().slice(0, 3)) {
      setHovered(true);
      api.start({
        from: {
          backgroundColor: "#eceff1",
          boxShadow: "2px 2px 3px #cfd8dc",
          color: "black"
        },
        to: {
          backgroundColor: "#1e88e5",
          boxShadow: "3px 3px 5px #90a4ae",
          color: "white"
        },
      });
    }
    else if (hovered) {
      setHovered(false);
      api.start({
        from: {
          backgroundColor: "#1e88e5",
          boxShadow: "3px 3px 5px #90a4ae",
          color: "white"
        },
        to: {
          backgroundColor: "#eceff1",
          boxShadow: "2px 2px 3px #cfd8dc",
          color: "black"
        }
      });
    }
  }, [dayCard]);

  return (
    <div className="day-card">
      <animated.div className='day-card-day-date' style={{ ...springs }}>
        {
          window.innerWidth < 601 ?
            <p>{props.day} {day}/{month}</p>
            :
            <h4>{props.day} {day}/{month}</h4>
        }
      </animated.div>
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
