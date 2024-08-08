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
      width: "10%",
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
        width: "30%",
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
        className="relative m-[2%] h-[50%] w-[90%] flex-shrink-0 flex-grow-0 cursor-pointer rounded-md border-2 border-lime-600 bg-gray-200 p-2"
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
        style={{ backgroundColor: "#dee2e6" }}
      >
        {/* Top of Card */}
        <div className="relative h-[50%] w-full border-2 border-pink-400">
          <Typography className="absolute">{getLessonTo()}</Typography>
          <Typography className="absolute right-[0%]">
            {getLessonFrom()}
          </Typography>
        </div>

        {/* Bottom of Card */}
        <div className="center relative flex h-[50%] w-full justify-between border-2 border-blue-500 p-2">
          {/* Left Side */}
          <animated.div
            style={{
              ...acceptDeclineSprings,
              backgroundColor: hovered ? "#eceff1" : "",
            }}
            className="flex items-center justify-between rounded-lg border-2 border-purple-500"
          >
            {hovered ? (
              <>
                <IconButton onClick={() => handleAcceptSwapRequest()}>
                  <CheckCircleIcon
                    color="success"
                    sx={{ fontSize: "small" }}
                    className="size-0"
                  />
                </IconButton>

                <IconButton onClick={() => handleCancelSwapRequest()}>
                  <CancelIcon color="error" className="size-0" />
                </IconButton>
              </>
            ) : (
              <RadioButtonUncheckedIcon color="primary" />
            )}

            {/* Arrow */}
            <animated.div
              style={{ ...arrowSprings }}
              className="absolute left-[15%] h-[5%] w-[55%] bg-black"
            >
              <div className="arrow-left" />
            </animated.div>

            {/* Right Side */}
            <Typography className="absolute right-7 font-black">
              {props.name.substring(0, 1).toUpperCase()}
            </Typography>
            <CheckCircleIcon className="absolute right-[0%] flex items-center justify-between rounded-lg text-teal-600" />
          </animated.div>
        </div>
      </div>
    </Tooltip>
  ) : (
    <Tooltip
      title={`You requested to swap ${getLessonFrom()} for ${props.name}'s ${getLessonTo()}`}
    >
      {/* Sent Request Card */}
      <div
        id="Incoming Request Card"
        className="relative m-[2%] h-[50%] w-[90%] flex-shrink-0 flex-grow-0 cursor-pointer rounded-md border-2 border-lime-600 bg-gray-200 p-2"
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
      >
        {/* Top of Card */}
        <div className="relative h-[50%] w-full border-2 border-pink-400">
          <Typography className="absolute">
            {moment(
              `${props.dateFrom}-${props.timeFrom}`,
              "YYYY-MM-DD-H"
            ).format("ddd ha")}
          </Typography>
          <Typography className="absolute right-[0%]">
            {moment(`${props.dateTo}-${props.timeTo}`, "YYYY-MM-DD-H").format(
              "ddd ha"
            )}
          </Typography>
        </div>

        {/* Bottom of Card */}
        <div className="center relative flex h-[50%] w-full items-center justify-between border-2 border-blue-500 p-2">
          {/* Left Side */}
          <animated.div
            id="Left_Side_Bottom"
            style={{ ...acceptDeclineSprings }}
            className={`flex h-[100%] items-center justify-between rounded-lg border-2 ${hovered ? "bg-red-700" : "bg-transparent"} border-purple-500`}
          >
            {hovered ? (
              <Button
                variant="text"
                sx={{ color: "white" }}
                onClick={() => handleCancelSwapRequest()}
              >
                CANCEL
              </Button>
            ) : (
              <CheckCircleIcon color="success" />
            )}
          </animated.div>

          {/* Arrow */}
          <animated.div
            style={{ ...arrowSprings }}
            className="absolute left-[15%] h-[5%] w-[55%] bg-black"
          >
            <div className="border-w- border-solid border-black" />
          </animated.div>

          {/* Right Side */}
          <Typography className="absolute right-7 font-black">
            {props.name.substring(0, 1).toUpperCase()}
          </Typography>
          <RadioButtonUncheckedIcon
            className="absolute right-[0%]"
            color="primary"
          />
        </div>
      </div>
    </Tooltip>
  )
}

export default SwapHubDropdownItem
