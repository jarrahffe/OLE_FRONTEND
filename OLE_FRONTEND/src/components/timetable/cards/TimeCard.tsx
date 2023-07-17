import React from 'react'
import { Box, Typography } from '@mui/material'
import { TimeCardContext } from '../../../contexts'
import { useSpring, animated } from '@react-spring/web'

type Props = {
  time: number
}

const TimeCard = (props: Props) => {

  const FONT_FROM = window.innerWidth < 601 ? "0.6rem" : "1rem";
  const FONT_TO = window.innerWidth < 601 ? "0.75rem" : "1.5rem";

  const { timeCard } = React.useContext(TimeCardContext);
  const [hovered, setHovered] = React.useState(false);

  const [springs, api] = useSpring(() => ({
    from: {
      fontWeight: "100",
      height: "8%",
      display: "flex",
      alignItems: "center",
      fontFace: "roboto",
      color: "whitesmoke",
      fontSize: FONT_FROM
    }
  }));

  React.useEffect(() => {
    if (timeCard === props.time) {
      setHovered(true);
      api.start({
        from: {
          fontWeight: "100",
          color: "whitesmoke",
          fontSize: FONT_FROM
        },
        to: {
          fontWeight: "1000",
          color: "white",
          fontSize: FONT_TO
        }
      });
    }
    else if (hovered) {
      setHovered(false);
      api.start({
        from: {
          fontWeight: "100",
          color: "white",
          fontSize: FONT_TO
        },
        to: {
          fontWeight: "100",
          color: "whitesmoke",
          fontSize: FONT_FROM
        }
      });
    }
  }, [timeCard]);

  return (
    <animated.div style={{ ...springs }}>
      {props.time}
    </animated.div>
  )
}

export default TimeCard;
