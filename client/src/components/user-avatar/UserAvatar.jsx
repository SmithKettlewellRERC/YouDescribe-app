import React, { Component } from 'react';
import Button from '../button/Button.jsx';
import UserMenu from '../user-menu/UserMenu.jsx';

class UserAvatar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // document.getElementById('user-avatar').onKeypress = () => this.props.userMenuToggle();
    return (
      <div id="user-avatar">
        <button onKeyPress={this.props.userMenuToggle}>
          <img alt="User avatar - you are current logged in" src={this.props.getAppState().userPicture} height="33px" onClick={this.props.userMenuToggle} />
        </button>
        <UserMenu getAppState={this.props.getAppState} signOut={this.props.signOut} userMenuToggle={this.props.userMenuToggle} />
      </div>
    );
  }
}

export default UserAvatar;
