import axios from "axios";
import { SwapRequest } from "../config/SwapRequest";
import { sleep } from "./Sleep";


function createSwapRequest(
  id1: string, id2: string, token: string,
  setBookProgress: Function, setErrorTooltipActive: Function,
  setBookFeedbackIcon: Function,
  setSwapMenuModal: Function, setSwappedFrom: Function, setSwappedTo: Function) {

  let swapData: SwapRequest[] = JSON.parse(window.sessionStorage.getItem("swaps") as string);

  axios.post(`${import.meta.env.VITE_BE_API_CREATE_SWAP_REQUEST}`,
  {
    activity_1: id1,
    activity_2: id2
  },
  {
    headers: {
      "Authorization": `Token ${token}`
    }
  }).then(async response => {

    const newRequest: SwapRequest = response.data;
    swapData.push(newRequest);
    window.sessionStorage.setItem("swaps", JSON.stringify(swapData));

    await sleep(750);
    setBookProgress(false);

    setBookFeedbackIcon("success");
    setTimeout(() => {
      setBookFeedbackIcon("");
      setSwapMenuModal(false);
      setSwappedFrom(undefined);
      setSwappedTo(undefined);
    }, 2000);

  }).catch(async () => {
    await sleep(750);
    setBookProgress(false);

    setErrorTooltipActive(true);
    setBookFeedbackIcon("error");
    setTimeout(() => {
      setErrorTooltipActive(false);
      setBookFeedbackIcon("");
      setSwappedTo(undefined);
      location.reload();
    }, 3000);
  })
}

function acceptSwapRequest(id: string, token: string) {
  let swapData: SwapRequest[] = JSON.parse(window.sessionStorage.getItem("swaps") as string);
  axios.get(`${import.meta.env.VITE_BE_API_ACCEPT_SWAP_REQUEST}`, {
    headers: {
      "Authorization": `Token ${token}`
    },
    params: {
      id: id
    }
  }).then(() => {
    swapData = swapData.filter(o => o.id !== id);
    window.sessionStorage.setItem("swaps", JSON.stringify(swapData));
  })
}

async function cancelSwapRequest(id: string, token: string) {
  let swapData: SwapRequest[] = JSON.parse(window.sessionStorage.getItem("swaps") as string);
  axios.delete(`${import.meta.env.VITE_BE_API_CANCEL_SWAP_REQUEST}`,
  {
    headers: {
      "Authorization": `Token ${token}`
    },
    params: {
      id: id
    },
  }).then(() => {
    swapData = swapData.filter(o => o.id !== id);
    window.sessionStorage.setItem("swaps", JSON.stringify(swapData));
  })
}

export { createSwapRequest, acceptSwapRequest, cancelSwapRequest }