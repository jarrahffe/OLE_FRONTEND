import React from 'react'
import axios from 'axios';
import { ClickContext, DateMapContext, UserInfoContext, WeekContext } from '../../../contexts';
import { TextField, Button, CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close'
import { Activity, makeActivity } from '../../../config/activity';
import moment from 'moment';
import { RequestActivity, bookRequest } from '../../../helpers/RequestHelpers';

type Props = {
  day: string
  time: number
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  setActivity: React.Dispatch<React.SetStateAction<Activity | undefined>>
}

const ActivitySelection = (props: Props) => {

  const { setClicked } = React.useContext(ClickContext);
  const { dateMap } = React.useContext(DateMapContext);
  const { selectedWeek } = React.useContext(WeekContext);
  const { token } = React.useContext(UserInfoContext)
  const [type, setType] = React.useState("lesson");
  const [bookProgress, setBookProgress] = React.useState(false);

  // The actual name retrieved? from window cookies
  const { firstName } = React.useContext(UserInfoContext);

  const currentIsoDate = dateMap.get(props.day.slice(0, 3).toLocaleLowerCase()) as string;
  const momentDate = moment(currentIsoDate, "YYYY-MM-DD");
  const monthWord = momentDate.format("MMM");
  const dayNum = momentDate.format("D");

  // * API call -> /add_activity *
  async function handleBook() {
    setBookProgress(true);

    const bookObj: RequestActivity = {
      name: props.name,
      type: type,
      day: props.day,
      date: currentIsoDate,
      start_time: props.time,
      week: selectedWeek,
    }

    const status: Array<number> = [];
    bookRequest(bookObj, status, token, setBookProgress, setClicked);
  }

  React.useEffect(() => {
    return () => props.setName(firstName)
  }, [])

  return (
    <>
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
          label="Name"
          value={props.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            props.setName(event.target.value);
          }}
        />
      </div>

      <div className='activity-selection-book-button'>
            <LoadingButton
              loading={bookProgress}
              variant='contained'
              color='secondary'
              size='small'
              onClick={() => handleBook()}
              disableElevation
            >
              Book
            </LoadingButton>
      </div>
    </>
  )
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default ActivitySelection
