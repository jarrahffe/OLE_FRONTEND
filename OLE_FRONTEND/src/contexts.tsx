import React from 'react'
import { Activity } from './config/activity'

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
  setDateMap: React.Dispatch<React.SetStateAction<Map<string, string>>>
}

type WeekContext = {
  selectedWeek: number
  setSelectedWeek: React.Dispatch<React.SetStateAction<number>>
}


type MultiSelectContext = {
  blockSelect: boolean
  setBlockSelect: React.Dispatch<React.SetStateAction<boolean>>
  eventSelect: boolean
  setEventSelect: React.Dispatch<React.SetStateAction<boolean>>
  multiActivities: Map<Activity, Function> | undefined
  setMultiActivities: React.Dispatch<React.SetStateAction<Map<Activity, Function> | undefined>>
  multiSelectModal: boolean
  setMultiSelectModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ClickContext = React.createContext({} as ClickContext);
const TimeCardContext = React.createContext({} as TimeCardContext);
const DayCardContext = React.createContext({} as DayCardContext);
const DateMapContext = React.createContext({} as DateMapContext);
const WeekContext = React.createContext({} as WeekContext);
const MultiSelectContext = React.createContext({} as MultiSelectContext)

export {
  ClickContext,
  TimeCardContext,
  DayCardContext,
  DateMapContext,
  WeekContext,
  MultiSelectContext
}
