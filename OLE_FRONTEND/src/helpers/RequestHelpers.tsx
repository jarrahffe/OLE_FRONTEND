import { Activity, makeActivity } from "../config/activity";
import axios from "axios";

export type RequestActivity = {
  id?: string
  type: string
  name?: string
  day: string
  start_time: number
  notes?: string
  week: number
  date: string
  user?: number
}


export type BlockTimes = {
  activities: RequestActivity[]
}

async function blockRequest(blockTimes: BlockTimes, status: Array<number>) {
  axios.post(`${import.meta.env.VITE_BE_API_BLOCK_TIMES}`, blockTimes,
    {
      headers: {
        "Authorization": "Token 8940ed69bf244a3df1ac426124cf338bebc8b91d"
      }
    }).then(async function(response) {

      if (response.status === 200) {
        const blockArr: RequestActivity[] = response.data;
        const storageData: Activity[] = JSON.parse(window.sessionStorage.getItem("data") as string);

        blockArr.forEach((activity) => {
          delete activity.user;
          storageData.push(activity as Activity)
        })

        window.sessionStorage.setItem("data", JSON.stringify(storageData));
        status[0] = response.status;
      }
    });
}

async function bookRequest(activity: RequestActivity, status: Array<number>) {

  axios.post(`${import.meta.env.VITE_BE_API_ADD_ACTIVITY}`, activity,
    {
      headers: {
        "Authorization": "Token 8940ed69bf244a3df1ac426124cf338bebc8b91d"
      }
    }).then(async function(response) {

      if (response.status === 200) {
        delete response.data.user;
        const returnedObj: Activity = response.data;

        const storageData: Activity[] = JSON.parse(window.sessionStorage.getItem("data") as string);
        storageData.push(returnedObj)

        window.sessionStorage.setItem("data", JSON.stringify(storageData));
        status[0] = response.status;
      }
    });
}


export { bookRequest, blockRequest }