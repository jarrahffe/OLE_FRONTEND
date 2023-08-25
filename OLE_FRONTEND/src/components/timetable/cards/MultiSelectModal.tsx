import { Box, Button, Input, Paper, TextField, Typography } from '@mui/material'
import React from 'react'
import moment from 'moment'
import { Activity } from '../../../config/activity'
import { RequestActivity, blockRequest, bookRequest, deleteActivity } from '../../../helpers/RequestHelpers'
import { MultiSelectContext, UserInfoContext } from '../../../contexts'


const MultiSelectModal = () => {

  const { eventSelect, multiActivities, setMultiActivities, multiDelete, setMultiDelete, setMultiSelectModal } = React.useContext(MultiSelectContext);
  const [eventName, setEventName] = React.useState("Studio");
  const { token } = React.useContext(UserInfoContext);

  async function handleConfirm() {
    if (eventSelect) {
      if (multiActivities) {
        for (const activity of (multiActivities as Map<Activity, Function>).keys()) {
          const reqActivity: RequestActivity = activity;
          reqActivity.name = eventName;
          delete reqActivity.id;
          const status: Array<number> = [];
          bookRequest(reqActivity, status, token);
        }
      }
    }
    else {
      const blockActivities: RequestActivity[] = [];
      const status: Array<number> = [];

      if (multiActivities) {
        for (const activity of (multiActivities as Map<Activity, Function>).keys()) {
          const reqActivity: RequestActivity = activity;
          delete reqActivity.id;
          delete reqActivity.name;
          delete reqActivity.notes;
          blockActivities.push(reqActivity);
        }
        blockRequest({activities: blockActivities}, status, token);
      }
    }
    if (multiDelete) {
      for (const activity of (multiDelete as Map<Activity, Function>).keys()) {
        deleteActivity(activity.id, token);
      }
    }
    setMultiDelete(undefined);
    setMultiSelectModal(false);
    setMultiActivities(undefined);
  }

  return (
    <Paper sx={{width: "30%", height: "75%", backgroundColor: "#eceff1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly"}}>

      <Typography sx={{fontSize: "20px"}}>
        Activity Multi-Select
      </Typography>

      <Paper sx={{width: "80%", height: "50%", display: "flex", flexDirection: "column", overflowY:"scroll", alignItems: "center"}}>
        { multiActivities !== undefined ?

          [...multiActivities.keys()].sort((a, b) => {
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
          <Button variant='contained' color='error' onClick={() => setMultiSelectModal(false)}>
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