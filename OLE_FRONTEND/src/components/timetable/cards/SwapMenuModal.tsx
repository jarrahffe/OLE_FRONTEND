import moment from 'moment'
import React, { CSSProperties } from 'react'
import { SwapContext, UserInfoContext } from '../../../contexts';
import { Activity } from '../../../config/activity';
import { Typography, Button } from '@mui/material';

type Props = {
  swapped: Activity|undefined
  setSwapped: React.Dispatch<React.SetStateAction<Activity | undefined>>
}

const SwapMenuModal = (props: Props) => {

  // State
  const [swappedFrom, setSwappedFrom] = React.useState<Activity>();

  // Contexts
  const {swapMenuModal, setSwapMenuModal} = React.useContext(SwapContext);
  const { account, token } = React.useContext(UserInfoContext);

  // Constants
  const userActivities = (JSON.parse(window.sessionStorage.getItem("data") as string) as Activity[]).filter(a => a.account === account && a.type === "lesson" && moment(`${a.date}-${a.start_time}`, "YYYY-MM-DD-kk").isAfter(moment())).sort((a, b) => {
    return moment(`${a.date}-${a.start_time}`, "YYYY-MM-DD-kk").isBefore(moment(`${b.date}-${b.start_time}`, "YYYY-MM-DD-kk")) ? -1 : 1;
  });

  function getActivityDate(activity: Activity) {
      return `${moment((activity as Activity).date).format("ddd Do MMM")}, ${(activity as Activity).start_time > 12 ? (activity as Activity).start_time % 12 : (activity as Activity).start_time}${(activity as Activity).start_time > 11 ? "pm" : "am"}`;
  }

  function handleConfirm() {
    
  }

  return (
      <div className='swapmodal-inner' onClick={e => e.stopPropagation()}>

        <Typography sx={{fontSize: "1.5rem"}}>
        Make a swap request
        </Typography>


        <div className='swapmodal-inner-content'>

          <div className='swapmodal-inner-content-lessons' >

            <Typography sx={{fontSize: "1.25rem", position: "relative", top: "9%"}}>
              My Lessons
            </Typography>

            <div className='swapmodal-inner-content-lessons-items'>
              { userActivities.map(activity => <Button onClick={() => setSwappedFrom(activity)} sx={{margin: "1%"}} variant='contained' color='secondary' fullWidth>{moment(activity.date).format("ddd Do MMM")}, {activity.start_time > 12 ? activity.start_time % 12 : activity.start_time}{activity.start_time > 11 ? "pm" : "am"}</Button>)}
            </div>
          </div>

          <div className='swapmodal-inner-content-swaphub'>
            <Typography sx={{fontSize: "1.25rem"}}>
              Swap
            </Typography>

            <Button sx={{margin: "2%"}} variant={swappedFrom ? "contained" : "outlined"} color='secondary'>{ swappedFrom ? getActivityDate(swappedFrom) : "Select a lesson"}</Button>

            <Typography sx={{fontSize: "1.25rem"}}>
              With
            </Typography>

            <Button sx={{margin: "2%"}} variant='contained' color='secondary' >{getActivityDate(props.swapped as Activity)}</Button>
          </div>

        </div>

        <div style={{display: "flex", justifyContent: "space-evenly",  width: "60%"}}>
          <Button variant='contained' color='error' onClick={() => setSwapMenuModal(false)}>
            Cancel
          </Button>

          <Button variant='contained' color='info' onClick={() => handleConfirm()}>
            Confirm
          </Button>
        </div>

      </div>
  )
}


export default SwapMenuModal