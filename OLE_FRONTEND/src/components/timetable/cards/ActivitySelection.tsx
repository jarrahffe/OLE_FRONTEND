import React from 'react'
import axios from 'axios';
import { ClickContext, DateMapContext } from '../../../contexts';
import { animated, useSpring } from '@react-spring/web';
import { TextField, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import { Activity, makeActivity } from '../../../config/activity';
import { useTheme } from '@emotion/react';

type Props = {
  day: string
  time: number
  setActivity: React.Dispatch<React.SetStateAction<Activity | undefined>>
}

const ActivitySelection = (props: Props) => {

  const { setClicked } = React.useContext(ClickContext);
  const { dateMap } = React.useContext(DateMapContext);

  const [notes, setNotes] = React.useState("");
  const [type, setType] = React.useState("lesson");
  const [bookProgress, setBookProgress] = React.useState(false);

  const currentIsoDate = dateMap.get(props.day.slice(0, 3).toLocaleLowerCase())?.split("-");
  const monthNum = (new Date().getMonth() + 1).toString()
  const monthWord = Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(monthNum));
  const dayNum = currentIsoDate?.at(2)?.charAt(1);

  const theme = useTheme();

  const [springs, api] = useSpring(() => ({
    from: {
      backgroundColor: "#eceff1",
      height: "0%",
      opacity: "0%"
    }
  }));

  // Animate -> on render
  React.useEffect(() => {
    api.start({
      from: {
        height: "0%",
        backgroundColor: "#eceff1",
        opacity: "0%"
      },
      to: {
        height: "300%",
        backgroundColor: "#eceff1",
        opacity: "100%"
      }
    });
  }, []);

  // * API call -> /add_activity *
  async function handleBook() {
    props.setActivity(makeActivity(`${props.day}:${props.time}`, type, "xu ray", props.day, props.time, notes, Math.random()));
    setBookProgress(true);
    await sleep(500);
    axios.post(`${import.meta.env.VITE_BE_API_ADD_ACTIVITY}`, {
      "type": type,
      "name": "xu ray",
      "day": props.day,
      "start_time": props.time,
      "notes": notes,
      "date": currentIsoDate?.join("-")
    },
      {
        headers: {
          "Authorization": "Token e765ab6923106944459e1752a716c34cb10e84c9"
        }
      }).then(function(response) {
        console.log(response)
        if (response.status === 200) {
          setBookProgress(false);
          props.setActivity(makeActivity(`${props.day}:{props.time}`, type, "xu ray", props.day, props.time, notes, Math.random()));
        }
      })
  }

  return (
    <animated.div className="activity-selection" style={{ ...springs }}>

      <h4 className="activity-selection-header">
        {props.day.charAt(0).toUpperCase() + props.day.slice(1)}, {monthWord} {dayNum} {":"} {props.time > 12 ? props.time % 12 : props.time}
        {props.time > 11 ? "pm" : "am"}
      </h4>

      <div
        className="activity-selection-close-button"
        onClick={() => setClicked("")}
      >
        <CloseIcon fontSize='small' htmlColor='grey' />
      </div>

      <div className="activity-selection-notes">
        <TextField
          fullWidth
          multiline
          maxRows={1}
          size="small"
          id="outlined-controlled"
          label="Notes"
          value={notes}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNotes(event.target.value);
          }}
        />
      </div>

      <div className='activity-selection-book-button'>
        {
          bookProgress ? <CircularProgress size={25} /> :
            <Button
              variant='contained'
              size='small'
              onClick={() => handleBook()}
              disableElevation
            >
              Book
            </Button>
        }
      </div>

    </animated.div>
  )
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default ActivitySelection
