import React, { Component } from 'react';
import Navbar from '../../components/navbar/Navbar.jsx';
import Footer from '../../components/footer/Footer.jsx';
import { ourFetch } from '../../shared/helperFunctions.js';
import { browserHistory } from 'react-router';

const conf = require('./../../shared/config')();

class App extends Component {
  constructor(props, context) {
    super(props);
    context.router;

    this.state = {
      editorTimerValue: 0,
      searchValue: '',

      // Authentication.
      auth2: null,
      isLoggedIn: false,
      userId: '',
      userToken: '',
      userName: '',
    };
    this.initGoogleAuth = this.initGoogleAuth.bind(this);
    this.loginGoogleSuccess = this.loginGoogleSuccess.bind(this);
    this.logOut = this.logOut.bind(this);
    this.getAppState = this.getAppState.bind(this);
  }

  getAppState() {
    return this.state;
  }

  componentWillMount() {
    const searchValue = this.props.location.query.q;
    this.setState({
      searchValue,
    });
  }

  loginGoogleSuccess() {
    const googleUser = this.state.auth2.currentUser.get();
    const userToken = googleUser.getAuthResponse().id_token;
    ourFetch(`${conf.apiUrl}/auth`, true, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userToken }),
    })
    .then((res) => {
      this.setState({
        isLoggedIn: true,
        userName: res.result.name,
        userId: res.result._id,
        userToken: userToken,
      }, () => {
        this.setCookie();
      });
    });
  }

  loginGoogleFailure() {
    console.log('login failure');
  }

  initGoogleAuth() {
    const self = this;
    gapi.load('auth2', function() {
      const auth2 = gapi.auth2.init({
        client_id: conf.googleClientId,
        fetch_basic_profile: true,
        scope: 'email profile openid'
      });
      self.setState({
        auth2,
      }, () => {
        self.state.auth2.attachClickHandler('btn-signin', {}, self.loginGoogleSuccess, self.loginGoogleFailure);
        self.refreshUserInfo();
      });
    })
  }

  refreshUserInfo() {
    const self = this;
    this.state.auth2.then(() => {
      if (this.state.auth2.isSignedIn.get()) { 
        const userId = this.getCookie('userId');
        const userToken = this.getCookie('userToken');
        const userName = this.getCookie('userName');
        if (userId && userToken && userName) {
          self.setState({
            isLoggedIn: true,
            userName: userName,
            userId: userId,
            userToken: userToken,
          }, () => {
            self.setCookie();
          });
        } else {
          self.setState({
            isLoggedIn: false,
            userName: '',
            userId: '',
            userToken: '',
          }, () => {
            self.resetCookie();
          });
        }
      }
    });
  }

  logOut() {
    this.state.auth2.signOut().then(() => {
      this.setState({
        isLoggedIn: false,
        userName: '',
        userId: '',
        userToken: '',
      }, () => {
        this.resetCookie();
        this.initGoogleAuth();
      });
    });
  }

  setCookie() {
    let exp = new Date();
    exp.setTime(exp.getTime()+(12*60*60*1000));
    exp = exp.toGMTString();
    document.cookie = `userId=${this.state.userId};expires=${exp};path=/`;
    document.cookie = `userToken=${this.state.userToken};expires=${exp};path=/`;
    document.cookie = `userName=${this.state.userName};expires=${exp};path=/`;
  }

  resetCookie() {
    document.cookie = `userId=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    document.cookie = `userToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    document.cookie = `userName=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  }

  getCookie(cname) {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
  }


  componentDidMount() {
    window.addEventListener('google-auth-lib-loaded', this.initGoogleAuth);
  }

  clickHandler(searchValue) {
    this.setState({
      searchValue,
    });
    const q = encodeURIComponent(searchValue);
    browserHistory.push(`/search?q=${q}`);
  }

  render() {
    return (
      <div>
        <Navbar
          getAppState={this.getAppState}
          isLoggedIn={this.state.isLoggedIn}
          logOut={this.logOut}
          updateSearch={searchValue => this.clickHandler(searchValue)}
        />
        {React.cloneElement(this.props.children, {
          getAppState: this.getAppState,
          isLoggedIn: this.state.isLoggedIn,
          getVideoProgress: this.getVideoProgress,
        })}
        <Footer />
      </div>
    );
  }
}

export default App;
