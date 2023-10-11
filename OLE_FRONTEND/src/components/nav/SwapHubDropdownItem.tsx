import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';
import { IconButton, Typography } from '@mui/material';
import moment from 'moment';
import { AirplanemodeActiveRounded } from '@mui/icons-material';
import { animated, useSpring, useTransition } from '@react-spring/web';

type Props = {
  id: string
  name: string
  dateFrom: string
  dateTo: string
  timeFrom: number
  timeTo: number
  received: boolean
}

const SwapHubDropdownItem = (props: Props) => {

  const [hovered, setHovered] = React.useState(false);

  const [arrowSprings, arrowApi] = useSpring(() => ({
    from: {
      width: "55%",
      left: "15%"
    }
  }));

  const [acceptDeclineSprings, acceptDeclineApi] = useSpring(() => ({
    from: {
      width: "10%"
    }
  }))

  function handleMouseEnter() {
    setHovered(true);
    arrowApi.start({
      from: {
        width: "55%",
        left: "15%"
      },
      to: {
        width: "35%",
        left: "35%"
      }
    });

    acceptDeclineApi.start({
      from: {
        width: "10%",
      },
      to: {
        width: "30%",
      }
    });
  }

  function handleMouseLeave() {
    setHovered(false);
    arrowApi.start({
      from: {
        width: "45%",
        left: "25%"
      },
      to: {
        width: "55%",
        left: "15%"
      }
    });

    acceptDeclineApi.start({
      from: {
        width: "30%",
      },
      to: {
        width: "10%",
      }
    });
  }

  return props.received ? (
    <div className="swaphub-dropdown-item-received"
    onMouseEnter={() => handleMouseEnter()}
    onMouseLeave={() => handleMouseLeave()}
    style={{backgroundColor: "#dee2e6"}}
    >
      <Typography sx={{position: "absolute", top: "-40%", left: "2.5%"}}>{moment(`${props.dateTo}-${props.timeTo}`, "YYYY-MM-DD-H").format("ddd ha")}</Typography>

      <animated.div style={{...acceptDeclineSprings, backgroundColor: hovered ? "#eceff1" : ""}} className="swaphub-dropdown-item-accept-decline">
        {
          hovered ?
          <>
            <IconButton>
              <CheckCircleIcon color='success'/>
            </IconButton>

            <IconButton>
              <CancelIcon color='error'/>
            </IconButton>
          </>
          :
          <HelpIcon color='info'/>
        }
      </animated.div>

      <animated.div style={{...arrowSprings}} className='swaphub-dropdown-item-arrow'/>

      <Typography sx={{position: "absolute", top: "-40%", right: "2.5%"}}>{moment(`${props.dateFrom}-${props.timeFrom}`, "YYYY-MM-DD-H").format("ddd ha")}</Typography>
      <CheckCircleIcon sx={{position: "absolute", top: "25%", right: "20%"}} color='success'/>
      <Typography sx={{position: "absolute", top: "25%", right: "2%"}}>{props.name}</Typography>
    </div>
  )
  :
  (
    <div className="swaphub-dropdown-item-sent"
    onMouseEnter={() => handleMouseEnter()}
    onMouseLeave={() => handleMouseLeave()}
    >
      <Typography sx={{position: "absolute", top: "-40%", left: "2.5%"}}>{moment(`${props.dateFrom}-${props.timeFrom}`, "YYYY-MM-DD-H").format("ddd ha")}</Typography>
      <CheckCircleIcon sx={{position: "absolute", top: "25%", left: "5%"}} color='success'/>

      <animated.div style={{...arrowSprings}} className='swaphub-dropdown-item-arrow'/>

      <Typography sx={{position: "absolute", top: "-40%", right: "0%"}}>{moment(`${props.dateTo}-${props.timeTo}`, "YYYY-MM-DD-H").format("ddd ha")}</Typography>
      <HelpIcon sx={{position: "absolute", top: "25%", right: "20%"}} color='info'/>
      <Typography sx={{position: "absolute", top: "25%", right: "2%"}}>{props.name}</Typography>
    </div>
  )
}

export default SwapHubDropdownItem