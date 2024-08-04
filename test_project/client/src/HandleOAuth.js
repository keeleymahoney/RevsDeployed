import React, { Component } from "react";
import "./App.css";

/**
 * @author Brandon Cisneros
 * Component for HandleOAuth
 */
class HandleOAuth extends Component {
    /**
     * Constructs a new instance of the HandleOauth component
     * 
     * @param {object} props The properties passed to the component.
     */
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * Executes when the component is mounted.
     * Calls methods to either recieve OAuth token and route accordingly, or
     * initiates Google OAuth 2.0 flow.
     * This lifecycle method is invoked immediately after a component is mounted.
     */
    componentDidMount() {
      console.log('1');
      var YOUR_CLIENT_ID = '726678901306-odlt23m8u05eh9imf8jovprsfdmvgmg3.apps.googleusercontent.com';
      var YOUR_REDIRECT_URI = 'https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/handleOAuth';
      var fragmentString = window.location.hash.substring(1);
    
      // Parse query string to see if page request is coming from OAuth 2.0 server.
      var params = {};
      var regex = /([^&=]+)=([^&]*)/g, m;
      while (m = regex.exec(fragmentString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
      }
      console.log('2');

      /*
       * Requests GMail API information and routes accordingly for authorized users
       */
      this.trySampleRequest = () => {
        console.log('5');
        var params = JSON.parse(localStorage.getItem('oauth2-test-params'));
        if (params && params['access_token']) {
          console.log('Login Initiated');

          var authUser = {};
          fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
            method: "GET",
            headers: {
              "Authorization": "Bearer "+params['access_token']
          } 
        })
              .then(res => res.json())
              .then(res => {authUser = res;})
              .then( authuser => {
                console.log(JSON.stringify(authUser));
                console.log(authUser["emailAddress"]);
                console.log(authUser.emailAddress);
                console.log(JSON.stringify(authUser.emailAddress));
                if (authUser.emailAddress == "brandonocisneros@gmail.com") {
                  window.location.href = "https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/ingredients"
                }
                else if (authUser.emailAddress == "alnotha@gmail.com") {
                  window.location.href = "https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/ingredients"
                }
                else if (authUser.emailAddress == "keeley.a.mahoney@gmail.com") {
                  window.location.href = "https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/ingredients"
                }
                else if (authUser.emailAddress == "joannechanliu@tamu.edu") {
                  window.location.href = "https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/ingredients"
                }
                else {
                  localStorage.setItem('oauth2-test-params', '{}');
                  window.location.href = "https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/"
                }      
              }
              )
              .catch(err => console.error(err));
        } else {
          this.oauth2SignIn();
        }
      }
    
      /*
       * Create form to request access token from Google's OAuth 2.0 server.
       */
      this.oauth2SignIn = () => {
        console.log('6');
        // Google's OAuth 2.0 endpoint for requesting an access token
        var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    
        // Create element to open OAuth 2.0 endpoint in new window.
        var form = document.createElement('form');
        form.setAttribute('method', 'GET'); // Send as a GET request.
        form.setAttribute('action', oauth2Endpoint);
    
        // Parameters to pass to OAuth 2.0 endpoint.
        var params = {'client_id': YOUR_CLIENT_ID,
                      'redirect_uri': YOUR_REDIRECT_URI,
                      'scope': 'https://www.googleapis.com/auth/gmail.metadata',
                      'state': 'try_sample_request',
                      'include_granted_scopes': 'true',
                      'response_type': 'token'};
    
        // Add form parameters as hidden input values.
        for (var p in params) {
          var input = document.createElement('input');
          input.setAttribute('type', 'hidden');
          input.setAttribute('name', p);
          input.setAttribute('value', params[p]);
          form.appendChild(input);
        }
        console.log('7');
        // Add form to page and submit it to open the OAuth 2.0 endpoint.
        document.body.appendChild(form);
        form.submit();
      }


      if (Object.keys(params).length > 0) {
        console.log('3');
        localStorage.setItem('oauth2-test-params', JSON.stringify(params) );
        if (params['state'] && params['state'] === 'try_sample_request') {
          console.log('4');
          this.trySampleRequest();
        }
      }
    


      this.trySampleRequest();

  }
  
    /**
     * Renders the HandleOAuth screen component.
     * @returns {JSX.Element} The JSX element representing the HandleOauth screen.
     */
    render() {
        // console.log(this.state.apiResponse);
        return (<div></div>);
    }
}

export default HandleOAuth;
