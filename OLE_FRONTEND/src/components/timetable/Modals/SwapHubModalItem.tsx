import React from 'react'
import moment from 'moment';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button, ThemeProvider, Typography, createTheme } from '@mui/material';
import { animated, useSpring, useTransition } from '@react-spring/web';
import { acceptSwapRequest, cancelSwapRequest } from '../../../helpers/SwapHelpers';
import { UserInfoContext } from '../../../contexts';

type Props = {
  id: string
  name: string
  dateFrom: string
  dateTo: string
  timeFrom: number
  timeTo: number
  incoming: boolean
}

const SwapHubModalItem = (props: Props) => {

  const [hovered, setHovered] = React.useState(false);

  const { token } = React.useContext(UserInfoContext);

  const timeFrom = props.timeFrom > 12 ? props.timeFrom % 12 : props.timeFrom;
  const timeTo = props.timeTo > 12 ? props.timeTo % 12 : props.timeTo;
  const timeFromAmPm = props.timeFrom < 12 ? "am" : "pm";
  const timeToAmPm = props.timeTo < 12 ? "am" : "pm";

  const id = `${props.dateFrom}${props.dateTo}${props.timeFrom}${props.timeTo}`;
  const body = `${moment(props.dateFrom, "YYYY-MM-DD").format("D/M")}: ${timeFrom}${timeFromAmPm} > ${moment(props.dateTo, "YYYY-MM-DD").format("D/M")}: ${timeTo}${timeToAmPm}`;

  const theme = createTheme({
    palette: {
      error: {
        main: "#b71c1c"
      },
      success: {
        main: "#4caf50"
      }
    }
  });

  const [springs, api] = useSpring(() => ({
    from: {
      rotateZ: "0deg"
    }
  }));

  function handleClick() {
    if (props.clicked === id) {
      props.setClicked("");
      api.start({
        from: {
          rotateZ: "180deg"
        },
        to: {
          rotateZ: "0deg"
        }
      })
    }
    else {
      props.setClicked(id);
      api.start({
        from: {
          rotateZ: "0deg"
        },
        to: {
          rotateZ: "180deg"
        }
      })
    }
  }

  const transition = useTransition(props.clicked === id, {
    from: {
      height: "0%",
    },
    enter: {
      height: "40%",
    },
    leave: {
      height: "0%",
    },
  });

  function handleAcceptRequest() {
    acceptSwapRequest(props.id, token);
  }

  function handleCancelRequest() {
    cancelSwapRequest(props.id, token);
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <div
        className='swaphubmodal-item'
        onClick={() => handleClick()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderBottomLeftRadius: props.clicked === id ? "0" : "0.25rem",
          borderBottomRightRadius: props.clicked === id ? "0" : "0.25rem",
          backgroundColor: hovered ? "#13579b" : "#1976d2"
        }}
        >
          <Typography sx={{color: "white", fontSize: "1rem"}}>{props.name}</Typography>

          <animated.div style={{...springs, position: "absolute", right: "5%", top: "25%", height: "50%"}}>
            <KeyboardArrowDownIcon htmlColor='white'/>
          </animated.div>
        </div>

        { transition((style, clicked) =>
          clicked ?
            <animated.div
            style={{...style, bottom: "1rem", borderTopRightRadius: "0", borderTopLeftRadius: "0"}}
            className='swaphubmodal-item'
            >
              <Typography sx={{fontWeight: 1000, color: "white", opacity: props.clicked === id ? "100%" : "0%", position: "relative", bottom: "10%"}}>{body}</Typography>
                {
                  props.incoming ?
                  <div className='swaphubmodal-item-actions'>
                    <Button
                    variant='contained'
                    size='small'
                    color="error"
                    onClick={() => handleCancelRequest()}
                    sx={{
                      opacity: props.clicked === id ? "100%" : "0%", position: "relative", bottom: "10%"
                    }}>
                      DECLINE
                    </Button>

                    <Button
                    variant='contained'
                    size='small'
                    color="success"
                    onClick={() => handleAcceptRequest()}
                    sx={{
                      opacity: props.clicked === id ? "100%" : "0%",
                      position: "relative",
                      bottom: "10%",
                      color: "white"
                    }}>
                      ACCEPT
                    </Button>

                  </div>
                  :
                  <Button
                  variant='contained'
                  size='small' color="error"
                  onClick={() => handleCancelRequest()}
                  sx={{
                    opacity: props.clicked === id ? "100%" : "0%", position: "relative", bottom: "10%"
                  }}>
                    CANCEL
                  </Button>
                }
            </animated.div>
          :
          null)
        }
      </ThemeProvider>
    </>

  )
}

export default SwapHubModalItem