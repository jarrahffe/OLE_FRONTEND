export type Activity = {
  id: string
  type: string
  name: string
  day: string
  start_time: number
  week: number
  date: string
  account: number
}

export const makeActivity = (id: string, type: string, name: string, day: string, startTime: number, notes: string, week: number, date: string, account: number): Activity => {
  const ret: Activity = {
    id: id,
    type: type,
    name: name,
    day: day,
    start_time: startTime,
    week: week,
    date: date,
    account: account
  }
  return ret;
}

export type ActivityArray = Activity[];
