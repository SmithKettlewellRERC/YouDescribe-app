import React, { Component } from 'react';
import Navbar from '../../components/navbar/Navbar.jsx';
import NavbarMaterial from '../../components/navbar/Navbar(material).jsx';
import Footer from '../../components/footer/Footer.jsx';
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
      token: '',
    };
    this.getState = this.getState.bind(this);
    this.initGoogleAuth = this.initGoogleAuth.bind(this);
    this.loginSuccess = this.loginSuccess.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentWillMount() {
    const searchValue = this.props.location.query.q;
    this.setState({
      searchValue: searchValue,
    });
  }

  loginSuccess() {
    const googleUser = this.state.auth2.currentUser.get();
    const profile = googleUser.getBasicProfile();
    const token = googleUser.getAuthResponse().id_token;

// var xhr = new XMLHttpRequest();
// xhr.open('POST', 'https://yourbackend.example.com/tokensignin');
// xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
// xhr.onload = function() {
// console.log('Signed in as: ' + xhr.responseText);
// };
// xhr.send('idtoken=' + id_token);

    this.setState({
      name: profile.getName(),
      isLoggedIn: true,
      token,
    });
  }

  loginFailure() {
    console.log('login failure')
  }

  logOut() {
    console.log('LOG OUT CALLED');
    this.state.auth2.signOut().then(() => {
      console.log('User signed out.');
      this.setState({
        name: '',
        isLoggedIn: false,
        token: '',
      }, () => {
        this.initGoogleAuth();
      });
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
      });
    })
  }

  componentDidMount() {
    window.addEventListener('google-auth-lib-loaded', this.initGoogleAuth);
  }

  getState() {
    return this.state;
  }

  clickHandler(searchValue) {
    this.setState({
      searchValue: searchValue,
    });
    const q = encodeURIComponent(searchValue);
    browserHistory.push(`/search?q=${q}`);
  }

  render() {
    return (
      <div>
        <Navbar
          getState={this.getState}
          logOut={this.logOut}
          updateSearch={searchValue => this.clickHandler(searchValue)}
        />
        {React.cloneElement(this.props.children, {
          getState: this.getState,
          getVideoProgress: this.getVideoProgress,
        })}
        <Footer />
      </div>
    );
  }
}

export default App;
