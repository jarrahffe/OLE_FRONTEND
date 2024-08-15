import { Button, Typography } from "@mui/material"
import React from "react"
import SwapHubDropdownItem from "./SwapHubDropdownItem"
import { SwapRequest } from "../../config/SwapRequest"
import { Activity } from "../../config/activity"
import { SwapContext, UserInfoContext } from "../../contexts"
import "../../index.css"
import SwapDialog from "./CreateSwapModal"

const SwapHubDropdown = () => {
  const { setSwapHubModal } = React.useContext(SwapContext)
  const { account } = React.useContext(UserInfoContext)

  const activityIdsBelongingToUser = new Set<string>()

  const activityArray: Activity[] = JSON.parse(
    window.sessionStorage.getItem("data") as string
  )
  const swapsArray: SwapRequest[] = JSON.parse(
    window.sessionStorage.getItem("swaps") as string
  )

  activityArray.forEach((a) => {
    if (a.account === account) activityIdsBelongingToUser.add(a.id)
  })

  const incomingSwaps = swapsArray.filter((o) =>
    activityIdsBelongingToUser.has(o.activity_2 as string)
  )
  const outgoingSwaps = swapsArray.filter((o) =>
    activityIdsBelongingToUser.has(o.activity_1 as string)
  )

  outgoingSwaps.forEach((swapRequest) => {
    activityArray.forEach((activity) => {
      if (swapRequest.activity_1 === activity.id) {
        swapRequest.activity_1 = activity
      } else if (swapRequest.activity_2 === activity.id) {
        swapRequest.activity_2 = activity
      }
    })
  })

  incomingSwaps.forEach((swapRequest) => {
    activityArray.forEach((activity) => {
      if (swapRequest.activity_1 === activity.id) {
        swapRequest.activity_1 = activity
      } else if (swapRequest.activity_2 === activity.id) {
        swapRequest.activity_2 = activity
      }
    })
  })

  const [outgoing, setOutgoing] = React.useState(outgoingSwaps)
  const [incoming, setIncoming] = React.useState(incomingSwaps)

  return (
    <div className="relative flex h-full w-full flex-col justify-evenly">
      <Typography className="rounded-lg border-2 border-slate-300 text-center">
        Received
      </Typography>

      <div className="relative flex max-h-[40%] w-full flex-col items-center overflow-y-scroll">
        {incoming.length !== 0 ? (
          incoming.map((swapRequest) => (
            <SwapHubDropdownItem
              id={swapRequest.id}
              name={(swapRequest.activity_1 as Activity).name}
              dateFrom={(swapRequest.activity_1 as Activity).date}
              dateTo={(swapRequest.activity_2 as Activity).date}
              timeFrom={(swapRequest.activity_1 as Activity).start_time}
              timeTo={(swapRequest.activity_2 as Activity).start_time}
              received={true}
              outgoingSwaps={outgoing}
              incomingSwaps={incoming}
              setOutgoing={setOutgoing}
              setIncoming={setIncoming}
            />
          ))
        ) : (
          <Typography className="absolute top-1/4 text-gray-500">
            No requests reveived
          </Typography>
        )}
      </div>

      <Typography className="rounded-lg border-2 border-slate-300 text-center">
        Sent
      </Typography>
      <div className="relative flex max-h-[40%] w-full flex-col items-center overflow-y-scroll">
        {outgoing.length !== 0 ? (
          outgoing.map((swapRequest) => (
            <SwapHubDropdownItem
              id={swapRequest.id}
              name={(swapRequest.activity_2 as Activity).name}
              dateFrom={(swapRequest.activity_1 as Activity).date}
              dateTo={(swapRequest.activity_2 as Activity).date}
              timeFrom={(swapRequest.activity_1 as Activity).start_time}
              timeTo={(swapRequest.activity_2 as Activity).start_time}
              received={false}
              outgoingSwaps={outgoing}
              incomingSwaps={incoming}
              setOutgoing={setOutgoing}
              setIncoming={setIncoming}
            />
          ))
        ) : (
          <Typography sx={{ color: "grey", position: "absolute", top: "25%" }}>
            No requests sent
          </Typography>
        )}
      </div>

      <SwapDialog />
      {/* <Button
        variant="contained"
        color="secondary"
        className="m-12 h-6 w-full p-4"
      >
        Create Swap
      </Button> */}
    </div>
  )
}

export default SwapHubDropdown
