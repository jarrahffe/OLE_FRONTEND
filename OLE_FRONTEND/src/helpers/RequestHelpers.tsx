import { Activity } from "../config/activity";
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
  account?: number
}

export type BlockTimes = {
  activities: RequestActivity[]
}

async function blockRequest(blockTimes: BlockTimes, status: Array<number>, token: string) {
  axios.post(`${import.meta.env.VITE_BE_API_BLOCK_TIMES}`, blockTimes,
    {
      headers: {
        "Authorization": `Token ${token}`
      }
    }).then(async function(response) {

      if (response.status === 200) {
        const blockArr: RequestActivity[] = response.data;
        const storageData: Activity[] = JSON.parse(window.sessionStorage.getItem("data") as string);

        blockArr.forEach((activity) => {
          delete activity.account;
          storageData.push(activity as Activity)
        })

        window.sessionStorage.setItem("data", JSON.stringify(storageData));
        status[0] = response.status;
      }
    });
}

async function bookRequest(activity: RequestActivity, status: Array<number>, token: string, setBookProgress: Function = () => {}, setClicked: Function = () => {}) {

  axios.post(`${import.meta.env.VITE_BE_API_ADD_ACTIVITY}`, activity,
    {
      headers: {
        "Authorization": `Token ${token}`
      }
    }).then(async function(response) {

      if (response.status === 200) {
        const returnedObj: Activity = response.data;

        const storageData: Activity[] = JSON.parse(window.sessionStorage.getItem("data") as string);
        storageData.push(returnedObj)

        window.sessionStorage.setItem("data", JSON.stringify(storageData));
        status[0] = response.status;
      }
      await sleep(750);
      setBookProgress(false);
      setClicked("");
    });
}

export type RegisterResponse = {
  first_name: string
  last_name: string
  email: string
  response?: string
  token: string
  rememberMe: boolean
}


async function register(firstName: string, lastName: string, email: string, password: string) {
  const registerObj = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
    password2: password
  }
  axios.post(`${import.meta.env.VITE_BE_API_REGISTER}`, registerObj).then(response => {
    const res: RegisterResponse = response.data;
    console.log(response.data);
    window.localStorage.setItem("user", JSON.stringify(res));
    location.reload()
  });
}

function login(email: string, password: string, error: Function, rememberMe: boolean) {
  const loginObj = {
    username: email,
    password: password
  }

  axios.post(`${import.meta.env.VITE_BE_API_LOGIN}`, loginObj).then(response => {
    if (response.status === 200) {
      const res: RegisterResponse = response.data;
      res.rememberMe = rememberMe;
      console.log(res)
      window.localStorage.setItem("user", JSON.stringify(res));
      location.reload();
    }
    else {
      console.log(response.status)
    }
  });
}


async function deleteActivity(id: string, token: string) {

  let storageData: Activity[] = JSON.parse(window.sessionStorage.getItem("data") as string);
  storageData = storageData.filter(o => o.id !== id);
  window.sessionStorage.setItem("data", JSON.stringify(storageData));

  axios.delete(`${import.meta.env.VITE_BE_API_DELETE_ACTIVITY}`, {
    headers: {
      "Authorization": `Token ${token}`
    },
    params: {
      id: id
    }
  });
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export { bookRequest, blockRequest, register, login, deleteActivity }