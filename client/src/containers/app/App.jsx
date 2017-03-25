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
      name: '',
      isLoggedIn: false,
      userId: null,
      token: '',
    };
    this.initGoogleAuth = this.initGoogleAuth.bind(this);
    this.loginSuccess = this.loginSuccess.bind(this);
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

  loginSuccess() {
    const googleUser = this.state.auth2.currentUser.get();
    const token = googleUser.getAuthResponse().id_token;
    ourFetch(`${conf.apiUrl}/auth`, true, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
    .then((res) => {
      console.log(res);
      this.setState({
        userId: res.result._id,
        name: res.result.name,
        isLoggedIn: true,
        token,
      });
    });
  }

  loginFailure() {
    console.log('login failure');
  }

  logOut() {
    this.state.auth2.signOut().then(() => {
      this.setState({
        name: '',
        isLoggedIn: false,
        token: '',
      }, () => {
        this.initGoogleAuth();
      });
    });
  }

  checkIfUserIsLoggedIn() {
    this.state.auth2.then(() => {
      if (this.state.auth2.isSignedIn.get()) {
        const googleUser = this.state.auth2.currentUser.get();
        const userProfile = googleUser.getBasicProfile();
        const token = googleUser.getAuthResponse().id_token;
        this.setState({
          isLoggedIn: true,
          name: userProfile.getName(),
          token: token,
        });
        return true;
      } else {
        return false;
      }
    });
  }

  initGoogleAuth() {
    const self = this;
    gapi.load('auth2', function() {
      const auth2 = gapi.auth2.init({
        client_id: conf.googleClientId,
        fetch_basic_profile: true,
        scope: 'email profile openid'
      });
      self.setState({ auth2 }, () => {
        self.state.auth2.attachClickHandler('btn-signin', {}, self.loginSuccess, self.loginFailure);
        self.checkIfUserIsLoggedIn();
      });
    })
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
