import React from "react";
import {
  Portlet,
  PortletBody
} from "../../partials/content/Portlet";
import DashboardEventPanel from "../../adminpanel/DashboardEventPanel";
import { connect } from "react-redux";
import * as builder from "../../../_metronic/ducks/builder";
import { TextField, Button } from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

class Dashboard extends React.Component {
  constructor(props){
    super(props);
    this.state={
      titleValue : "",
      phoneValue : "",
      eventSelectedId : 0,
      Events:[],
      descriptionValue:"",
      titleError:false,
      descriptionError:false,
      successDlgOpen:false
    }
    this.newFindClosest = this.newFindClosest.bind(this);
    console.log(this.props);

  }

  async componentDidMount() {
    const {store, dispatch} = this.props;
    const response = await fetch(`https://dev.imcado.app/events`,
      {
      method : 'GET',
      mode: 'cors',
      headers:{
        'Content-Type': 'application/json',
        'x-zumo-auth' : store.auth.user.xZumoAuth
      }
    });
    var data = await response.json();
    data.Items = data.Items.sort(function(a, b){
      return new Date(a.StartDateTime) - new Date(b.StartDateTime);
    });
    var idx = this.newFindClosest(data);
    var response_event;
    if (idx && idx >= 0){
      response_event = await fetch(`https://dev.imcado.app/event/` + data.Items[idx].EventId,
      {
        method : 'GET',
        mode: 'cors',
        headers:{
          'Content-Type': 'application/json',
          'x-zumo-auth' : store.auth.user.xZumoAuth
        }
      });
    }
    else response_event = {};

    var nearData;
    try {
      nearData = await response_event.json();
    }
    catch(ex){
      nearData = {};
    }
    dispatch(builder.actions.setDashboardConfig({
      nearData : nearData,
      events : data
    }));

    var layoutConfig = store.builder.layoutConfig;
    layoutConfig.loadingCSS = {
      display : 'none',
      opacity:'1',
      pointerEvents:'all'
    };
    dispatch(builder.actions.setLayoutConfigs(layoutConfig));
  }

  newFindClosest = (data) => {
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
    if (after.length > 0)
    return after[0].index;
    else return null;
  }

  handleInputChange = (e) => {
    this.setState({eventSelectedId:e.target.value});
  }

  sendHandler = async () => {
    const {store, dispatch} = this.props;
    if (this.state.titleValue === ""){
      this.setState({titleError:true});
      return;
    }
    if (this.state.descriptionValue === ""){
      this.setState({descriptionError:true});
      return;
    }
    var layoutConfig = store.builder.layoutConfig;
    layoutConfig.loadingCSS = {
      display : 'block',
      opacity:'0.5',
      pointerEvents:'none'
    };
    dispatch(builder.actions.setLayoutConfigs(layoutConfig));
    var response = await fetch('https://dev.imcado.app/support',
      {
        method : 'POST',
        mode: 'cors',
        headers:{
          'Content-Type': 'application/json',
          'x-zumo-auth' : store.auth.user.xZumoAuth
        },
        body: JSON.stringify({
          "UserEmail" : store.auth.user.email,
          "Title":this.state.titleValue,
          "Phone":this.state.phoneValue,
          "EventId":store.builder.dashboardConfig.events.Items[this.state.eventSelectedId].EventId,
          "EventName" : store.builder.dashboardConfig.events.Items[this.state.eventSelectedId].Name,
          "Message" : this.state.descriptionValue
        })
      });
      if (response.status === 202){
        layoutConfig.loadingCSS = {
          display : 'none',
          opacity:'1',
          pointerEvents:'all'
        };
        dispatch(builder.actions.setLayoutConfigs(layoutConfig));
        this.setState({successDlgOpen:true, titleValue:"", phoneValue:"", eventSelectedId:0, descriptionValue:""});
      }
  }

  render() {
    const {store} = this.props;
    if (store.builder.dashboardConfig !== undefined){
      store.builder.dashboardConfig.nearData.StartDateTime = new Date(store.builder.dashboardConfig.nearData.StartDateTime);
      store.builder.dashboardConfig.nearData.EndDateTime = new Date(store.builder.dashboardConfig.nearData.EndDateTime);
    }
    var events = store.builder.dashboardConfig.events.Items;
    return (
      <>
      <div>
        <Dialog open={this.state.successDlgOpen}>
          <DialogTitle id="alert-dialog-title">{"Dialog"}</DialogTitle>
            <DialogContent style={{"marginTop":"0px"}}>
              Your description was successfully sent to contact team.
          </DialogContent>
          <DialogActions>
              <Button onClick={() => this.setState({successDlgOpen : false})} color="primary">
                OK
              </Button>
          </DialogActions>
        </Dialog>
        <div className="row">
          <div className="col-md-4">      
            <Portlet className="kt-portlet--border-bottom-brand">
              <PortletBody fluid={true} style={{padding:"15px"}}>
                <DashboardEventPanel
                  lefTopTitle="Next Event"
                  mainTitle={ store.builder.dashboardConfig && store.builder.dashboardConfig.nearData.Name}
                  fromDate={store.builder.dashboardConfig && ((store.builder.dashboardConfig.nearData.StartDateTime.getMonth()+1) + '/' + store.builder.dashboardConfig.nearData.StartDateTime.getDate() + "/" + store.builder.dashboardConfig.nearData.StartDateTime.getFullYear())}
                  toDate={store.builder.dashboardConfig && ((store.builder.dashboardConfig.nearData.EndDateTime.getMonth()+1) + '/' + store.builder.dashboardConfig.nearData.EndDateTime.getDate() + "/" + store.builder.dashboardConfig.nearData.EndDateTime.getFullYear())}
                />
              </PortletBody>
            </Portlet>
          </div>
          <div className="col-md-4">      
            <Portlet className="kt-portlet--border-bottom-brand">
              <PortletBody fluid={true} style={{padding:"15px"}}>
                <DashboardEventPanel
                  lefTopTitle="Number of photos"
                  mainTitle={ store.builder.dashboardConfig && store.builder.dashboardConfig.nearData.NumberOfPhotos}
                  fromDate=""
                  toDate=""
                />
              </PortletBody>
            </Portlet>
          </div>
          <div className="col-md-4">      
            <Portlet className="kt-portlet--border-bottom-brand">
              <PortletBody fluid={true} style={{padding:"15px"}}>
                <DashboardEventPanel
                  lefTopTitle="Number of participants"
                  mainTitle={store.builder.dashboardConfig && store.builder.dashboardConfig.nearData.NumberOfParticipants}
                  fromDate=""
                  toDate=""
                />
              </PortletBody>
            </Portlet>
          </div>
        </div>
        <div className="col-md-12" style={{padding:"0px 0px"}}>      
          <Portlet className="kt-portlet--border-bottom-brand">
            <PortletBody fluid={true} style={{padding:"15px", display:'block'}}>
              <div className="col-md-12" style={{display:'flex', padding:"0px 0px"}}>
                <div className="col-md-4">
                  <span>Title(*)</span>
                  <TextField
                    margin="normal"
                    value={this.state.titleValue}
                    onChange={(e) => {this.setState({titleValue:e.target.value, titleError:false})}}
                    variant="outlined"
                    error={this.state.titleError}
                  />
                </div>
                <div className="col-md-4">
                  <span>Phone</span>
                  <TextField
                    margin="normal"
                    value={this.state.phoneValue}
                    onChange={(e) => {this.setState({phoneValue:e.target.value})}}
                    variant="outlined"
                  />
                </div>
                <div className="col-md-4">
                  <span>Event</span>
                  <FormControl variant="outlined" className="formControl-select">
                    <Select
                      value={this.state.eventSelectedId}
                      onChange={(e) => this.handleInputChange(e)}
                    >
                      {
                        events.map((event, index ) => (
                          <MenuItem key={event.EventId} value={index}>{event.Name}</MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </div>
              </div>
              
              <div className="col-md-12">
                <span>Description</span>
                <TextField
                  margin="normal"
                  onChange={(e) => {this.setState({descriptionValue:e.target.value, descriptionError:false})}}
                  variant="outlined"
                  multiline
                  rows="13"
                  rowsMax="13"
                  error={this.state.descriptionError}
                  value={this.state.descriptionValue}
                />
              </div>
              <div>
                <Button variant="contained" onClick={() => this.sendHandler()} color="primary" style={{marginTop:'5px', padding:'11px 18px', float:'right', marginRight:'10px', width:'140px'}}>
                  Send
                </Button>
              </div>
              </PortletBody>
          </Portlet>
        </div>
       </div> 
      </>
    );
  }
}
const mapStateToProps = store => ({
  store
});

export default connect(mapStateToProps)(Dashboard);