import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';
import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import { AirplanemodeActiveRounded } from '@mui/icons-material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { animated, useSpring, useTransition } from '@react-spring/web';
import { acceptSwapRequest, cancelSwapRequest } from '../../helpers/SwapHelpers';
import { UserInfoContext } from '../../contexts';
import { Activity } from '../../config/activity';
import { SwapRequest } from '../../config/SwapRequest';
import { sleep } from '../../helpers/Sleep';

type Props = {
  id: string
  name: string
  dateFrom: string
  dateTo: string
  timeFrom: number
  timeTo: number
  received: boolean
  outgoingSwaps: SwapRequest[]
  incomingSwaps: SwapRequest[]
  setOutgoing: React.Dispatch<React.SetStateAction<SwapRequest[]>>
  setIncoming: React.Dispatch<React.SetStateAction<SwapRequest[]>>
}

const SwapHubDropdownItem = (props: Props) => {

  const [hovered, setHovered] = React.useState(false);

  const [arrowSprings, arrowApi] = useSpring(() => ({
    from: {
      width: "62.5%",
      left: "15%"
    }
  }));

  const [acceptDeclineSprings, acceptDeclineApi] = useSpring(() => ({
    from: {
      width: "10%"
    }
  }))

  const { token } = React.useContext(UserInfoContext);

  const outgoingSwaps = props.outgoingSwaps;
  const incomingSwaps = props.incomingSwaps;

  function handleMouseEnter() {
    setHovered(true);
      arrowApi.start({
        from: {
          width: "62.5%",
          left: "15%"
        },
        to: {
          width: "42.5%",
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
        width: "42.5%",
        left: "35%"
      },
      to: {
        width: "62.5%",
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

  function getLessonFrom() {
    return moment(`${props.dateFrom}-${props.timeFrom}`, "YYYY-MM-DD-H").format("ddd ha")
  }

  function getLessonTo() {
    return moment(`${props.dateTo}-${props.timeTo}`, "YYYY-MM-DD-H").format("ddd ha");
  }

  function handleCancelSwapRequest() {
    cancelSwapRequest(props.id, token);
    props.setOutgoing(outgoingSwaps.filter(o => o.id !== props.id));
    props.setIncoming(incomingSwaps.filter(o => o.id !== props.id));
  }

  function handleAcceptSwapRequest() {
    // search through all requests, all which have activity 1 as date to, call cancel
    cancelInvalidOutgoingRequests().then(swapsToKeep => {
      acceptSwapRequest(props.id, token);
      props.setIncoming(incomingSwaps.filter(o => o.id !== props.id));
      props.setOutgoing(swapsToKeep);
    });
  }

  function cancelInvalidOutgoingRequests() {
    return new Promise<SwapRequest[]>(resolve => {
      const swapsToKeep: SwapRequest[] = [];

      outgoingSwaps.forEach(swapRequest => {
        const req = swapRequest.activity_1 as Activity;
        if (req.date + req.start_time === props.dateTo + props.timeTo) {
          cancelSwapRequest(swapRequest.id, token);
        }
        else swapsToKeep.push(swapRequest);
      });

      resolve(swapsToKeep);
    })
  }

  return props.received ? (
    <Tooltip title={`${props.name} wants to swap their ${getLessonFrom()} for your ${getLessonTo()}`}>
      <div className="swaphub-dropdown-item-received"
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
      style={{backgroundColor: "#dee2e6"}}
      >
        <Typography sx={{position: "absolute", top: "-40%", left: "2.5%"}}>{getLessonTo()}</Typography>
        <Typography sx={{position: "absolute", top: "-40%", right: "2.5%"}}>{getLessonFrom()}</Typography>

        <animated.div style={{...acceptDeclineSprings, backgroundColor: hovered ? "#eceff1" : ""}} className="swaphub-dropdown-item-accept-decline">
          {
            hovered ?
            <>
              <IconButton onClick={() => handleAcceptSwapRequest()}>
                <CheckCircleIcon color='success'/>
              </IconButton>

              <IconButton onClick={() => handleCancelSwapRequest()}>
                <CancelIcon color='error'/>
              </IconButton>
            </>
            :
            <RadioButtonUncheckedIcon color='primary'/>
          }
        </animated.div>

        <animated.div style={{...arrowSprings}} className='swaphub-dropdown-item-arrow'>
          <div className='arrow-left'/>
        </animated.div>

        <CheckCircleIcon sx={{position: "absolute", top: "25%", right: "12.5%"}} color='success'/>
        <Typography sx={{position: "absolute", top: "25%", right: "5%", fontWeight: 1000}}>{props.name.substring(0,1).toUpperCase()}</Typography>
      </div>
    </Tooltip>
  )
  :
  (
    <Tooltip title={`You requested to swap ${getLessonFrom()} for ${props.name}'s ${getLessonTo()}`}>
      <div className="swaphub-dropdown-item-sent"
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
      >
        <Typography sx={{position: "absolute", top: "-40%", left: "2.5%"}}>{moment(`${props.dateFrom}-${props.timeFrom}`, "YYYY-MM-DD-H").format("ddd ha")}</Typography>
        <Typography sx={{position: "absolute", top: "-40%", right: "2.5%"}}>{moment(`${props.dateTo}-${props.timeTo}`, "YYYY-MM-DD-H").format("ddd ha")}</Typography>

          <animated.div style={{...acceptDeclineSprings, backgroundColor: hovered ? "#b71c1c" : ""}} className="swaphub-dropdown-item-accept-decline">
            {
              hovered ?
              <Button variant='text' sx={{color: "white"}} onClick={() => handleCancelSwapRequest()}>
                CANCEL
              </Button>
              :
              <CheckCircleIcon color='success'/>
            }
          </animated.div>

        <animated.div style={{...arrowSprings}} className='swaphub-dropdown-item-arrow'>
          <div className='arrow-right'/>
        </animated.div>

        <RadioButtonUncheckedIcon sx={{position: "absolute", top: "25%", right: "12.5%"}} color='primary'/>
        <Typography sx={{position: "absolute", top: "25%", right: "5%", fontWeight: 1000}}>{props.name.substring(0,1).toUpperCase()}</Typography>
      </div>
    </Tooltip>
  )
}

export default SwapHubDropdownItem