import React from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button, ThemeProvider, Typography, createTheme } from '@mui/material';
import { animated, useSpring, useTransition } from '@react-spring/web';

type Props = {
  name: string
  dateFrom: string
  dateTo: string
  timeFrom: number
  timeTo: number
  clicked: string
  setClicked: React.Dispatch<React.SetStateAction<string>>
}

const SwapHubModalItem = (props: Props) => {

  const id = `${props.dateFrom}${props.dateTo}${props.timeFrom}${props.timeTo}`;
  const body = `${props.dateFrom}: ${props.timeFrom} -> ${props.dateTo}: ${props.timeTo}`;
  const theme = createTheme({
    palette: {
      error: {
        main: "#b71c1c"
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
      height: "25%",
    },
    leave: {
      height: "0%",
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <div
        className='swaphubmodal-item'
        onClick={() => handleClick()}
        style={{
          borderBottomLeftRadius: props.clicked === id ? "0" : "0.25rem",
          borderBottomRightRadius: props.clicked === id ? "0" : "0.25rem"
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
              <Button variant='contained' size='small' color="error" sx={{opacity: props.clicked === id ? "100%" : "0%", position: "relative", bottom: "10%"}}>CANCEL</Button>
            </animated.div>
          :
          null)
        }
      </ThemeProvider>
    </>

  )
}

export default SwapHubModalItem