import React from "react";
import {
  Portlet,
  PortletBody
} from "../../partials/content/Portlet";
import { connect } from "react-redux";
import * as builder from "../../../_metronic/ducks/builder";
import '../../adminpanel/css/style.css';
import { Button } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import { CircularProgress, Switch, TextField } from "@material-ui/core";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

class EventDetail extends React.Component {
  constructor(props){
    super(props);
    const { params } = this.props.match;
    this.state={
      eventId : params.id,
      uploadDlgOpen : false,
      editEventNameDlgOpen : false,
      newEventNameValue : "",
      editAccessCodeDlgOpen : false,
      newAccessCodeValue : "",
      editSlideShowUrlDlgOpen : false,
      newSlideShowUrlValue : "",
      LogoDeleteDlgOpen : false,
      deleteSlideDlgOpen : false,
      deleteSlideId : '',
      uploadSlideDlgOpen : false,
      background: '#fff',
      pointerEvents: 'all',
      display:'none',
      file:'',
      slideuploadfile:'',
      errorDlgOpen : false,
      showData:{}
    }
  }

  async componentDidMount() {
    const {store, dispatch} = this.props;
    var layoutConfig = store.builder.layoutConfig;
    layoutConfig.loadingCSS = {
      display : 'block',
      opacity:'0.5',
      pointerEvents:'none'
    };
    dispatch(builder.actions.setLayoutConfigs(layoutConfig));
    const response = await fetch(`https://dev.imcado.app/event/` + this.state.eventId,
      {
      method : 'GET',
      mode: 'cors',
      headers:{
        'Content-Type': 'application/json',
        'x-zumo-auth' : store.auth.user.xZumoAuth
      }
    });
    var data = await response.json();
    this.setState({showData:data});
    layoutConfig.loadingCSS = {
      display : 'none',
      opacity:'1',
      pointerEvents:'all'
    };
    dispatch(builder.actions.setLayoutConfigs(layoutConfig));
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.match.params.id !== prevState.eventId) {
      return {
        eventId : nextProps.match.params.id
      }
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.eventId !== this.state.eventId){
      const {store, dispatch} = this.props;
    
      var layoutConfig = store.builder.layoutConfig;
      layoutConfig.loadingCSS = {
        display : 'block',
        opacity:'0.5',
        pointerEvents:'none'
      };
      dispatch(builder.actions.setLayoutConfigs(layoutConfig));

      fetch(`https://dev.imcado.app/event/` + this.state.eventId,
        {
        method : 'GET',
        mode: 'cors',
        headers:{
          'Content-Type': 'application/json',
          'x-zumo-auth' : store.auth.user.xZumoAuth
        }
      })
      .then(res => res.json())
      .then(data=> {
        this.setState({showData:data});
        layoutConfig.loadingCSS = {
          display : 'none',
          opacity:'1',
          pointerEvents:'all'
        };
        dispatch(builder.actions.setLayoutConfigs(layoutConfig));
      });
    }
  }
  
  uploadClick = () =>{
    this.setState({
      uploadDlgOpen : true
    });
  }

  removeLogoClick = () =>{
    this.setState({
      LogoDeleteDlgOpen : true
    });
  }
  
  slideUploadClick = () =>{
    this.setState({
      uploadSlideDlgOpen : true
    });
  }

  slideDeleteClick = (slideId) => {
    this.setState({deleteSlideDlgOpen : true});
    this.setState({deleteSlideId : slideId});
  }

  SlidePhotoDeleteHandler = () =>{
    if (this.state.deleteSlideId === '') return;
    const {store, dispatch} = this.props;
      this.setState(
        {
          background: '#ddd',
          pointerEvents: 'none',
          display:'block'
        }
      );
      fetch(`https://dev.imcado.app/event/` + this.state.eventId + '/slide/' + this.state.deleteSlideId,
      {
        method : 'DELETE',
        mode: 'cors',
        headers:{
          'Content-Type': 'application/json',
          'x-zumo-auth' : store.auth.user.xZumoAuth
        }
      })
      .then(res =>{
        if (res.status === 202){
          setTimeout(function() { //Start the timer
            var layoutConfig = store.builder.layoutConfig;
            layoutConfig.loadingCSS = {
              display : 'block',
              opacity:'0.5',
              pointerEvents:'none'
            };
            dispatch(builder.actions.setLayoutConfigs(layoutConfig));
  
            fetch(`https://dev.imcado.app/event/` + this.state.eventId,
              {
              method : 'GET',
              mode: 'cors',
              headers:{
                'Content-Type': 'application/json',
                'x-zumo-auth' : store.auth.user.xZumoAuth
              }
            })
            .then(res => res.json())
            .then(data=> {
              this.setState({showData:data});
              layoutConfig.loadingCSS = {
                display : 'none',
                opacity:'1',
                pointerEvents:'all'
              };
              dispatch(builder.actions.setLayoutConfigs(layoutConfig));
              this.setState({
                deleteSlideDlgOpen : false
              });
              this.setState(
                {
                  background: '#fff',
                  pointerEvents: 'all',
                  display:'none'
                }
              );
            });
          }.bind(this), 1500)
        }
        else {
          this.setState(
            {
              background: '#fff',
              pointerEvents: 'all',
              display:'none'
            }
          );
          this.setState({errorDlgOpen : true});
        }
      });
  }



  handleUpload = () =>{
    const {store, dispatch} = this.props;
    if (!this.state.file || this.state.file.size === 0){
      this.setState({errorDlgOpen : true});
    }
    else{
      // console.log(this.state.file);
      this.setState(
        {
          background: '#ddd',
          pointerEvents: 'none',
          display:'block'
        }
      );
      fetch(`https://dev.imcado.app/event/` + this.state.eventId + '/logo',
      {
        method : 'POST',
        mode: 'cors',
        headers:{
          'Content-Type': 'application/octet-stream',
          'x-zumo-auth' : store.auth.user.xZumoAuth,
          'FileContentType': 'image/png'
        },
        body:this.state.file
      })
      .then(res =>{
        if (res.status === 202){
          setTimeout(function() { //Start the timer
            var layoutConfig = store.builder.layoutConfig;
            layoutConfig.loadingCSS = {
              display : 'block',
              opacity:'0.5',
              pointerEvents:'none'
            };
            dispatch(builder.actions.setLayoutConfigs(layoutConfig));
  
            fetch(`https://dev.imcado.app/event/` + this.state.eventId,
              {
              method : 'GET',
              mode: 'cors',
              headers:{
                'Content-Type': 'application/json',
                'x-zumo-auth' : store.auth.user.xZumoAuth
              }
            })
            .then(res => res.json())
            .then(data=> {
              this.setState({showData:data});
              layoutConfig.loadingCSS = {
                display : 'none',
                opacity:'1',
                pointerEvents:'all'
              };
              dispatch(builder.actions.setLayoutConfigs(layoutConfig));
              this.setState({
                uploadDlgOpen : false
              });
              this.setState(
                {
                  background: '#fff',
                  pointerEvents: 'all',
                  display:'none'
                }
              );
            });
          }.bind(this), 1500)
        }
        else {
          this.setState(
            {
              background: '#fff',
              pointerEvents: 'all',
              display:'none'
            }
          );
          this.setState({errorDlgOpen : true});
        }
      })
    }
    
  }

  handleUploadSlideHandler = () =>{
    const {store, dispatch} = this.props;
    if (!this.state.slideuploadfile || this.state.slideuploadfile.size === 0){
      this.setState({errorDlgOpen : true});
    }
    else{
      // console.log(this.state.file);
      this.setState(
        {
          background: '#ddd',
          pointerEvents: 'none',
          display:'block'
        }
      );
      fetch(`https://dev.imcado.app/event/` + this.state.eventId + '/slides',
      {
        method : 'POST',
        mode: 'cors',
        headers:{
          'Content-Type': 'application/octet-stream',
          'x-zumo-auth' : store.auth.user.xZumoAuth,
          'FileContentType': 'image/png'
        },
        body:this.state.slideuploadfile
      })
      .then(res =>{
        if (res.status === 202){
          setTimeout(function() { //Start the timer
            var layoutConfig = store.builder.layoutConfig;
            layoutConfig.loadingCSS = {
              display : 'block',
              opacity:'0.5',
              pointerEvents:'none'
            };
            dispatch(builder.actions.setLayoutConfigs(layoutConfig));
  
            fetch(`https://dev.imcado.app/event/` + this.state.eventId,
              {
              method : 'GET',
              mode: 'cors',
              headers:{
                'Content-Type': 'application/json',
                'x-zumo-auth' : store.auth.user.xZumoAuth
              }
            })
            .then(res => res.json())
            .then(data=> {
              this.setState({showData:data});
              layoutConfig.loadingCSS = {
                display : 'none',
                opacity:'1',
                pointerEvents:'all'
              };
              dispatch(builder.actions.setLayoutConfigs(layoutConfig));
              
              this.setState({
                uploadSlideDlgOpen : false
              });
              this.setState(
                {
                  background: '#fff',
                  pointerEvents: 'all',
                  display:'none'
                }
              );
            });
          }.bind(this), 1500)
        }
        else {
          this.setState(
            {
              background: '#fff',
              pointerEvents: 'all',
              display:'none'
            }
          );
          this.setState({errorDlgOpen : true});
        }
      })
    }
    
  }

  handleUploadCancel = () =>{
    this.setState({
      uploadDlgOpen : false
    });
  }

  handleSlideUploadCancel = () =>{
    this.setState({
      uploadSlideDlgOpen : false
    });
  }

  _handleImageChange =(e) =>{
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0){
      let reader = new FileReader();
      let file = e.target.files[0];

      reader.onloadend = () => {
        this.setState({
          file: file
        });
        var regex = new RegExp('[^.]+$'); 
        if (this.state.file.name.match(regex)[0] === "png" || this.state.file.name.match(regex)[0] === "tiff"  || this.state.file.name.match(regex)[0] === "jpg" || this.state.file.name.match(regex)[0] === "gif"){

        }
        else {
          this.setState({errorDlgOpen : true});
        }
      }
      reader.readAsDataURL(file)
    }
    else {
      this.setState({file:''});
    }
  }

  _handleSlideImageChange =(e) =>{
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0){
      let reader = new FileReader();
      let file = e.target.files[0];

      reader.onloadend = () => {
        this.setState({
          slideuploadfile: file
        });
        var regex = new RegExp('[^.]+$'); 
        if (this.state.slideuploadfile.name.match(regex)[0] === "png" || this.state.slideuploadfile.name.match(regex)[0] === "tiff"  || this.state.slideuploadfile.name.match(regex)[0] === "jpg" || this.state.slideuploadfile.name.match(regex)[0] === "gif"){

        }
        else {
          this.setState({errorDlgOpen : true});
        }
      }
      reader.readAsDataURL(file)
    }
    else {
      this.setState({slideuploadfile:''});
    }
  }



  switchValueChangeHandler = () =>{
    const {store, dispatch} = this.props;
      // console.log(this.state.file);
      var layoutConfig = store.builder.layoutConfig;
      layoutConfig.loadingCSS = {
        display : 'block',
        opacity:'0.5',
        pointerEvents:'none'
      };
      dispatch(builder.actions.setLayoutConfigs(layoutConfig));
      fetch(`https://dev.imcado.app/event/` + this.state.eventId + '/',
      {
        method : 'PUT',
        mode: 'cors',
        headers:{
          'Content-Type': 'application/octet-stream',
          'x-zumo-auth' : store.auth.user.xZumoAuth
        },
        body:JSON.stringify({
          "Name" : this.state.showData.Name,
          "IsOpen" : !this.state.showData.IsOpen,
          "StartDateTime" : this.state.showData.StartDateTime,
          "EndDateTime" : this.state.showData.EndDateTime
         })
      })
      .then(res =>{
        if (res.status === 202){
          setTimeout(function() { //Start the timer
            fetch(`https://dev.imcado.app/event/` + this.state.eventId,
              {
              method : 'GET',
              mode: 'cors',
              headers:{
                'Content-Type': 'application/json',
                'x-zumo-auth' : store.auth.user.xZumoAuth
              }
            })
            .then(res => res.json())
            .then(data=> {
              this.setState({showData:data});
              layoutConfig.loadingCSS = {
                display : 'none',
                opacity:'1',
                pointerEvents:'all'
              };
              dispatch(builder.actions.setLayoutConfigs(layoutConfig));
              this.setState(
                {
                  background: '#fff',
                  pointerEvents: 'all',
                  display:'none'
                }
              );
            });
          }.bind(this), 1500)
        }
        else {
          this.setState(
            {
              background: '#fff',
              pointerEvents: 'all',
              display:'none'
            }
          );
          this.setState({errorDlgOpen : true});
        }
      });
  }

  changeEventNameHandler = () =>{
    if (this.state.newEventNameValue === '') return;
    const {store, dispatch} = this.props;
      // console.log(this.state.file);
      this.setState(
        {
          background: '#ddd',
          pointerEvents: 'none',
          display:'block'
        }
      );
      fetch(`https://dev.imcado.app/event/` + this.state.eventId + '/',
      {
        method : 'PUT',
        mode: 'cors',
        headers:{
          'Content-Type': 'application/octet-stream',
          'x-zumo-auth' : store.auth.user.xZumoAuth
        },
        body:JSON.stringify({
          "Name" : this.state.newEventNameValue,
          "StartDateTime" : this.state.showData.StartDateTime,
          "EndDateTime" : this.state.showData.EndDateTime
         })
      })
      .then(res =>{
        if (res.status === 202){
          setTimeout(function() { //Start the timer
            var layoutConfig = store.builder.layoutConfig;
            layoutConfig.loadingCSS = {
              display : 'block',
              opacity:'0.5',
              pointerEvents:'none'
            };
            dispatch(builder.actions.setLayoutConfigs(layoutConfig));
  
            fetch(`https://dev.imcado.app/event/` + this.state.eventId,
              {
              method : 'GET',
              mode: 'cors',
              headers:{
                'Content-Type': 'application/json',
                'x-zumo-auth' : store.auth.user.xZumoAuth
              }
            })
            .then(res => res.json())
            .then(data=> {
              this.setState({showData:data});
              layoutConfig.loadingCSS = {
                display : 'none',
                opacity:'1',
                pointerEvents:'all'
              };
              dispatch(builder.actions.setLayoutConfigs(layoutConfig));
              this.setState({
                editEventNameDlgOpen : false
              });
              this.setState(
                {
                  background: '#fff',
                  pointerEvents: 'all',
                  display:'none'
                }
              );
            });
          }.bind(this), 1500)
        }
        else {
          this.setState(
            {
              background: '#fff',
              pointerEvents: 'all',
              display:'none'
            }
          );
          this.setState({errorDlgOpen : true});
        }
      });
  }

  changeAccessCodeHandler = () =>{
    if (this.state.newAccessCodeValue === '') return;
    const {store, dispatch} = this.props;
      this.setState(
        {
          background: '#ddd',
          pointerEvents: 'none',
          display:'block'
        }
      );
      fetch(`https://dev.imcado.app/event/` + this.state.eventId + '/accessCode',
      {
        method : 'POST',
        mode: 'cors',
        headers:{
          'Content-Type': 'application/octet-stream',
          'x-zumo-auth' : store.auth.user.xZumoAuth
        },
        body:JSON.stringify({
          "AccessCode" : this.state.newAccessCodeValue
         })
      })
      .then(res =>{
        if (res.status === 202){
          setTimeout(function() { //Start the timer
            var layoutConfig = store.builder.layoutConfig;
            layoutConfig.loadingCSS = {
              display : 'block',
              opacity:'0.5',
              pointerEvents:'none'
            };
            dispatch(builder.actions.setLayoutConfigs(layoutConfig));
  
            fetch(`https://dev.imcado.app/event/` + this.state.eventId,
              {
              method : 'GET',
              mode: 'cors',
              headers:{
                'Content-Type': 'application/json',
                'x-zumo-auth' : store.auth.user.xZumoAuth
              }
            })
            .then(res => res.json())
            .then(data=> {
              this.setState({showData:data});
              layoutConfig.loadingCSS = {
                display : 'none',
                opacity:'1',
                pointerEvents:'all'
              };
              dispatch(builder.actions.setLayoutConfigs(layoutConfig));
              this.setState({
                editAccessCodeDlgOpen : false
              });
              this.setState(
                {
                  background: '#fff',
                  pointerEvents: 'all',
                  display:'none'
                }
              );
            });
          }.bind(this), 1500)
        }
        else {
          this.setState(
            {
              background: '#fff',
              pointerEvents: 'all',
              display:'none'
            }
          );
          this.setState({errorDlgOpen : true});
        }
      });
  }

  changeSlideShowUrlHandler = () =>{
    if (this.state.newSlideShowUrlValue === '') return;
    const {store, dispatch} = this.props;
      this.setState(
        {
          background: '#ddd',
          pointerEvents: 'none',
          display:'block'
        }
      );
      fetch(`https://dev.imcado.app/event/` + this.state.eventId + '/slideShowUrl',
      {
        method : 'POST',
        mode: 'cors',
        headers:{
          'Content-Type': 'application/octet-stream',
          'x-zumo-auth' : store.auth.user.xZumoAuth
        },
        body:JSON.stringify({
          "Url" : this.state.newSlideShowUrlValue
         })
      })
      .then(res =>{
        if (res.status === 202){
          setTimeout(function() {
            var layoutConfig = store.builder.layoutConfig;
            layoutConfig.loadingCSS = {
              display : 'block',
              opacity:'0.5',
              pointerEvents:'none'
            };
            dispatch(builder.actions.setLayoutConfigs(layoutConfig));
  
            fetch(`https://dev.imcado.app/event/` + this.state.eventId,
              {
              method : 'GET',
              mode: 'cors',
              headers:{
                'Content-Type': 'application/json',
                'x-zumo-auth' : store.auth.user.xZumoAuth
              }
            })
            .then(res => res.json())
            .then(data=> {
              this.setState({showData:data});
              layoutConfig.loadingCSS = {
                display : 'none',
                opacity:'1',
                pointerEvents:'all'
              };
              dispatch(builder.actions.setLayoutConfigs(layoutConfig));
              this.setState({
                editSlideShowUrlDlgOpen : false
              });
              this.setState(
                {
                  background: '#fff',
                  pointerEvents: 'all',
                  display:'none'
                }
              );
            });
          }.bind(this), 1500)
        }
        else {
          this.setState(
            {
              background: '#fff',
              pointerEvents: 'all',
              display:'none'
            }
          );
          this.setState({errorDlgOpen : true});
        }
      });
  }

  createBinaryString = (nMask) => {
    
    for (var nFlag = 0, nShifted = nMask, sMask = ""; nFlag < 32;
         nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
    return sMask.substr(sMask.length - 5);
  }

  LogoDeleteHandler = () =>{
    const {store, dispatch} = this.props;
    
    // console.log(this.state.file);
    this.setState(
      {
        background: '#ddd',
        pointerEvents: 'none',
        display:'block'
      }
    );
    fetch(`https://dev.imcado.app/event/` + this.state.eventId + '/logo',
    {
      method : 'DELETE',
      mode: 'cors',
      headers:{
        'x-zumo-auth' : store.auth.user.xZumoAuth
      },
      body:this.state.file
    })
    .then(res =>{
      if (res.status === 202){
        setTimeout(function() { //Start the timer
          var layoutConfig = store.builder.layoutConfig;
          layoutConfig.loadingCSS = {
            display : 'block',
            opacity:'0.5',
            pointerEvents:'none'
          };
          dispatch(builder.actions.setLayoutConfigs(layoutConfig));

          fetch(`https://dev.imcado.app/event/` + this.state.eventId,
            {
            method : 'GET',
            mode: 'cors',
            headers:{
              'Content-Type': 'application/json',
              'x-zumo-auth' : store.auth.user.xZumoAuth
            }
          })
          .then(res => res.json())
          .then(data=> {
            this.setState({showData:data});
            layoutConfig.loadingCSS = {
              display : 'none',
              opacity:'1',
              pointerEvents:'all'
            };
            dispatch(builder.actions.setLayoutConfigs(layoutConfig));
            this.setState({
              LogoDeleteDlgOpen : false
            });
            
            this.setState(
              {
                background: '#fff',
                pointerEvents: 'all',
                display:'none'
              }
            );
          });
        }.bind(this), 1500)
      }
      else {
        this.setState(
          {
            background: '#fff',
            pointerEvents: 'all',
            display:'none'
          }
        );
      }
    })
  } 

  render() {
    const {store} = this.props;
    //User change Permissions
    var Permissions = this.createBinaryString(parseInt(store.auth.user.FeaturesFlag));
    var logoChangePermission = Permissions.substr(1, 1);
    var slideShowUrlChangePermission = Permissions.substr(2, 1);
    var slidesChangePermission = Permissions.substr(3, 1);
    var accessCodeChangePermission = Permissions.substr(4, 1);

    var startDate = new Date(this.state.showData.StartDateTime);
    var endDate = new Date(this.state.showData.EndDateTime);
    startDate = (startDate.getMonth()+1) + '/' + startDate.getDate() + "/" + startDate.getFullYear();
    endDate = (endDate.getMonth()+1) + '/' + endDate.getDate() + "/" + endDate.getFullYear();

    return (
      <>
      <div>

      <Dialog
        open={this.state.deleteSlideDlgOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div style={{background:this.state.background, pointerEvents:this.state.pointerEvents, width:'400px'}}>
            <CircularProgress className="kt-splash-screen__spinner" style={{position: 'absolute','zIndex': '1','top': '45%','left': '48%', display:this.state.display}} />
            <DialogTitle id="alert-dialog-title">{"Dialog"}</DialogTitle>
            <DialogContent style={{"marginTop":"0px"}}>
              Are you really delete this Slide Photo?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.SlidePhotoDeleteHandler()} color="primary">
                OK
              </Button>
              <Button onClick={() => this.setState({deleteSlideDlgOpen : false})} color="primary">
                Cancel
              </Button>
            </DialogActions>
        </div>
      </Dialog>

      <Dialog
        open={this.state.editSlideShowUrlDlgOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div style={{background:this.state.background, pointerEvents:this.state.pointerEvents, width:'400px'}}>
            <CircularProgress className="kt-splash-screen__spinner" style={{position: 'absolute','zIndex': '1','top': '45%','left': '48%', display:this.state.display}} />
            <DialogTitle id="alert-dialog-title">{"Edit NiceSlideShowUrl"}</DialogTitle>
            <DialogContent style={{"marginTop":"0px"}}>
              <TextField
                id="filled-name"
                label="New NiceSlideShowUrl"
                margin="normal"
                style={{"marginTop":"0px"}}
                value={this.state.newSlideShowUrlValue}
                onChange={(e) => this.setState({newSlideShowUrlValue : e.target.value})}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.changeSlideShowUrlHandler} color="primary" autoFocus>
                OK
              </Button>
              <Button onClick={() => this.setState({editSlideShowUrlDlgOpen : false})} color="primary">
                Cancel
              </Button>
            </DialogActions>
        </div>
      </Dialog>
      
      <Dialog
        open={this.state.editAccessCodeDlgOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div style={{background:this.state.background, pointerEvents:this.state.pointerEvents, width:'400px'}}>
            <CircularProgress className="kt-splash-screen__spinner" style={{position: 'absolute','zIndex': '1','top': '45%','left': '48%', display:this.state.display}} />
            <DialogTitle id="alert-dialog-title">{"Edit AccessCode"}</DialogTitle>
            <DialogContent style={{"marginTop":"0px"}}>
              <TextField
                id="filled-name"
                label="New AccessCode"
                margin="normal"
                style={{"marginTop":"0px"}}
                value={this.state.newAccessCodeValue}
                onChange={(e) => this.setState({newAccessCodeValue : e.target.value})}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.changeAccessCodeHandler} color="primary" autoFocus>
                OK
              </Button>
              <Button onClick={() => this.setState({editAccessCodeDlgOpen : false})} color="primary">
                Cancel
              </Button>
            </DialogActions>
        </div>
      </Dialog>
      
      <Dialog
        open={this.state.editEventNameDlgOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div style={{background:this.state.background, pointerEvents:this.state.pointerEvents, width:'400px'}}>
            <CircularProgress className="kt-splash-screen__spinner" style={{position: 'absolute','zIndex': '1','top': '45%','left': '48%', display:this.state.display}} />
            <DialogTitle id="alert-dialog-title">{"Edit EventName"}</DialogTitle>
            <DialogContent style={{"marginTop":"0px"}}>
              <TextField
                id="filled-name"
                label="New Event Name"
                margin="normal"
                style={{"marginTop":"0px"}}
                value={this.state.newEventNameValue}
                onChange={(e) => this.setState({newEventNameValue : e.target.value})}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.changeEventNameHandler} color="primary" autoFocus>
                OK
              </Button>
              <Button onClick={() => this.setState({editEventNameDlgOpen : false})} color="primary">
                Cancel
              </Button>
            </DialogActions>
        </div>
      </Dialog>

      <Dialog
        open={this.state.uploadDlgOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div style={{background:this.state.background, pointerEvents:this.state.pointerEvents}}>
            <CircularProgress className="kt-splash-screen__spinner" style={{position: 'absolute','zIndex': '1','top': '45%','left': '48%', display:this.state.display}} />
            <DialogTitle id="alert-dialog-title">{"Upload Logo"}</DialogTitle>
            <DialogContent style={{"marginTop":"0px"}}>
              <input className="fileInput" 
                type="file" 
                onChange={(e)=>this._handleImageChange(e)} 
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleUpload} color="primary" autoFocus>
                Upload
              </Button>
              <Button onClick={this.handleUploadCancel} color="primary">
                Cancel
              </Button>
            </DialogActions>
        </div>
      </Dialog>

      <Dialog
        open={this.state.LogoDeleteDlgOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div style={{background:this.state.background, pointerEvents:this.state.pointerEvents, width:'400px'}}>
            <CircularProgress className="kt-splash-screen__spinner" style={{position: 'absolute','zIndex': '1','top': '45%','left': '48%', display:this.state.display}} />
            <DialogTitle id="alert-dialog-title">{"Dialog"}</DialogTitle>
            <DialogContent style={{"marginTop":"0px"}}>
              Are you really delete logo?
            </DialogContent>
            <DialogActions>
              <Button onClick={this.LogoDeleteHandler} color="primary">
                OK
              </Button>
              <Button onClick={() => this.setState({LogoDeleteDlgOpen : false})} color="primary">
                Cancel
              </Button>
            </DialogActions>
        </div>
      </Dialog>

      <Dialog
        open={this.state.uploadSlideDlgOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div style={{background:this.state.background, pointerEvents:this.state.pointerEvents}}>
            <CircularProgress className="kt-splash-screen__spinner" style={{position: 'absolute','zIndex': '1','top': '45%','left': '48%', display:this.state.display}} />
            <DialogTitle id="alert-dialog-title">{"Upload Slide Photo"}</DialogTitle>
            <DialogContent style={{"marginTop":"0px"}}>
              <input className="fileInput" 
                type="file" 
                onChange={(e)=>this._handleSlideImageChange(e)} 
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleUploadSlideHandler} color="primary" autoFocus>
                Upload
              </Button>
              <Button onClick={() => this.setState({uploadSlideDlgOpen : false})} color="primary">
                Cancel
              </Button>
            </DialogActions>
        </div>
      </Dialog>
        <Dialog open={this.state.errorDlgOpen}>
          <DialogTitle id="alert-dialog-title">{"Error"}</DialogTitle>
            <DialogContent style={{"marginTop":"0px"}}>
              You should upload image like *.png, *.tiff, *.jpg, *.gif
           </DialogContent>
          <DialogActions>
              <Button onClick={() => this.setState({errorDlgOpen : false})} color="primary">
                OK
              </Button>
          </DialogActions>
        </Dialog>



        <div className="row">
          <div className="col-md-4">      
            <Portlet className="kt-portlet--border-bottom-brand">
              <PortletBody fluid={true} style={{padding:"15px"}}>
                <div className="kt-widget26" style={{height:'160px'}}>
                    <span >Event
                    <Button style={{fontSize:'15pt', float:'right'}} onClick= {() => {
                      this.setState({editEventNameDlgOpen : true, newEventNameValue:this.state.showData.Name});
                    }}>
                      <i className="flaticon2-edit"></i>
                    </Button>
                    </span>
                    <span style={{'fontSize':'40px', 'textAlign':'center', 'paddingTop':'20px','paddingBottom':'20px', height:'100px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap'}} title={this.state.showData.Name}>{this.state.showData.Name}</span>
                    <div style={{'textAlign':'right', 'height':'19.2px'}}>
                      <span style={{paddingRight:"5px"}}>{startDate}</span>
                      -
                      <span style={{paddingLeft:"5px"}}>{endDate}</span>
                    </div>
                </div>
              </PortletBody>
            </Portlet>
          </div>


          <div className="col-md-4">      
            <Portlet className="kt-portlet--border-bottom-brand">
              <PortletBody fluid={true} style={{padding:"15px"}}>
                <div className="hovereffect">
                    <span style={{float:'left'}}>Logo</span>
                    <img className="img-responsive" src={this.state.showData.LogoLink} alt=""></img>
                    { logoChangePermission === '1' &&
                    <div className="overlay">
                      <Button className="info" onClick={this.uploadClick}>
                        <CloudUploadIcon style={{fontSize: '3.5rem'}}/>
                      </Button>
                      <Button className="info" onClick={this.removeLogoClick}>
                        <DeleteIcon style={{fontSize: '3.3rem'}}/>
                      </Button>
                    </div>
                    }
                </div>
              </PortletBody>
            </Portlet>
          </div>
          
          <div className="col-md-4">      
            <Portlet className="kt-portlet--border-bottom-brand" style={{marginBottom:'10px'}}>
              <PortletBody fluid={true} style={{padding:"15px"}}>
                <div className="hovereffect" style={{height:'58px'}}>
                  <span style={{float:'left'}}>Number of photos</span>
                  <span style={{fontSize:"40pt", position:'absolute', top:'-5px', right:'90px'}}>{this.state.showData.NumberOfPhotos}</span>
                </div>
              </PortletBody>
            </Portlet>
            <Portlet className="kt-portlet--border-bottom-brand">
              <PortletBody fluid={true} style={{padding:"15px"}}>
                <div className="hovereffect" style={{height:'58px'}}>
                  <span style={{float:'left'}}>Number of participants</span>
                  <span style={{fontSize:"40pt", position:'absolute', top:'-5px', right:'90px'}}>{this.state.showData.NumberOfParticipants}</span>
                </div>
              </PortletBody>
            </Portlet>
          </div>
          
          <div className="clearboth"></div>

          <div className="col-md-4">      
            <Portlet className="kt-portlet--border-bottom-brand">
              <PortletBody fluid={true} style={{padding:"15px"}}>
                <div className="kt-widget26" style={{height:'160px'}}>
                  <span >Access Code
                    {accessCodeChangePermission === '1' &&
                    <Button style={{fontSize:'15pt', float:'right'}} onClick= {() => {
                      this.setState({editAccessCodeDlgOpen : true, newAccessCodeValue:this.state.showData.AccessCode === null ? '' : this.state.showData.AccessCode});
                    }}>
                      <i className="flaticon2-edit"></i>
                    </Button>
                    }
                  </span>
                  <span style={{'fontSize':'40px', 'textAlign':'center', 'paddingTop':'20px','paddingBottom':'20px', height:'100px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap'}} title={this.state.showData.AccessCode}>{this.state.showData.AccessCode}</span>
                </div>
              </PortletBody>
            </Portlet>
          </div>

          <div className="col-md-4">      
            <Portlet className="kt-portlet--border-bottom-brand">
              <PortletBody fluid={true} style={{padding:"15px"}}>
                <div className="kt-widget26" style={{height:'160px'}}>
                    <span >Nice slideshow url
                    {slideShowUrlChangePermission === '1' &&
                    <Button style={{fontSize:'15pt', float:'right'}} onClick= {() => {
                      this.setState({editSlideShowUrlDlgOpen : true, newSlideShowUrlValue:this.state.showData.SlideshowUri === null ? '' : this.state.showData.SlideshowUri});
                    }}>
                      <i className="flaticon2-edit"></i>
                    </Button>
                    }
                    </span>
                    <span style={{'fontSize':'25px', 'textAlign':'center', 'paddingTop':'20px','paddingBottom':'20px', height:'100px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap'}} title={this.state.showData.SlideshowUri}>{this.state.showData.SlideshowUri}</span>
                    
                </div>
              </PortletBody>
            </Portlet>
          </div>

          <div className="col-md-4">      
            <Portlet className="kt-portlet--border-bottom-brand">
              <PortletBody fluid={true} style={{padding:"15px"}}>
                <div className="kt-widget26" style={{height:'160px'}}>
                    <span >Is public</span>
                    <div style={{margin:'auto'}}>
                      <Switch
                        inputProps={{ "aria-label": "secondary checkbox" }}
                        onChange={this.switchValueChangeHandler}
                        value={this.state.showData.IsOpen}
                      />
                    </div>
                </div>
              </PortletBody>
            </Portlet>
          </div>
          <div className="clearboth"></div>
          <div className="col-md-12">      
            <Portlet className="kt-portlet--border-bottom-brand">
              <PortletBody fluid={true} style={{padding:"15px"}}>
                <div className="kt-widget26" style={{height:'160px'}}>
                    <span >Own slides:</span>
                    <div className="gridlist-root">
                      <GridList className='gridlist' >
                        {this.state.showData && this.state.showData.Slides && this.state.showData.Slides.map(slide => (
                          <GridListTile  key={slide.SlideId} >
                            <Button onClick={() => this.slideDeleteClick(slide.SlideId)} style={{background:'url(' + slide.Uri + ')'}}>
                              <DeleteIcon style={{fontSize: '3.5rem'}}/>
                              <div className="overlay"></div>
                            </Button>
                          </GridListTile>
                        ))}
                        { slidesChangePermission === "1" &&
                        <GridListTile>
                          <Button onClick={this.slideUploadClick}>
                            <CloudUploadIcon style={{fontSize: '3.5rem'}}/>
                          </Button>
                        </GridListTile>
                        }
                      </GridList>
                    </div>
                </div>
              </PortletBody>
            </Portlet>
          </div>
        </div>
       </div> 
      </>
    );
  }
}
const mapStateToProps = store => ({
  store
});

export default connect(mapStateToProps)(EventDetail);