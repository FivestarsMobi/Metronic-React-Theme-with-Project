import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from "react-redux";
import {
  TextField,
  Switch
} from "@material-ui/core";
import * as builder from "../../_metronic/ducks/builder";
import { CircularProgress } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

function AddEventDialog({store, dispatch}) {
  const getTodayDate = () => {
    let tempDate = new Date();
    let date = tempDate.getFullYear() + '-' + (tempDate.getMonth()+1) + '-' + tempDate.getDate();
    return date;
  }
  const getTomorrowDate = () => {
    let tempDate = new Date();
    let date = tempDate.getFullYear() + '-' + (tempDate.getMonth()+1) + '-' + ( tempDate.getDate() + 1 );
    return date;
  }

  const [open, setOpen] = React.useState(false);
  const [isPublic, setIsPublic] = React.useState(false);
  const [eventname, setEventname] = React.useState("");
  const [startDate, setStartDate] = React.useState({getTodayDate:getTodayDate()});
  const [endDate, setEndDate] = React.useState({getTomorrowDate:getTomorrowDate()});
  const [saveloading, setSaveloading] = React.useState({
    background: '#fff',
    pointerEvents: 'all',
    display:'none'
  })

  const handleClickOpen = () => {
    setOpen(true);
  };
  

  const handleClose = () => {
    setOpen(false);
  };

  const switchValueChangeHandler = () =>{
    setIsPublic(!isPublic);
  }

  const newFindClosest = (data) => {
    var testDate = new Date();
    var after = [];
    var max = data.Items.length;
    for(var i = 0; i < max; i++) {
        var tar = data.Items[i].StartDateTime;
        var arrDate = new Date(tar);
        // 3600 * 24 * 1000 = calculating milliseconds to days, for clarity.
        var diff = (arrDate - testDate) / (3600 * 24 * 1000);
        if(diff > 0) {
          after.push({diff: diff, index: i});
        }
    }

    after.sort(function(a, b) {
        if(a.diff > b.diff) {
            return 1;
        }
        if(a.diff < b.diff) {
            return -1;
        }
        return 0;
    });
    if (after.length === 0)
    return null;
    return after[0].index;
  }

  const handleSave = () => {
    setSaveloading({
      background: '#ddd',
      pointerEvents: 'none',
      display:'block'
    });
    fetch(`https://dev.imcado.app/events`,
    {
      method : 'POST',
      mode: 'cors',
      headers:{
        'Content-Type': 'application/json',
        'x-zumo-auth' : store.auth.user.xZumoAuth
      },
      body: JSON.stringify({
        "IsOpen" : isPublic,
        "Name" : eventname,
        "StartDateTime" : startDate.getTodayDate,
        "EndDateTime" : endDate.getTomorrowDate
       })
    })
    .then(response =>{
      if (response.status === 202) return response.json();
      else return null;
    })
    .then(result =>{
      if (result === null){
        console.log("error");
        return;
      }
      else {
        fetch(`https://dev.imcado.app/events`,
          {
          method : 'GET',
          mode: 'cors',
          headers:{
            'Content-Type': 'application/json',
            'x-zumo-auth' : store.auth.user.xZumoAuth
          }
        }).then(response => response.json())
        .then(data=>{
          data.Items = data.Items.sort(function(a, b){
            return new Date(a.StartDateTime) - new Date(b.StartDateTime);
          });
          let _menuConfig = {
            header: {
              self: {},
              items: [
              ]
            },
            aside: {
              self: {},
              items: [
                {
                  title: "Dashboard",
                  root: true,
                  icon: "flaticon2-architecture-and-city",
                  page: "dashboard",
                  translate: "MENU.DASHBOARD",
                  bullet: "dot"
                },
                { section: "Events" }
              ]
            }
          };

          if (data.Items && data.Items.length > 0 ){
            for (var i in data.Items){
              var item = {
                title: data.Items[i].Name,
                root: true,
                submenu: [
                  {
                    title: "Details",
                    icon: "flaticon2-information",
                    page: "eventdetail/" + data.Items[i].EventId
                  },
                  {
                    title: "Participants",
                    icon: "flaticon-users",
                    page: "participantsdetail/" + data.Items[i].EventId
                  },{
                    title: "Photos",
                    icon: "flaticon2-photograph",
                    page: "photosdetail/" + data.Items[i].EventId
                  }
                ]
              }
              _menuConfig.aside.items.push(item);
            }
          }
          dispatch(builder.actions.setMenuConfig(_menuConfig));
          var idx = newFindClosest(data);
          return {idx:idx, data:data};
        })
        .then(res => {
          fetch(`https://dev.imcado.app/event/` + res.data.Items[res.idx].EventId,
          {
            method : 'GET',
            mode: 'cors',
            headers:{
              'Content-Type': 'application/json',
              'x-zumo-auth' : store.auth.user.xZumoAuth
            }
          })
          .then(response => response.json())
          .then(res1 => {
            var nearData = res1;
            dispatch(builder.actions.setDashboardConfig({
              nearData : nearData,
              events : res.data
            }));
            setSaveloading({
              background: '#fff',
              pointerEvents: 'all',
              display:'none'
            });
            setOpen(false);
          })
        })
      }
    })
  }
  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen} className="btn kt-subheader__btn-primary btn-addevent" style={{marginLeft:'10px'}}>
        + 
        <FormattedMessage id={"MENU.NEW_EVENT"}  defaultMessage={"New Event"} />
      </Button>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div style={{background:saveloading.background, pointerEvents:saveloading.pointerEvents}}>
            <CircularProgress className="kt-splash-screen__spinner" style={{position: 'absolute','zIndex': '1','top': '45%','left': '48%', display:saveloading.display}} />
            <DialogTitle id="alert-dialog-title">{<FormattedMessage id={"MENU.ADD_EVENT"}  defaultMessage={"Add Event"} />}</DialogTitle>
            <DialogContent style={{"marginTop":"0px"}}>
              <TextField
                id="filled-name"
                label={<FormattedMessage id={"MENU.NEW_EVENT_NAME"}  defaultMessage={"New Event Name"} />}
                margin="normal"
                style={{"marginTop":"0px"}}
                value={eventname}
                onChange={(e) => setEventname(e.target.value)}
              />
              <TextField
                id="startDate"
                label={<FormattedMessage id={"MENU.START_DATE"}  defaultMessage={"Start Date"} />}
                type="date"
                InputLabelProps={{
                  shrink: true
                }}
                style={{"width":"50%", "paddingRight":"10px"}}
                value={startDate.getTodayDate}
                onChange={(e) => setStartDate({getTodayDate:e.target.value})}
              />
              <TextField
                id="endDate"
                label={<FormattedMessage id={"MENU.END_DATE"}  defaultMessage={"End Date"} />}
                type="date"
                InputLabelProps={{
                  shrink: true
                }}
                style={{"width":"50%", "paddingLeft":"10px"}}
                value={endDate.getTomorrowDate}
                onChange={(e) => setEndDate({getTomorrowDate:e.target.value})}
              />
              <div style={{"marginTop":"10px"}}>
                <FormattedMessage id={"MENU.PUBLIC"}  defaultMessage={"Public"} />
                <Switch
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={switchValueChangeHandler}
                  value={isPublic}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSave} color="primary" autoFocus>
                <FormattedMessage id={"MENU.SAVE"}  defaultMessage={"Save"} />
              </Button>
              <Button onClick={handleClose} color="primary">
                <FormattedMessage id={"MENU.CANCEL"}  defaultMessage={"Cancel"} />
              </Button>
            </DialogActions>
            </div>
        </Dialog>
    </div>
  );
}
const mapStateToProps = store => ({
  store
});

export default connect(mapStateToProps)(AddEventDialog);