import { IconButton, Typography } from '@mui/material'
import LyricsRoundedIcon from '@mui/icons-material/LyricsRounded';
import React from 'react'

const StudioRadialMenu = () => {

  const[radialWheel, setRadialWheel] = React.useState(false);
  const testnames = ["Dominic", "Xuray", "Jess", "Jimmy"];
  const styles: string[][] = [];

  for (let i = 0; i < testnames.length; ++i) {
    let angle = i * Math.PI / testnames.length;
    let top = (Math.sin(angle)) + 'em';
    let left = (Math.cos(angle)) + 'em';
    styles.push([top, left]);
  }

  console.log(styles);

  return (
    null
    // <div className='studio-radial-menu-base'
    // onMouseEnter={() => setRadialWheel(true)}
    // onMouseLeave={() => setRadialWheel(false)}>

    //   <IconButton onClick={() => null} >
    //     <LyricsRoundedIcon htmlColor='lightgray'/>
    //   </IconButton>

    //   {
    //     radialWheel ?
    //     <div className='studio-radial-menu-wheel'>
    //       {
    //         testnames.map((name, i) => {
    //           // const top = styles[i][0];
    //           // const left = styles[i][1];
    //           return <div style={{position: "absolute", transformOrigin: "150%", transform: `rotate(calc(360deg / ${testnames.length} * var(--i)))`}}><Typography>{name}</Typography></div>
    //         })
    //       }
    //     </div>
    //     :
    //     null
    //   }
    // </div>
  )
}

export default StudioRadialMenu