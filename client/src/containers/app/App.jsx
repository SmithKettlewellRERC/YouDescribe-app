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
    };

    // Global methods.
    this.getState = this.getState.bind(this);
    this.getVideoProgress = this.getVideoProgress.bind(this);
  }

  // letFetch(searchValue) {
  //   console.log('searching for: ',searchValue);
  // }

  componentWillMount() {
    // gapi.load('auth2', function() {
    //   gapi.auth2.init({
    //     client_id: '858526011072-sakg4fjlvdiug24rsim2fm748pi1n4nc.apps.googleusercontent.com'
    //   });
    // });

    const searchValue = this.props.location.query.search_query;
    this.setState({
      searchValue: searchValue,
    });
  }

  onSignIn(googleUser) {

  }

  getState() {
    return this.state;
  }

  getVideoProgress(currentVideoProgress) {
    // if (this.state.editorTimerValue !== currentVideoProgress) {
    //   this.setState({ editorTimerValue: currentVideoProgress });
    // }
  }

  setActiveVideoIdAuthoringTool(videoId) {
    this.setState({ activeVideoIdAuthoringTool: videoId });
  }

  // use algorithm to seperate
  clickHandler(searchValue) {
    console.log('clicked');
    this.setState({
      searchValue: searchValue,
    });
    const q = encodeURIComponent(searchValue);
    // this.context.router.push(`/search?search_query=${q}`);
    // console.log(this.props)
    browserHistory.push(`/search?search_query=${q}`);
  }

  render() {
    return (
      <div>
        <Navbar updateSearch={searchValue => this.clickHandler(searchValue)} />
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
