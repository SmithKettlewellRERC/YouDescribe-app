import React, { Component } from 'react';
import Button from '../button/Button.jsx';
import UserMenu from '../user-menu/UserMenu.jsx';

class UserAvatar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="user-avatar">
        <img src={this.props.getAppState().userPicture} height="33px" onClick={this.props.userMenuToggle} />
        <UserMenu getAppState={this.props.getAppState} signOut={this.props.signOut} userMenuToggle={this.props.userMenuToggle} />
      </div>
    );
  }
}

export default UserAvatar;
