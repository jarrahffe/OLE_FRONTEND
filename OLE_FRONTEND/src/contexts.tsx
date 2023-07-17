import React from 'react'

type ClickContext = {
  clicked: string
  setClicked: React.Dispatch<React.SetStateAction<string>>
}

type TimeCardContext = {
  timeCard: number
  setTimeCard: React.Dispatch<React.SetStateAction<number>>
}

type DayCardContext = {
  dayCard: string
  setDayCard: React.Dispatch<React.SetStateAction<string>>
}

type DateMapContext = {
  dateMap: Map<string, string>
}

export const ClickContext = React.createContext({} as ClickContext);
export const TimeCardContext = React.createContext({} as TimeCardContext);
export const DayCardContext = React.createContext({} as DayCardContext);
export const DateMapContext = React.createContext({} as DateMapContext);
