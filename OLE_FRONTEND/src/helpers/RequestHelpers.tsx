import { Activity } from "../config/activity";
import axios from "axios";
import { sleep } from "./Sleep";

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

async function blockRequest(blockTimes: BlockTimes, token: string) {
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
          storageData.push(activity as Activity)
        })

        window.sessionStorage.setItem("data", JSON.stringify(storageData));
      }
    });
}

async function bookRequest(
  activity: RequestActivity,
  token: string,
  setBookProgress: Function = () => {},
  setClicked: Function = () => {},
  setTooltipActive: Function = () => {}
  ) {

  axios.post(
    `${import.meta.env.VITE_BE_API_ADD_ACTIVITY}`,
    activity,
    {
      headers: {
        "Authorization": `Token ${token}`
      }
    }
  ).then(async function(response) {

    let sleepTime = 750;

    if (response.data[0] === "Error: this time has already taken") {
      sleepTime += 1000;
      setTooltipActive(true);
      setTimeout(() => {
        setTooltipActive(false);
        location.reload();
      }, sleepTime);
    }

    else if (response.status === 200) {
      const returnedObj: Activity = response.data;
      const storageData: Activity[] = JSON.parse(window.sessionStorage.getItem("data") as string);
      storageData.push(returnedObj)
      window.sessionStorage.setItem("data", JSON.stringify(storageData));
    }

    await sleep(sleepTime);
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


async function register(
firstName: string,
lastName: string,
email: string,
password: string,
setTooltipActive: Function) {

  const registerObj = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
    password2: password
  }

  axios.post(`${import.meta.env.VITE_BE_API_REGISTER}`, registerObj).then(response => {
    if (response.data.email && response.data.email[0] === "account with this email already exists.") {
      setTooltipActive();
    }
    else {
      const res: RegisterResponse = response.data;
      window.localStorage.setItem("user", JSON.stringify(res));
      location.reload()
    }
  });
}

function login(email: string, password: string, rememberMe: boolean, setTooltipActive: Function) {
  const loginObj = {
    username: email,
    password: password
  }

  axios.post(`${import.meta.env.VITE_BE_API_LOGIN}`, loginObj).then(response => {
    if (response.status === 200) {
      const res: RegisterResponse = response.data;
      res.rememberMe = rememberMe;
      window.localStorage.setItem("user", JSON.stringify(res));
      location.reload();
    }
  }).catch(() => {
    setTooltipActive();
  });
}


async function deleteActivity(id: string, token: string) {

  console.log(id)

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

export { bookRequest, blockRequest, register, login, deleteActivity }