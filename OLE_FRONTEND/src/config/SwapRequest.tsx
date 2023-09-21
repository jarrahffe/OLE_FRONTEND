import { Activity } from "./activity"

export type SwapRequest = {
  id: string
  activity_1: string|Activity
  activity_2: string|Activity
  state: number
}