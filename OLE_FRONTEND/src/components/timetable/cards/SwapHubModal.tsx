import { Typography } from '@mui/material'
import React from 'react'
import SwapHubModalItem from './SwapHubModalItem';

const SwapHubModal = () => {

  // Clicked id = swap datefrom:dateto:timefrom:timeto
  const [clicked, setClicked] = React.useState("");

  function handleSubmit() {

  }

  return (
    <div className='swapmodal-inner' onClick={e => e.stopPropagation()}>
        <Typography sx={{fontSize: "1.5rem"}}>Lesson Swaps</Typography>

        <div className="swaphubmodal-inner-content">
          <div className='swaphubmodal-inner-content-box'>
            <Typography sx={{fontSize: "1.25rem", margin: "1rem"}}>Pending</Typography>
            <div className='swaphubmodal-inner-content-items'>
              <SwapHubModalItem name='Xu Cock Tjhin' dateFrom='19/9' dateTo='20/9' timeFrom={9} timeTo={10} clicked={clicked} setClicked={setClicked}/>
              <SwapHubModalItem name='Xu Cock Tjhin' dateFrom='12/9' dateTo='20/9' timeFrom={9} timeTo={10} clicked={clicked} setClicked={setClicked}/>
              <SwapHubModalItem name='Xu Cock Tjhin' dateFrom='11/9' dateTo='20/9' timeFrom={9} timeTo={10} clicked={clicked} setClicked={setClicked}/>
              <SwapHubModalItem name='Xu Cock Tjhin' dateFrom='15/9' dateTo='20/9' timeFrom={9} timeTo={10} clicked={clicked} setClicked={setClicked}/>
            </div>
          </div>

          <div className='swaphubmodal-inner-content-box'>
            <Typography sx={{fontSize: "1.25rem", margin: "1rem"}}>To review</Typography>

            <div className='swaphubmodal-inner-content-items'>

            </div>
          </div>
        </div>
    </div>


  )
}

export default SwapHubModal