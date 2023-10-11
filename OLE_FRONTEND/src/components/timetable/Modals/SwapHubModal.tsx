import { Button, Typography } from '@mui/material'
import React from 'react'
import SwapHubModalItem from './SwapHubModalItem';
import CloseIcon from '@mui/icons-material/Close';
import { SwapContext, UserInfoContext } from '../../../contexts';
import { SwapRequest } from '../../../config/SwapRequest';
import { Activity } from '../../../config/activity';

const SwapHubModal = () => {

  // Clicked id = swap datefrom:dateto:timefrom:timeto
  const [clicked, setClicked] = React.useState("");
  const { setSwapHubModal } = React.useContext(SwapContext);
  const { account } = React.useContext(UserInfoContext);

  const activityIdsBelongingToUser = new Set<string>();

  const activityArray: Activity[] = JSON.parse(window.sessionStorage.getItem("data") as string);
  const swapsArray: SwapRequest[] = JSON.parse(window.sessionStorage.getItem("swaps") as string);

  activityArray.forEach(a => {
    if (a.account === account) activityIdsBelongingToUser.add(a.id);
  });

  const outgoingSwaps = swapsArray.filter(o => activityIdsBelongingToUser.has(o.activity_1 as string));
  const incomingSwaps = swapsArray.filter(o => activityIdsBelongingToUser.has(o.activity_2 as string));

  outgoingSwaps.forEach(swapRequest => {
    activityArray.forEach(activity => {
      if (swapRequest.activity_1 === activity.id) {
        swapRequest.activity_1 = activity;
      }
      else if (swapRequest.activity_2 === activity.id) {
        swapRequest.activity_2 = activity;
      }
    });
  });

  incomingSwaps.forEach(swapRequest => {
    activityArray.forEach(activity => {
      if (swapRequest.activity_1 === activity.id) {
        swapRequest.activity_1 = activity;
      }
      else if (swapRequest.activity_2 === activity.id) {
        swapRequest.activity_2 = activity;
      }
    });
  });

  return (
    <div className='swapmodal-inner' onClick={e => e.stopPropagation()}>
        <div className='swapmodal-inner-title'>
          <Typography sx={{fontSize: "1.5rem"}}>Lesson Swaps</Typography>
        </div>

        <div className='login-card-close-button'>
          <Button onClick={() => setSwapHubModal(false)}><CloseIcon htmlColor='gray'/></Button>
        </div>

        <div className="swaphubmodal-inner-content">
          <div className='swaphubmodal-inner-content-box'>

            <Typography sx={{fontSize: "1.25rem", margin: "1rem"}}>Pending</Typography>

            <div className='swaphubmodal-inner-content-items'>
              {
                outgoingSwaps.length !== 0 ?
                outgoingSwaps.map(swapRequest =>
                  <SwapHubModalItem
                  id={swapRequest.id}
                  name={(swapRequest.activity_2 as Activity).name}
                  dateFrom={(swapRequest.activity_1 as Activity).date}
                  dateTo={(swapRequest.activity_2 as Activity).date}
                  timeFrom={(swapRequest.activity_1 as Activity).start_time}
                  timeTo={(swapRequest.activity_2 as Activity).start_time}
                  incoming={false}
                  />
                )
                :
                <Typography sx={{color: "grey", position: "absolute", top: "25%"}}>No swaps pending</Typography>
              }
            </div>
          </div>

          <div className='swaphubmodal-inner-content-box'>
            <Typography sx={{fontSize: "1.25rem", margin: "1rem"}}>To review</Typography>

            <div className='swaphubmodal-inner-content-items'>
              {
                incomingSwaps.length !== 0 ?
                incomingSwaps.map(swapRequest =>
                  <SwapHubModalItem
                  id={swapRequest.id}
                  name={(swapRequest.activity_1 as Activity).name}
                  dateFrom={(swapRequest.activity_1 as Activity).date}
                  dateTo={(swapRequest.activity_2 as Activity).date}
                  timeFrom={(swapRequest.activity_1 as Activity).start_time}
                  timeTo={(swapRequest.activity_2 as Activity).start_time}
                  state={swapRequest.state}
                  incoming={true}
                  clicked={clicked}
                  setClicked={setClicked}
                  />
                )
                :
                <Typography sx={{color: "grey", position: "absolute", top: "25%"}}>No swaps to review</Typography>
              }

            </div>
          </div>
        </div>

        <div className="swaphubmodal-inner-content-cancelled">
          <div className='swaphubmodal-inner-content-box'>

            <Typography sx={{fontSize: "1.25rem", margin: "1rem"}}>Cancelled</Typography>

            <div className='swaphubmodal-inner-content-items'>
              {
                // outgoingSwaps.length !== 0 ?
                // outgoingSwaps.map(swapRequest =>
                //   <SwapHubModalItem
                //   name={(swapRequest.activity_2 as Activity).name}
                //   dateFrom={(swapRequest.activity_1 as Activity).date}
                //   dateTo={(swapRequest.activity_2 as Activity).date}
                //   timeFrom={(swapRequest.activity_1 as Activity).start_time}
                //   timeTo={(swapRequest.activity_2 as Activity).start_time}
                //   state={swapRequest.state}
                //   incoming={false}
                //   clicked={clicked}
                //   setClicked={setClicked}
                //   />
                // )
                // :
                <Typography sx={{color: "grey", position: "absolute", top: "25%"}}>No swaps cancelled</Typography>
              }
            </div>
          </div>

          <div className='swaphubmodal-inner-content-box'>
            <Typography sx={{fontSize: "1.25rem", margin: "1rem"}}>Accepted/Declined</Typography>

            <div className='swaphubmodal-inner-content-items'>
              {
                // incomingSwaps.length !== 0 ?
                // incomingSwaps.map(swapRequest =>
                //   <SwapHubModalItem
                //   name={(swapRequest.activity_1 as Activity).name}
                //   dateFrom={(swapRequest.activity_1 as Activity).date}
                //   dateTo={(swapRequest.activity_2 as Activity).date}
                //   timeFrom={(swapRequest.activity_1 as Activity).start_time}
                //   timeTo={(swapRequest.activity_2 as Activity).start_time}
                //   state={swapRequest.state}
                //   incoming={true}
                //   clicked={clicked}
                //   setClicked={setClicked}
                //   />
                // )
                // :
                <Typography sx={{color: "grey", position: "absolute", top: "25%"}}>No swaps accepted/declined</Typography>
              }

            </div>
          </div>
        </div>
    </div>


  )
}

export default SwapHubModal