import { Box, Button, Input, Paper, TextField, Typography } from '@mui/material'
import React from 'react'
import moment from 'moment'
import { Activity } from '../../../config/activity'
import { RequestActivity, bookRequest } from '../../../helpers/RequestHelpers'
import { MultiSelectContext } from '../../../Contexts'

type Props = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>
  multiActivities: Map<Activity, Function>|undefined
  setMultiActivities: React.Dispatch<React.SetStateAction<Map<Activity, Function>|undefined>>
}

const MultiSelectModal = (props: Props) => {

  const { eventSelect } = React.useContext(MultiSelectContext);
  const [eventName, setEventName] = React.useState("");

  async function handleConfirm() {
    for (const activity of (props.multiActivities as Map<Activity, Function>).keys()) {
      const reqActivity: RequestActivity = activity;
      delete reqActivity.id;
      const status: Array<number> = [];
      console.log(reqActivity);
      await bookRequest(reqActivity, status);
    }
    props.setModal(false);
    props.setMultiActivities(undefined);
  }

  return (
    <Paper sx={{width: "30%", height: "75%", backgroundColor: "#eceff1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly"}}>

      <Typography sx={{fontSize: "20px"}}>
        Activity Multi-Select
      </Typography>

      <Paper sx={{width: "80%", height: "50%", display: "flex", flexDirection: "column", overflowY:"scroll", alignItems: "center"}}>
        { props.multiActivities !== undefined ?

          [...props.multiActivities.keys()].sort((a, b) => {
            return moment(`${a.date}-${a.start_time}`, "YYYY-MM-DD-kk").isBefore(moment(`${b.date}-${b.start_time}`, "YYYY-MM-DD-kk")) ? -1 : 1
          }).map(activity =>
          <Paper key={`${activity.date}:${activity.start_time}`} sx={{width: "80%", height: "50%", margin: "2.5%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Typography key={activity.date}>{moment(activity.date).format("ddd Do MMM")}, {activity.start_time > 12 ? activity.start_time % 12 : activity.start_time}{activity.start_time > 11 ? "pm" : "am"}</Typography>
          </Paper>)

          : null
        }
      </Paper>

      { eventSelect ?
        <Box sx={{backgroundColor: "white"}}>
          <TextField
            multiline
            maxRows={1}
            size="small"
            id="outlined-controlled"
            label="Name of event"
            value={eventName}
            onChange={e => setEventName(e.target.value)}
          />
        </Box>
        : null
      }

        <Box sx={{display: "flex", justifyContent: "space-evenly",  width: "60%"}}>
          <Button variant='contained' color='error' onClick={() => props.setModal(false)}>
            Cancel
          </Button>

          <Button variant='contained' color='info' onClick={() => handleConfirm()}>
            Confirm
          </Button>
        </Box>

    </Paper>
  )
}

export default MultiSelectModal