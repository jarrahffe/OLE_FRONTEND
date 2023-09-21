import moment from 'moment'
import React, { CSSProperties } from 'react'
import { SwapContext, UserInfoContext } from '../../../contexts';
import { Activity } from '../../../config/activity';
import { Typography, Button, Tooltip } from '@mui/material';
import { createSwapRequest } from '../../../helpers/SwapHelpers';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


type Props = {
  swapped: Activity|undefined
  setSwapped: React.Dispatch<React.SetStateAction<Activity | undefined>>
}

const SwapMenuModal = (props: Props) => {

  // State
  const [swappedFrom, setSwappedFrom] = React.useState<Activity>();
  const [bookProgress, setBookProgress] = React.useState(false);
  const [bookTooltip, setBookTooltip] = React.useState(false);
  const [bookTooltipError, setBookTooltipError] = React.useState(false);

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
    if (!swappedFrom) {
      setBookTooltipError(true);
      setTimeout(() => {
        setBookTooltipError(false);
      }, 2000);
    }
    else {
      setBookProgress(true);
      createSwapRequest((swappedFrom as Activity).id, (props.swapped as Activity).id, token, setBookProgress, setBookTooltip);
    }
  }

  return (
      <div className='swapmodal-inner' onClick={e => e.stopPropagation()}>

        <div className='login-card-close-button'>
          <Button onClick={() => setSwapMenuModal(false)}><CloseIcon htmlColor='gray'/></Button>
        </div>

        <div className='swapmodal-inner-title'>
          <Typography sx={{fontSize: "1.5rem"}}> Make a swap request </Typography>
        </div>


        <div className='swapmodal-inner-content'>

          <div className='swapmodal-inner-content-lessons' >

            <Typography sx={{fontSize: "1.25rem", position: "relative", top: "11.5%"}}>
              My Lessons
            </Typography>

            <div className='swapmodal-inner-content-lessons-items'>
              { userActivities.map(activity => <Button onClick={() => setSwappedFrom(activity)} sx={{margin: "5%"}} variant='contained' color='secondary' fullWidth>{moment(activity.date).format("ddd Do MMM")}, {activity.start_time > 12 ? activity.start_time % 12 : activity.start_time}{activity.start_time > 11 ? "pm" : "am"}</Button>)}
            </div>
          </div>

          <div className='swapmodal-inner-content-swaphub'>
            <Typography sx={{fontSize: "1.25rem"}}>
              Swap
            </Typography>

            <Button
            sx={{margin: "2%"}}
            variant={swappedFrom ? "contained" : "outlined"}
            color='secondary'
            >
              { swappedFrom ? getActivityDate(swappedFrom) : "Select a lesson" }
            </Button>

            <Typography sx={{fontSize: "1.25rem"}}>
              With {(props.swapped as Activity).name}
            </Typography>

            <Button sx={{margin: "2%"}} variant='contained' color='secondary' >{getActivityDate(props.swapped as Activity)}</Button>
          </div>

        </div>

        <Tooltip
          PopperProps={{
            disablePortal: true,
          }}
          open={bookTooltip || bookTooltipError}
          placement='top'
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={bookTooltip ? "Swap request created successfully!" : "Please select a lesson"}
        >
          {
            bookTooltip ?
            <CheckCircleOutlineIcon
            htmlColor="#388e3c"
            fontSize='large'/>
            :
            <LoadingButton
            loading={bookProgress}
            variant='contained'
            color='info'
            size='large'
            onClick={() => handleConfirm()}
            disableElevation
            >
              Request
            </LoadingButton>
          }
        </Tooltip>

      </div>
  )
}


export default SwapMenuModal