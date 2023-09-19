import { Box, Button, Input, Paper, TextField, Typography } from '@mui/material'
import React from 'react'
import moment from 'moment'
import { Activity } from '../../../config/activity'
import { RequestActivity, blockRequest, bookRequest, deleteActivity } from '../../../helpers/RequestHelpers'
import { MultiSelectContext, UserInfoContext } from '../../../contexts'


const MultiSelectModal = () => {

  const { eventSelect, blockSelect, setEventSelect, setBlockSelect, multiActivities, setMultiActivities, multiDelete, setMultiDelete, setMultiSelectModal } = React.useContext(MultiSelectContext);
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
    setEventSelect(false);
    setBlockSelect(false);
  }

  return (
    <div
    onClick={e => e.stopPropagation()}
    style={{width: "40%", height: "80%", backgroundColor: "#eceff1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly", borderRadius: "0.5rem"}}>

      <Typography sx={{fontSize: "1.5rem", color: eventSelect ? "#303f9f" : "#b71c1c"}}>
        {eventSelect ? "Event" : "Busy"} Multi-Select
      </Typography>

      <div style={{display: "flex", justifyContent: "space-evenly", alignItems: "center", width: "100%"}}>
        {
          multiActivities !== undefined ?
          <Typography sx={{fontSize: "1.25rem", width: "40%", display: "flex", justifyContent: "center", textDecoration: "underline"}}>Add</Typography>
          :
          null
        }
        {
          multiDelete !== undefined ?
          <Typography sx={{fontSize: "1.25rem", width: "40%", display: "flex", justifyContent: "center", textDecoration: "underline"}}>Remove</Typography>
          :
          null
        }
      </div>

      <div style={{display: "flex", justifyContent: "space-evenly", alignItems: "center", width: "100%", height: "40%"}}>

        {
          multiActivities !== undefined ?
          <div style={{ display: "flex", flexDirection: "column", overflowY:"scroll", alignItems: "center", width: multiDelete !== undefined ? "40%" : "80%", height: "100%"}}>
              {
                [...multiActivities.keys()].sort((a, b) => {
                  return moment(`${a.date}-${a.start_time}`, "YYYY-MM-DD-kk").isBefore(moment(`${b.date}-${b.start_time}`, "YYYY-MM-DD-kk")) ? -1 : 1
                }).map(activity =>
                <Paper key={`${activity.date}:${activity.start_time}`} sx={{width: "80%", height: "3rem", margin: "2.5%", display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0}}>
                  <Typography key={activity.date}>{moment(activity.date).format("ddd Do MMM")}, {activity.start_time > 12 ? activity.start_time % 12 : activity.start_time}{activity.start_time > 11 ? "pm" : "am"}</Typography>
                </Paper>)
              }
          </div>
          :
          null
        }

        {
          multiDelete !== undefined ?
          <div style={{ display: "flex", flexDirection: "column", overflowY:"scroll", alignItems: "center", width: multiActivities !== undefined ? "40%" : "80%", height: "100%"}}>
            {
              [...multiDelete.keys()].sort((a, b) => {
                return moment(`${a.date}-${a.start_time}`, "YYYY-MM-DD-kk").isBefore(moment(`${b.date}-${b.start_time}`, "YYYY-MM-DD-kk")) ? -1 : 1
              }).map(activity =>
              <Paper key={`${activity.date}:${activity.start_time}`} sx={{width: "80%", height: "3rem", margin: "2.5%", display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0}}>
                <Typography key={activity.date}>{moment(activity.date).format("ddd Do MMM")}, {activity.start_time > 12 ? activity.start_time % 12 : activity.start_time}{activity.start_time > 11 ? "pm" : "am"}</Typography>
              </Paper>)
            }
          </div>
          :
          null
        }

      </div>

      { eventSelect && multiActivities !== undefined ?
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

    </div>
  )
}

export default MultiSelectModal