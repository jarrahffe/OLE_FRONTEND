export type Activity = {
  id: string
  ownerId: string
  type: string
  name: string
  day: string
  startTime: number
  endTime: number
  notes: string
}

export const makeActivity = (id: string, ownerId: string, type: string, name: string, day: string, startTime: number, endTime: number, notes: string): Activity => {
  const ret: Activity = {
    id: id,
    ownerId: ownerId,
    type: type,
    name: name,
    day: day,
    startTime: startTime,
    endTime: endTime,
    notes: notes
  }

  return ret;
}

export type ActivityArray = Activity[];
