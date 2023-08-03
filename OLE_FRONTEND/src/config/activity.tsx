export type Activity = {
  id: string
  type: string
  name: string
  day: string
  start_time: number
  notes: string
  week: number
  date: string
}

export const makeActivity = (id: string, type: string, name: string, day: string, startTime: number, notes: string, week: number, date: string): Activity => {
  const ret: Activity = {
    id: id,
    type: type,
    name: name,
    day: day,
    start_time: startTime,
    notes: notes,
    week: week,
    date: date
  }
  return ret;
}

export type ActivityArray = Activity[];
