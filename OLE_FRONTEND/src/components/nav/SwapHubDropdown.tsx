import { Typography } from '@mui/material'
import React from 'react'
import SwapHubDropdownItem from './SwapHubDropdownItem'
import { SwapRequest } from '../../config/SwapRequest';
import { Activity } from '../../config/activity';
import { SwapContext, UserInfoContext } from '../../contexts';

const SwapHubDropdown = () => {
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
    <>
      <Typography sx={{position: "relative", top: "2%"}}>Received</Typography>

      <div className='swaphub-dropdown-items'>
        {
          incomingSwaps.length !== 0 ?
          incomingSwaps.map(swapRequest =>
            <SwapHubDropdownItem
            id={swapRequest.id}
            name={(swapRequest.activity_1 as Activity).name}
            dateFrom={(swapRequest.activity_1 as Activity).date}
            dateTo={(swapRequest.activity_2 as Activity).date}
            timeFrom={(swapRequest.activity_1 as Activity).start_time}
            timeTo={(swapRequest.activity_2 as Activity).start_time}
            received={true}
            />
          )
          :
          <Typography sx={{color: "grey", position: "absolute", top: "25%"}}>No requests reveived</Typography>
        }
      </div>

      <Typography>Sent</Typography>

      <div className='swaphub-dropdown-items'>
        {
          outgoingSwaps.length !== 0 ?
          outgoingSwaps.map(swapRequest =>
            <SwapHubDropdownItem
            id={swapRequest.id}
            name={(swapRequest.activity_2 as Activity).name}
            dateFrom={(swapRequest.activity_1 as Activity).date}
            dateTo={(swapRequest.activity_2 as Activity).date}
            timeFrom={(swapRequest.activity_1 as Activity).start_time}
            timeTo={(swapRequest.activity_2 as Activity).start_time}
            received={false}
            />
          )
          :
          <Typography sx={{color: "grey", position: "absolute", top: "25%"}}>No requests sent</Typography>
        }
      </div>
    </>
  )
}

export default SwapHubDropdown