export type Activity = {
  id: string
  type: string
  name: string
  day: string
  start_time: number
  notes: string
  user: number
}

export const makeActivity = (id: string, type: string, name: string, day: string, startTime: number, notes: string, user: number): Activity => {
  const ret: Activity = {
    id: id,
    type: type,
    name: name,
    day: day,
    start_time: startTime,
    notes: notes,
    user: user,
  }

  return ret;
}

export type ActivityArray = Activity[];
