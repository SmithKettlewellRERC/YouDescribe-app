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
  }

  componentWillMount() {
    // gapi.load('auth2', function() {
    //   gapi.auth2.init({
    //     client_id: '858526011072-sakg4fjlvdiug24rsim2fm748pi1n4nc.apps.googleusercontent.com'
    //   });
    // });

    const searchValue = this.props.location.query.q;
    this.setState({
      searchValue: searchValue,
    });
  }


  componentDidMount() {
    gapi.load('auth2', function() {
      gapi.auth2.init();
    });
  }

  getState() {
    return this.state;
  }

  // use algorithm to seperate
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
