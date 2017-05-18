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
      isSignedIn: false,
      userId: '',
      userToken: '',
      userName: '',
      userPicture: '',
    };
    this.initGoogleAuth = this.initGoogleAuth.bind(this);
    this.googleSignInSuccess = this.googleSignInSuccess.bind(this);
    this.signOut = this.signOut.bind(this);
    this.getAppState = this.getAppState.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
  }

  getAppState() {
    return this.state;
  }

  componentWillMount() {
    this.setState({ searchValue: this.props.location.query.q });
  }

  // Call back from Google authentication process.
  googleSignInSuccess() {
    const googleUser = this.state.auth2.currentUser.get();
    const googleToken = googleUser.getAuthResponse().id_token;
    ourFetch(`${conf.apiUrl}/auth`, true, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ googleToken }),
    })
    .then((res) => {
      this.setState({
        isSignedIn: true,
        userName: res.result.name,
        userId: res.result._id,
        userToken: res.result.token,
        userPicture: res.result.picture,
      }, () => {
        this.setCookie();
      });
    });
  }

  // Call back from Google authentication process.
  googleSignInFailure() {
    console.log('sign in failure');
  }

  initGoogleAuth() {
    console.log('initGoogleAuth')
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
        self.state.auth2.attachClickHandler('btn-sign-in', {}, self.googleSignInSuccess, self.googleSignInFailure);
        self.refreshUserInfo();
      });
    })
  }

  refreshUserInfo() {
    console.log('refresh user info')
    const self = this;
    this.state.auth2.then(() => {
      console.log('this.state.auth2')
      if (this.state.auth2.isSignedIn.get()) {
        console.log('this.state.auth2.isSignedIn')
        const userId = this.getCookie('userId');
        const userToken = this.getCookie('userToken');
        const userName = this.getCookie('userName');
        const userPicture = this.getCookie('userPicture');
        if (userId && userToken && userName && userPicture) {
          self.setState({
            isSignedIn: true,
            userName: userName,
            userId: userId,
            userToken: userToken,
            userPicture: userPicture,
          }, () => {
            self.setCookie();
          });
        } else {
          self.setState({
            isSignedIn: false,
            userName: '',
            userId: '',
            userToken: '',
            userPicture: '',
          }, () => {
            self.resetCookie();
          });
        }
      } else {
        console.log('not')
      }
    });
  }

  getUserInfo() {
    const userId = this.getCookie('userId');
    const userToken = this.getCookie('userToken');
    const userName = this.getCookie('userName');
    const userPicture = this.getCookie('userPicture');
    if (userId && userToken && userName && userPicture) {
      return {
        userId,
        userName,
        userToken,
        userPicture,
      };
    }
    return null;
  }

  signOut() {
    this.state.auth2.signOut().then(() => {
      this.setState({
        isSignedIn: false,
        userName: '',
        userId: '',
        userToken: '',
      }, () => {
        this.resetCookie();
        this.initGoogleAuth();
        location.href = '/';
      });
    });
  }

  setCookie() {
    // Our cookie must expire before Google Auth Cookie!
    // 50 minutes as Google lasts for 60 mins.
    const now = new Date();
    let time = now.getTime();
    // 50 mins
    // time += 3000 * 1000;
    time += 20 * 1000;
    now.setTime(time);
    const exp = now.toUTCString();
    // document.cookie = `userId=${this.state.userId};expires=${exp};path=/`;
    // document.cookie = `userToken=${this.state.userToken};expires=${exp};path=/`;
    // document.cookie = `userName=${this.state.userName};expires=${exp};path=/`;
    // document.cookie = `userPicture=${this.state.userPicture};expires=${exp};path=/`;
    document.cookie = `userId=${this.state.userId};path=/`;
    document.cookie = `userToken=${this.state.userToken};path=/`;
    document.cookie = `userName=${this.state.userName};path=/`;
    document.cookie = `userPicture=${this.state.userPicture};path=/`;
  }

  resetCookie() {
    document.cookie = `userId=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    document.cookie = `userToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    document.cookie = `userName=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    document.cookie = `userPicture=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
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
          signOut={this.signOut}
          updateSearch={searchValue => this.clickHandler(searchValue)}
        />
        {React.cloneElement(this.props.children, {
          getAppState: this.getAppState,
          getVideoProgress: this.getVideoProgress,
          getUserInfo: this.getUserInfo,
        })}
        <Footer />
      </div>
    );
  }
}

export default App;
