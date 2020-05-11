import React from "react";
import {
  Portlet,
  PortletBody
} from "../../partials/content/Portlet";
import { connect } from "react-redux";
import * as builder from "../../../_metronic/ducks/builder";
import '../../adminpanel/css/style.css';
import { Button, CircularProgress } from "@material-ui/core";
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import ParticipantsDetailTable from '../../adminpanel/ParticipantsDetailTable';
import { CSVReader } from 'react-papaparse'

class ParticipantsDetail extends React.Component {
  constructor(props){
    super(props);
    const { params } = this.props.match;
    this.state={
      eventId : params.id,
      background: '#fff',
      pointerEvents: 'all',
      display:'none',
      listData:{},
      showData:{},
      newParticipantDlgOpen : false,
      importCSVDlgOpen : false,
      csvFile:undefined
    }
    this.fileInput = React.createRef()
  }

  async componentDidMount() {
    this.refreshList();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.match.params.id !== prevState.eventId) {
      return {
        eventId : nextProps.match.params.id
      }
    }
    return null;
  }

  refreshList = async () =>{
    const {store, dispatch} = this.props;
    var layoutConfig = store.builder.layoutConfig;
    layoutConfig.loadingCSS = {
      display : 'block',
      opacity:'0.5',
      pointerEvents:'none'
    };
    dispatch(builder.actions.setLayoutConfigs(layoutConfig));
    const response = await fetch(`https://dev.imcado.app/event/` + this.state.eventId + '/participants',
      {
      method : 'GET',
      mode: 'cors',
      headers:{
        'Content-Type': 'application/json',
        'x-zumo-auth' : store.auth.user.xZumoAuth
      }
    });
    var data = await response.json();
    this.setState({listData:data});
    const response_eventDetail = await fetch(`https://dev.imcado.app/event/` + this.state.eventId,
      {
      method : 'GET',
      mode: 'cors',
      headers:{
        'Content-Type': 'application/json',
        'x-zumo-auth' : store.auth.user.xZumoAuth
      }
    });
    var data1 = await response_eventDetail.json();
    this.setState({showData:data1});
    layoutConfig.loadingCSS = {
      display : 'none',
      opacity:'1',
      pointerEvents:'all'
    };
    dispatch(builder.actions.setLayoutConfigs(layoutConfig));
  }

  async componentDidUpdate(prevProps, prevState) {
    if(prevState.eventId !== this.state.eventId){
      this.refreshList();
    }
  }

  newParticipantDlgHandler = () => {
    this.setState({newParticipantDlgOpen:false});
  }

  onFileLoadedCSVFileRead = (data) => {
    this.setState({csvFile : data});
  }

  handleReadCSV = async () => {
    const {store} = this.props;
    var data = this.state.csvFile;
    this.setState({
      background: '#ddd',
      pointerEvents: 'none',
      display:'block'
    });
    for (var i in data.data){
      var emails = data.data[i];
      var email = emails[0];
      email = email.trim();
      var mailformat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
      if (email.match(mailformat))
      {
        const response = await fetch(`https://dev.imcado.app/event/` + this.state.eventId + '/participant/' + email,
        {
          method : 'PUT',
          mode: 'cors',
          headers:{
            'Content-Type': 'application/json',
            'x-zumo-auth' : store.auth.user.xZumoAuth
          },
          body: JSON.stringify({
            "IsOwner" : false
          })
        });
        
        if (response.status === 202) {
          continue;
        }
        else {
          console.log('error');
          continue;
        }
      }
    }
    setTimeout(() => {
      this.refreshList();
      this.setState({
        background: '#fff',
        pointerEvents: 'all',
        display:'none',
        importCSVDlgOpen : false
      });
    }, 1000);
  }

  handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  handleImportOffer = () => {
    this.fileInput.current.click()
  }

  render() {
    //console.log(this.state)
    return (
      <>
      <div className="row">
        <Dialog
          open={this.state.importCSVDlgOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div style={{background:this.state.background, pointerEvents:this.state.pointerEvents}}>
              <CircularProgress className="kt-splash-screen__spinner" style={{position: 'absolute','zIndex': '1','top': '45%','left': '48%', display:this.state.display}} />
              <DialogTitle id="alert-dialog-title">{"Import by CSV file"}</DialogTitle>
              <DialogContent style={{"marginTop":"0px"}}>
                <CSVReader
                  onFileLoaded={this.onFileLoadedCSVFileRead}
                  inputRef={this.fileInput}
                  onError={this.handleOnError}
                />
              </DialogContent>
              <DialogActions>
                <Button color="primary" autoFocus onClick={() => this.handleReadCSV()}>
                  Import
                </Button>
                <Button onClick={() => this.setState({importCSVDlgOpen:false})} color="primary">
                  Cancel
                </Button>
              </DialogActions>
          </div>
        </Dialog>
        <div className="col-md-12">      
          <Portlet className="kt-portlet--border-bottom-brand">
            <PortletBody fluid={true} style={{padding:"15px"}}>
              <div style={{height:'50px', width:'100%'}}>
                <span style={{margin:'auto 0', fontSize:'30pt'}} >{this.state.showData.Name}</span>
                <Button variant="contained" color="primary" onClick={()=> this.setState({importCSVDlgOpen:true})}  style={{marginTop:'5px', padding:'11px 18px', float:'right', marginLeft:'10px', width:'140px'}}>
                  Import
                </Button>
                <Button variant="contained" color="primary" onClick={()=>{this.setState({newParticipantDlgOpen:true})}}  style={{marginTop:'5px', padding:'11px 18px', float:'right', width:'140px'}}>
                  Add Participants
                </Button>
              </div>
            </PortletBody>
          </Portlet>
        </div>
        <ParticipantsDetailTable items={this.state.listData.Items} newParticipantDlgOpen = {this.state.newParticipantDlgOpen} newParticipantDlgHandler = {this.newParticipantDlgHandler} eventId = {this.state.eventId} refreshList = {this.refreshList}/>
      </div>
      </>
    );
  }
}
const mapStateToProps = store => ({
  store
});

export default connect(mapStateToProps)(ParticipantsDetail);