import React, { Component } from 'react';
import Button from '../button/Button.jsx';
import UserMenu from '../user-menu/UserMenu.jsx';

class SignOutButton extends Component {
  constructor(props) {
    super(props);
    // this.signOut = this.signOut.bind(this);
  }

  // signOut() {
  //   this.props.signOut();
  // }


  render() {
    return (
      <div id="sign-out-button">
        <Button
          id="btn-sign-out"
          title="Sign out"
          color="w3-indigo"
          text="Sign out"
          onClick={this.props.signOut}
        />
      </div>
    );
  }
}

export default SignOutButton;
