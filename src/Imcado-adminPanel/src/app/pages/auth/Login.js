import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import * as auth from "../../store/ducks/auth.duck";
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { CircularProgress } from "@material-ui/core";

class Login extends React.Component {

  constructor(props){
    super(props);
    this.state={
      display:'none',
      opacity:'1',
      pointerEvents : 'all'
    };
  }

  setLoadingState = () =>{
    this.setState({
      display:'block',
      opacity:'0.5',
      pointerEvents:'none'
    })
  }

  responseGoogle = async (response) => {
    if (response && response.error){
      alert("Login by Google has error.  Please try again");
      return;
    }
    this.setLoadingState();
    var result = await fetch(`https://dev.imcado.app/.auth/login/google`,
    {
      method : 'POST',
      mode: 'cors',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        "id_token" : response.tokenId
      })
    });
    if (result && result.status === 200){
      var access_result = await result.json();
      var access_token = access_result.authenticationToken;
      var postUserinfo = await fetch(`https://dev.imcado.app/users`,
      {
        method : 'PUT',
        mode: 'cors',
        headers:{
          'Content-Type': 'application/json',
          'x-zumo-auth' : access_token
        },
        body:JSON.stringify({
          "Name" : response.profileObj.name,
          "Email" : response.profileObj.email,
          "ProfilePictureLink" : response.profileObj.imageUrl,
          "lang" : this.getUserDetectLanguage()
        })
      });
      if (postUserinfo.status === 202){
        var myinforesult = await fetch(`https://dev.imcado.app/users/current`,
        {
          method : 'GET',
          mode: 'cors',
          headers:{
            'Content-Type': 'application/json',
            'x-zumo-auth' : access_token
          }
        });
        if (myinforesult.status === 200){
          var myinfo = await myinforesult.json();
          this.props.fulfillUser({
            username: myinfo.Name,
            email: myinfo.Email,
            xZumoAuth: access_token,
            pic: myinfo.ProfilePictureLink,
            fullname: myinfo.Name,
            FeaturesFlag: myinfo.FeaturesFlag,
            ApplicationRated : myinfo.ApplicationRated,
            DataCollectionConsent : myinfo.DataCollectionConsent,
            lang : this.getUserDetectLanguage()
          })
        }
        else{
          alert("Login by Google has error.  Please try again");
          return;
        }
      }
      else{
        alert("Login by Google has error.  Please try again");
        return;
      }
    }
    else{
      alert("Login by Google has error.  Please try again");
      return;
    }

  }

  responseFacebook = async (response) => {
    if (response && ((response.status && response.status === "unknown") || !response.accessToken)){
      alert("Login by Facebook has error.  Please try again");
      return;
    }
    this.setLoadingState();
    var result = await fetch(`https://dev.imcado.app/.auth/login/facebook`,
    {
      method : 'POST',
      mode: 'cors',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        "access_token" : response.accessToken
      })
    });
    if (result && result.status === 200){
      var access_result = await result.json();
      var access_token = access_result.authenticationToken;
      var postUserinfo = await fetch(`https://dev.imcado.app/users`,
      {
        method : 'POST',
        mode: 'cors',
        headers:{
          'Content-Type': 'application/json',
          'x-zumo-auth' : access_token
        },
        body:JSON.stringify({
          "Name" : response.name,
          "Email" : response.email,
          "ProfilePictureLink" : response.picture.data.url,
          "lang" : this.getUserDetectLanguage()
        })
      });
      if (postUserinfo.status === 202){
        var myinforesult = await fetch(`https://dev.imcado.app/users/current`,
        {
          method : 'GET',
          mode: 'cors',
          headers:{
            'Content-Type': 'application/json',
            'x-zumo-auth' : access_token
          }
        });
        if (myinforesult.status === 200){
          var myinfo = await myinforesult.json();
          this.props.fulfillUser({
            username: myinfo.Name,
            email: myinfo.Email,
            xZumoAuth: access_token,
            pic: myinfo.ProfilePictureLink,
            fullname: myinfo.Name,
            FeaturesFlag: myinfo.FeaturesFlag,
            ApplicationRated : myinfo.ApplicationRated,
            DataCollectionConsent : myinfo.DataCollectionConsent,
            lang : this.getUserDetectLanguage()
          })
        }
        else{
          alert("Login by Facebook has error.  Please try again");
          return;
        }
      }
      else{
        alert("Login by Facebook has error.  Please try again");
        return;
      }
      
    }
    else{
      alert("Login by Facebook has error.  Please try again");
      return;
    }
    
    
  }

  failFacebooklogin = (response) => {
    if (response && ((response.status && response.status === "unknown") || !response.accessToken)){
      alert("Login by Facebook has error.  Please try again");
    }
  }

  getUserDetectLanguage = () =>{
    return window.navigator.userLanguage || window.navigator.language;
  }

  render() {
  
    return (
      <>
        <CircularProgress className="kt-splash-screen__spinner" style={{position: 'absolute','zIndex': '1','top': '45%','left': '50%', display:this.state.display}} />
        <div className="kt-login__body" style={{opacity:this.state.opacity, pointerEvents:this.state.pointerEvents}}>
          <div className="kt-login__form">
            <div className="kt-login__title">
              <h3 style={{marginBottom:'100px'}}>
                <FormattedMessage id="AUTH.LOGIN.TITLE" />
              </h3>
            </div>

            <div className="kt-login__options" style={{display:'block'}}>
              <FacebookLogin
                appId="1773560026284222"
                fields="name,email,picture"
                callback={this.responseFacebook}
                onFailure={this.failFacebooklogin}
                render={renderProps => (
                  <button onClick={renderProps.onClick} className="btn btn-primary kt-btn" style={{margin:'30px auto', display:'block', width:'200px', height:'50px'}}>
                    <i className="fab fa-facebook-f" />
                    Login by Facebook
                  </button>
                )}
              />
              
              <GoogleLogin
                clientId="407132015888-ap1eferj87mi6hl7leo6o997cneeogoe.apps.googleusercontent.com"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                cookiePolicy={'single_host_origin'}
                render={renderProps => (
                  <button className="btn btn-danger kt-btn" onClick={renderProps.onClick} style={{display:'block', margin:'auto', width:'200px', height:'50px'}}>
                    <i className="fab fa-google" />
                    Login by Google
                  </button>
                )}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (store) => ({
  store
});

export default connect(
    mapStateToProps,
    auth.actions
)(Login);
