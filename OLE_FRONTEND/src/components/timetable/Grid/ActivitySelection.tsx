import React from 'react'
import { ClickContext, DateMapContext, UserInfoContext, WeekContext } from '../../../contexts';
import { TextField, Button, CircularProgress, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close'
import { Activity } from '../../../config/activity';
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
  const [tooltipActive, setTooltipActive] = React.useState(false);

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

    bookRequest(bookObj, token, setBookProgress, setClicked, setTooltipActive);
  }

  React.useEffect(() => {
    return () => props.setName(firstName)
  }, [])

  function handleSubmit() {
    if (props.name === "" || !token) {
      setTooltipActive(true);
      setTimeout(() => {
        setTooltipActive(false);
      }, 1000);
    }
    else handleBook();
  }

  function getTooltipMessage() {
    if (!token) return "Please log in or become a student";
    else if (props.name === "") return "Please enter your name";
    else return "This time is already taken";
  }

  return (
    <>
      <h4 className="activity-selection-header">
        {props.day.charAt(0).toUpperCase() + props.day.slice(1)}, {monthWord} {dayNum}{":"} {props.time > 12 ? props.time % 12 : props.time}
        {props.time > 11 ? "pm" : "am"}
      </h4>

      <div className="activity-selection-close-button"
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
          onKeyDown={e => {
            if (e.key === "Enter") e.preventDefault(), handleSubmit();
          }}
        />
      </div>

      <div className='activity-selection-book-button'>
        <Tooltip
          PopperProps={{
            disablePortal: true,
          }}
          open={tooltipActive}
          placement='top'
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={getTooltipMessage()}
        >
          <LoadingButton
            loading={bookProgress}
            variant='contained'
            color='secondary'
            size='small'
            onClick={() => handleSubmit()}
            disableElevation
            >
            Book
          </LoadingButton>
        </Tooltip>
      </div>
    </>
  )
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default ActivitySelection
