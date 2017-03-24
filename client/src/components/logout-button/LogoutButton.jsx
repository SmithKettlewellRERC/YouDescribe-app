import React, { Component } from 'react';

class LogoutButton extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
  }

  logOut() {
    this.props.logOut();
  }

  render() {
    return (
      <div>
        <strong>{this.props.getAppState().name}</strong>
        <button onClick={this.logOut}>LOGOUT</button>
      </div>
    );
  }
}

export default LogoutButton;
