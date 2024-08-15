import React from "react"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import HelpIcon from "@mui/icons-material/Help"
import { Button, IconButton, Tooltip, Typography } from "@mui/material"
import moment from "moment"
import { AirplanemodeActiveRounded } from "@mui/icons-material"
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"
import { animated, useSpring, useTransition } from "@react-spring/web"
import { acceptSwapRequest, cancelSwapRequest } from "../../helpers/SwapHelpers"
import { SwapContext, UserInfoContext } from "../../contexts"
import { Activity } from "../../config/activity"
import { SwapRequest } from "../../config/SwapRequest"
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
// import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule"
import { ChevronLeft, NavigateNext } from "@mui/icons-material"
import { sleep } from "../../helpers/Sleep"

type Props = {
  id: string
  name: string
  dateFrom: string
  dateTo: string
  timeFrom: number
  timeTo: number
  received: boolean
  outgoingSwaps: SwapRequest[]
  incomingSwaps: SwapRequest[]
  setOutgoing: React.Dispatch<React.SetStateAction<SwapRequest[]>>
  setIncoming: React.Dispatch<React.SetStateAction<SwapRequest[]>>
}

const SwapHubDropdownItem = (props: Props) => {
  const [hovered, setHovered] = React.useState(false)

  const [acceptDeclineSprings, acceptDeclineApi] = useSpring(() => ({
    from: {
      width: "0%",
    },

    to: {
      width: "26%",
    },
  }))

  const { token } = React.useContext(UserInfoContext)
  const { incomingSwapsLen, setIncomingSwapsLen } =
    React.useContext(SwapContext)

  const outgoingSwaps = props.outgoingSwaps
  const incomingSwaps = props.incomingSwaps

  function handleMouseEnter() {
    setHovered(true)
    acceptDeclineApi.start({
      from: {
        width: "0%",
      },
      to: {
        width: "26%",
      },
    })
  }

  function handleMouseLeave() {
    setHovered(false)
    acceptDeclineApi.start({
      from: {
        width: "26%",
      },
      to: {
        width: "0%",
      },
    })
  }

  function getLessonFrom() {
    return moment(`${props.dateFrom}-${props.timeFrom}`, "YYYY-MM-DD-H").format(
      "ddd ha"
    )
  }

  function getLessonTo() {
    return moment(`${props.dateTo}-${props.timeTo}`, "YYYY-MM-DD-H").format(
      "ddd ha"
    )
  }

  function handleCancelSwapRequest() {
    cancelSwapRequest(props.id, token)
    props.setOutgoing(outgoingSwaps.filter((o) => o.id !== props.id))
    props.setIncoming(incomingSwaps.filter((o) => o.id !== props.id))
    if (props.received) setIncomingSwapsLen(incomingSwapsLen - 1)
  }

  function handleAcceptSwapRequest() {
    cancelInvalidOutgoingRequests().then((outgoingSwapsToKeep) => {
      acceptSwapRequest(props.id, token)
      cancelInvalidIncomingRequests().then((incomingSwapsToKeep) => {
        props.setIncoming(incomingSwapsToKeep)
        setIncomingSwapsLen(incomingSwapsToKeep.length)
      })
      props.setOutgoing(outgoingSwapsToKeep)
    })
  }

  function cancelInvalidOutgoingRequests() {
    return new Promise<SwapRequest[]>((resolve) => {
      const swapsToKeep: SwapRequest[] = []

      outgoingSwaps.forEach((swapRequest) => {
        const req = swapRequest.activity_1 as Activity
        if (req.date + req.start_time === props.dateTo + props.timeTo) {
          cancelSwapRequest(swapRequest.id, token)
        } else swapsToKeep.push(swapRequest)
      })

      resolve(swapsToKeep)
    })
  }

  function cancelInvalidIncomingRequests() {
    return new Promise<SwapRequest[]>((resolve) => {
      const swapsToKeep: SwapRequest[] = []

      incomingSwaps.forEach((swapRequest) => {
        const req = swapRequest.activity_2 as Activity
        if (req.date + req.start_time !== props.dateTo + props.timeTo) {
          swapsToKeep.push(swapRequest)
        }
      })
      resolve(swapsToKeep)
    })
  }

  return props.received ? (
    <Tooltip
      title={`${props.name} wants to swap their ${getLessonFrom()} for your ${getLessonTo()}`}
    >
      {/* Received Card */}
      <div
        className="relative m-[2%] h-20 w-[90%] flex-shrink-0 flex-grow-0 cursor-pointer rounded-md border-2 border-slate-200 p-1"
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
        // style={{ backgroundColor: "#dee2e6" }}
      >
        {/* Top */}
        <div className="relative flex h-[30%] w-full justify-center">
          <Typography
            sx={{ fontSize: "0.75rem" }}
            className="text-right text-xs"
          >
            From {props.name}
          </Typography>
        </div>

        {/* Bottom */}
        <div className="w-full flex-col space-y-0.5 p-2">
          {/* [Bottom] top */}
          <div className="relative flex justify-start text-xs">
            <div className="">{getLessonTo()}</div>
            <div className="absolute left-[30%] top-[50%] h-[10%] w-[40%] -translate-y-1/2 transform bg-gray-400" />
            <ChevronLeft className="absolute left-[25%] top-[50%] -translate-y-1/2 transform content-center text-gray-400" />
          </div>
          {/* [Bottom] bottom */}
          <div className="relative flex justify-between text-xs">
            {hovered ? (
              <animated.div
                style={{
                  ...acceptDeclineSprings,
                  backgroundColor: hovered ? "#eceff1" : "",
                }}
                className="flex items-center justify-around rounded-lg"
              >
                <IconButton onClick={() => handleAcceptSwapRequest()}>
                  <CheckCircleIcon
                    color="success"
                    className="absolute text-xs"
                    sx={{ fontSize: "16px" }}
                  />
                </IconButton>

                <IconButton onClick={() => handleCancelSwapRequest()}>
                  <CancelIcon
                    color="error"
                    sx={{ fontSize: "16px" }}
                    className="absolute text-xs"
                  />
                </IconButton>
              </animated.div>
            ) : (
              <RadioButtonUncheckedIcon sx={{ fontSize: "16px" }} />
            )}
            <div>
              <div className="absolute right-[30%] top-[50%] h-[10%] w-[40%] -translate-y-1/2 transform bg-gray-400" />
              {hovered ? (
                <></>
              ) : (
                <NavigateNext className="absolute right-[25%] top-[50%] -translate-y-1/2 transform content-center text-gray-400" />
              )}
            </div>
            <div>{getLessonFrom()}</div>
          </div>
        </div>
      </div>
    </Tooltip>
  ) : (
    <Tooltip
      title={`You requested to swap ${getLessonFrom()} for ${props.name}'s ${getLessonTo()}`}
    >
      {/* Received Card */}
      <div
        className="relative m-[2%] h-20 w-[90%] flex-shrink-0 flex-grow-0 cursor-pointer rounded-md border-2 border-slate-200 p-1"
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
      >
        {/* Top of Card */}
        <div className="relative flex h-[30%] w-full justify-center">
          <Typography
            sx={{ fontSize: "0.75rem" }}
            className="text-right text-xs"
          >
            To {props.name}
          </Typography>
        </div>

        {/* Bottom of Card */}
        <div className="relative h-[70%] w-full flex-col space-y-0.5 p-2">
          {/* [Bottom] top */}
          <div className="relative flex justify-start text-xs">
            <div className="">{getLessonFrom()}</div>
            <div className="absolute left-[30%] top-[50%] h-[10%] w-[40%] -translate-y-1/2 transform bg-gray-400" />
            {!hovered && (
              <ChevronLeft className="absolute left-[25%] top-[50%] -translate-y-1/2 transform content-center text-gray-400" />
            )}
          </div>

          {/* [Bottom] bottom */}
          <div className="relative flex justify-between text-xs">
            {hovered ? (
              <animated.div style={{ ...acceptDeclineSprings }}>
                <button
                  onClick={() => handleCancelSwapRequest()}
                  className="absolute w-[25%] rounded-lg bg-red-700 text-white"
                >
                  Cancel
                </button>
              </animated.div>
            ) : (
              <div></div>
            )}
            <div className="absolute right-[30%] top-[50%] h-[10%] w-[40%] -translate-y-1/2 transform bg-gray-400" />
            <NavigateNext className="absolute right-[25%] top-[50%] -translate-y-1/2 transform content-center text-gray-400" />
            <div>{getLessonTo()}</div>
          </div>
        </div>
      </div>
    </Tooltip>
  )
}

export default SwapHubDropdownItem
