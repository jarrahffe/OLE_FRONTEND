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

  const [arrowSprings, arrowApi] = useSpring(() => ({
    from: {
      width: "62.5%",
      left: "15%",
    },
  }))

  const [acceptDeclineSprings, acceptDeclineApi] = useSpring(() => ({
    from: {
      width: "0%",
    },
  }))

  const { token } = React.useContext(UserInfoContext)
  const { incomingSwapsLen, setIncomingSwapsLen } =
    React.useContext(SwapContext)

  const outgoingSwaps = props.outgoingSwaps
  const incomingSwaps = props.incomingSwaps

  function handleMouseEnter() {
    setHovered(true)
    arrowApi.start({
      from: {
        width: "62.5%",
        left: "15%",
      },
      to: {
        width: "42.5%",
        left: "35%",
      },
    })
    acceptDeclineApi.start({
      from: {
        width: "10%",
      },
      to: {
        width: "26%",
      },
    })
  }

  function handleMouseLeave() {
    setHovered(false)
    arrowApi.start({
      from: {
        width: "42.5%",
        left: "35%",
      },
      to: {
        width: "62.5%",
        left: "15%",
      },
    })

    acceptDeclineApi.start({
      from: {
        width: "30%",
      },
      to: {
        width: "10%",
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
        className="relative m-[2%] h-[50%] w-[90%] flex-shrink-0 flex-grow-0 cursor-pointer rounded-md border-2 bg-gray-200 p-1"
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
        style={{ backgroundColor: "#dee2e6" }}
      >
        {/* Top of Card */}
        <div className="relative flex h-[35%] w-full flex-nowrap justify-around">
          <Typography>{getLessonTo()}</Typography>
          <Typography>{getLessonFrom()}</Typography>
        </div>

        {/* Bottom of Card */}
        <div className="relative h-[65%] w-full flex-col p-2">
          {/* [Bottom] top */}
          <div className="relative flex justify-start text-xs">
            <animated.div
              style={{
                ...acceptDeclineSprings,
                backgroundColor: hovered ? "#eceff1" : "",
              }}
              className="flex items-center justify-around rounded-lg"
            >
              {hovered ? (
                <>
                  <IconButton onClick={() => handleAcceptSwapRequest()}>
                    <CheckCircleIcon
                      color="success"
                      className="absolute text-xs"
                    />
                  </IconButton>

                  <IconButton onClick={() => handleCancelSwapRequest()}>
                    <CancelIcon color="error" className="absolute text-xs" />
                  </IconButton>
                </>
              ) : (
                <div>YOU</div>
              )}
            </animated.div>

            <div className="absolute left-[30%] top-[50%] h-[10%] w-[40%] -translate-y-1/2 transform bg-gray-600" />
            <ChevronLeft className="absolute left-[25%] top-[50%] -translate-y-1/2 transform content-center text-gray-600" />
          </div>

          {/* [Bottom] bottom */}
          <div className="relative flex justify-between text-xs">
            <div></div>
            <div className="w-[60%]">
              <div className="absolute right-[30%] top-[50%] h-[10%] w-[40%] -translate-y-1/2 transform bg-gray-600" />
              <NavigateNext className="absolute right-[25%] top-[50%] -translate-y-1/2 transform content-center text-gray-600" />
            </div>
            <div>michelle</div>
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
        className="relative m-[2%] h-[50%] w-[90%] flex-shrink-0 flex-grow-0 cursor-pointer rounded-md border-2 bg-gray-200 p-1"
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
        style={{ backgroundColor: "#dee2e6" }}
      >
        {/* Top of Card */}
        <div className="relative flex h-[35%] w-full flex-nowrap justify-around">
          <Typography>{getLessonTo()}</Typography>
          <Typography>{getLessonFrom()}</Typography>
        </div>

        {/* Bottom of Card */}
        <div className="relative h-[65%] w-full flex-col p-2">
          {/* [Bottom] top */}
          <div className="relative flex justify-start text-xs">
            <animated.div
              style={{ ...acceptDeclineSprings }}
              className={`flex items-center justify-around rounded-lg ${hovered ? "bg-red-700" : "bg-transparent"}`}
            >
              {hovered ? (
                <Button
                  variant="text"
                  sx={{ color: "white", fontSize: "0.75rem" }}
                  onClick={() => handleCancelSwapRequest()}
                  className="absolute size-2"
                >
                  Cancel
                </Button>
              ) : (
                <div>YOU</div>
              )}
            </animated.div>

            <div className="absolute left-[30%] top-[50%] h-[10%] w-[40%] -translate-y-1/2 transform bg-gray-600" />
            <ChevronLeft className="absolute left-[25%] top-[50%] -translate-y-1/2 transform content-center text-gray-600" />
          </div>

          {/* [Bottom] bottom */}
          <div className="relative flex justify-between text-xs">
            <div></div>
            <div className="w-[60%]">
              <div className="absolute right-[30%] top-[50%] h-[10%] w-[40%] -translate-y-1/2 transform bg-gray-600" />
              <NavigateNext className="absolute right-[25%] top-[50%] -translate-y-1/2 transform content-center text-gray-600" />
            </div>
            <div>Jimmy</div>
          </div>
        </div>
      </div>
    </Tooltip>
  )
}

export default SwapHubDropdownItem
