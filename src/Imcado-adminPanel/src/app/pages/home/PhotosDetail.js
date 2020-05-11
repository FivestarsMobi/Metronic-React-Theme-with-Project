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
import { CircularProgress } from "@material-ui/core";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'

class PhotosDetail extends React.Component {
  constructor(props){
    super(props);
    const { params } = this.props.match;
    this.state={
      eventId : params.id,
      background: '#fff',
      pointerEvents: 'all',
      display:'none',
      showData:{},
      photoData:{},
      //upload part
      uploadDlgOpen : false,
      file:'',
      errorDlgOpen : false,
      downloadAllDlgOpen : false,
      downloadAlertDlg : false,
      //lightbox
      photoIndex : 0,
      outboxOpen : false,
      outboxImages : []
    }
  }


  async componentDidMount() {
    this.refreshPhotoPage();
  }

  refreshPhotoPage = async () =>{
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

    const response1 = await fetch(`https://dev.imcado.app/event/` + this.state.eventId + '/photos',
      {
      method : 'GET',
      mode: 'cors',
      headers:{
        'Content-Type': 'application/json',
        'x-zumo-auth' : store.auth.user.xZumoAuth
      }
    });
    var data1 = await response1.json();
    //2,1,2,1,  1,1,1,1    1,2,1,2
    var photo_index = 0;
    for (var i in data1.Items){
      data1.Items[i].photoIndex = i;
      if (photo_index > 13) photo_index = 0;
      switch (photo_index){
        case 0:
          data1.Items[i].col = 2;
          break;
        case 1:
          data1.Items[i].col = 1;
          break;
        case 2:
          data1.Items[i].col = 2;
          break;
        case 3:
          data1.Items[i].col = 1;
          break;
        case 4:
          data1.Items[i].col = 1;
          break;
        case 5:
          data1.Items[i].col = 1;
          break;
        case 6:
          data1.Items[i].col = 1;
          break;
        case 7:
          data1.Items[i].col = 1;
          break;
        case 8:
          data1.Items[i].col = 1;
          break;
        case 9:
          data1.Items[i].col = 1;
          break;
        case 10:
          data1.Items[i].col = 1;
          break;
        case 11:
          data1.Items[i].col = 2;
          break;
        case 12:
          data1.Items[i].col = 1;
          break;
        case 13:
          data1.Items[i].col = 2;
          break;

        default:
            data1.Items[i].col = 1;
            break;
      }
      photo_index++;
    }

    this.setState({photoData:data1});
    var outboximgurls = [];
    for (var ii in data1.Items){
      outboximgurls.push(data1.Items[ii].Url);
    }
    this.setState({outboxImages:outboximgurls});
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
      this.refreshPhotoPage();
    }
  }


  handleUpload = () =>{
    
    const {store} = this.props;
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
      fetch(`https://dev.imcado.app/event/` + this.state.eventId + '/photos/dslr',
      {
        method : 'POST',
        mode: 'cors',
        headers:{
          'Content-Type': 'application/octet-stream',
          'x-zumo-auth' : store.auth.user.xZumoAuth,
          'FileContentType': 'image/png',
          "PhotoTakenDate" : new Date()
        },
        body:this.state.file
      })
      .then(res =>{
        if (res.status === 202){
          setTimeout(function() { //Start the timer
            //this.refreshPhotoPage();
            var col = 0;
            switch (this.state.photoData.Items.length % 14){
              case 0:
                col = 2;
                break;
              case 1:
                col = 1;
                break;
              case 2:
                col = 2;
                break;
              case 3:
                col = 1;
                break;
              case 4:
                col = 1;
                break;
              case 5:
                col = 1;
                break;
              case 6:
                col = 1;
                break;
              case 7:
                col = 1;
                break;
              case 8:
                col = 1;
                break;
              case 9:
                col = 1;
                break;
              case 10:
                col = 1;
                break;
              case 11:
                col = 2;
                break;
              case 12:
                col = 1;
                break;
              case 13:
                col = 2;
                break;
              default:
                col = 1;
                break;
            }
            
            var tile = {
              TakenBy: "",
              TakenByProfilePictureLink: "",
              IsYours: true,
              CanBeDeleted: true,
              FullResolutionPhoto: "",
              PhotoId: new Date(),
              TakenDate: new Date(),
              Url: URL.createObjectURL(this.state.file),
              col: col,
              photoIndex : this.state.photoData.Items.length
            };
            var tiles = this.state.photoData;
            tiles.Items.push(tile);
            this.setState({photoData : tiles});
            this.setState(
              {
                background: '#fff',
                pointerEvents: 'all',
                display:'none',
                uploadDlgOpen:false
              }
            );
          }.bind(this), 0);
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

  downloadAllHandler = () => {
    const {store} = this.props;
    fetch(`https://dev.imcado.app/event/` + this.state.eventId + '/photos/archive',
    {
      method : 'POST',
      mode: 'cors',
      headers:{
        'x-zumo-auth' : store.auth.user.xZumoAuth
      }
    }).then(res =>{
      if (res.status !== 202){
        this.setState({errorDlgOpen:true});
      }
    });
    this.setState({downloadAllDlgOpen:false, downloadAlertDlg:true});
  }

  clickImageHandler = (Index) => {
    this.setState({photoIndex:Index, outboxOpen:true});
  }


  render() {
    // console.log(this.state.photoData);
    console.log(this.state.photoIndex); 
    return (
      <>
        <div>

          <Dialog open={this.state.downloadAlertDlg}>
            <DialogTitle id="alert-dialog-title">{"Dialog"}</DialogTitle>
              <DialogContent style={{"marginTop":"0px"}}>
                We will send link to your mail box.
                Please check your mailbox later.
            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.setState({downloadAlertDlg : false})} color="primary">
                  OK
                </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={this.state.downloadAllDlgOpen}>
            <DialogTitle id="alert-dialog-title">{"Download all photos?"}</DialogTitle>
              <DialogContent style={{"marginTop":"0px"}}>
                You will receive an email with a link when your photos are ready.
                Do you want to start this action?
            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.downloadAllHandler()} color="primary">
                  OK
                </Button>
                <Button onClick={() => this.setState({downloadAllDlgOpen : false})} color="primary">
                  Cancel
                </Button>
            </DialogActions>
          </Dialog>
          
          <Dialog open={this.state.errorDlgOpen}>
            <DialogTitle id="alert-dialog-title">{"Error"}</DialogTitle>
              <DialogContent style={{"marginTop":"0px"}}>
                Error occurs. Please try again.
            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.setState({errorDlgOpen : false})} color="primary">
                  OK
                </Button>
            </DialogActions>
          </Dialog>

          <Dialog
          open={this.state.uploadDlgOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
            <div style={{background:this.state.background, pointerEvents:this.state.pointerEvents}}>
                <CircularProgress className="kt-splash-screen__spinner" style={{position: 'absolute','zIndex': '1','top': '45%','left': '48%', display:this.state.display}} />
                <DialogTitle id="alert-dialog-title">{"Upload Photo"}</DialogTitle>
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
          <div className="col-md-12" style={{padding:'0px 0px'}}>      
            <Portlet className="kt-portlet--border-bottom-brand">
              <PortletBody fluid={true} style={{padding:"15px"}}>
                <div style={{height:'50px', width:'100%'}}>
                  <span style={{margin:'auto 0', fontSize:'30pt'}} >{this.state.showData.Name}</span>
                  <Button variant="contained" color="primary" onClick={() => this.setState({downloadAllDlgOpen:true})}  style={{marginTop:'5px', padding:'11px 18px', float:'right', marginLeft:'10px', width:'140px'}}>
                    Download All
                  </Button>
                  <Button variant="contained" color="primary" onClick={()=>{this.setState({uploadDlgOpen:true})}}  style={{marginTop:'5px', padding:'11px 18px', float:'right', width:'140px'}}>
                    Upload
                  </Button>
                </div>
              </PortletBody>
            </Portlet>
          </div>
          <div className='photo-root'>
            {this.state.photoData && this.state.photoData.Items &&
            <GridList cellHeight={160} className='photo-gridlist' cols={6}>
              { this.state.photoData.Items.map(tile => (
                <GridListTile key={tile.PhotoId} cols={tile.col}>
                  <img src={tile.Url} alt={tile.TakenDate} className="photo-img"/>
                  <button onClick={()=> this.clickImageHandler(tile.photoIndex)}>
                  </button>
                </GridListTile>
              ))}
            </GridList>
            }
          </div>

          {this.state.outboxOpen && (
            <Lightbox
              mainSrc={this.state.outboxImages[this.state.photoIndex]}
              nextSrc={this.state.outboxImages[(this.state.photoIndex + 1) % this.state.outboxImages.length]}
              prevSrc={this.state.outboxImages[(this.state.photoIndex + this.state.outboxImages.length - 1) % this.state.outboxImages.length]}
              onCloseRequest={() => this.setState({ outboxOpen: false })}
              onMovePrevRequest={() =>{
                this.setState({
                  photoIndex: (parseInt(this.state.photoIndex) + this.state.outboxImages.length - 1) % this.state.outboxImages.length,
                });
              }
                
              }
              onMoveNextRequest={() =>{
                  this.setState({
                    photoIndex: (parseInt(this.state.photoIndex) + 1) % this.state.outboxImages.length,
                  })
                }
              }
            />
          )}
        
        </div>
      </>
    );
  }
}
const mapStateToProps = store => ({
  store
});

export default connect(mapStateToProps)(PhotosDetail);