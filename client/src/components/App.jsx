import React, { Component } from 'react';
import Navbar from './Navbar.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.updateState = this.updateState.bind(this);
    this.getState = this.getState.bind(this);
  }

  getState() {
    return this.state;
  }

  updateState(stateObj) {
    this.setState(stateObj);
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  render() {
    return (
      <div>
        <Navbar />
        {React.cloneElement(this.props.children, {
          updateState: this.updateState,
          getState: this.getState,
        })}
      </div>
    );
  }
}

export default App;
