import React from 'react'

type Props = {
  day: string
}

const DayCard = (props: Props) => {
  return (
    <div className="day-card">
      <h3>{props.day}</h3>
    </div>
  )
}

export default DayCard
