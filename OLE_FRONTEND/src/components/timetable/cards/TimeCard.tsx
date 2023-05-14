import React from 'react'

type Props = {
  time: number
}

const TimeCard = (props: Props) => {
  return (
    <div className="time-card">
      <h3>{props.time}</h3>
    </div>
  )
}

export default TimeCard;
