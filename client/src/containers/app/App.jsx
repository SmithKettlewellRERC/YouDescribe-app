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

  componentDidMount() {
    gapi.load('auth2', function() {
      gapi.auth2.init();
    });
  }

  getState() {
    return this.state;
  }

  render() {
    return (
      <div>
        <Navbar />
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
