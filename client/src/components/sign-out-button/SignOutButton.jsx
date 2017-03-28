import React, { Component } from 'react';
import Button from '../button/Button.jsx';

class SignOutButton extends Component {
  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
  }

  signOut() {
    this.props.signOut();
  }

  render() {
            console.log(this.props.getAppState().userPicture)
    return (
      <div>
        <img src={this.props.getAppState().userPicture} />
        <span style={{ float: 'right', position: 'relative', top: '6px', paddingLeft: '4px' }}>{this.props.getAppState().userName}</span>
        <span style={{ float: 'right' }}>
          <Button
            id="btn-sign-out"
            title="Sign out"
            color="w3-indigo"
            text="Sign out"
            onClick={this.signOut}
          />
        </span>
      </div>
    );
  }
}

export default SignOutButton;
