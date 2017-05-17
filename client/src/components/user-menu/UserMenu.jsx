import React, { Component } from 'react';
import Button from '../button/Button.jsx';
import UserAvatar from '../user-avatar/UserAvatar.jsx';
import { Link } from 'react-router';


class UserMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const myVideosUrl = `/videos/user/${this.props.getAppState().userId}`;
    return (
      <div id="user-menu" tabIndex="-1">
        <div className="arrow-up"></div>
        <div className="w3-card-4">
          <div className="user-menu-header"><span aria-hidden="true">{this.props.getAppState().userName}</span></div>
          <div className="my-described-videos-button">
            <Link to={myVideosUrl} title="View my described videos" onClick={this.props.userMenuToggle}><i className="fa fa-audio-description" aria-hidden="true">&nbsp;</i><span>My descriptions</span></Link>
          </div>
          <hr />
          <div className="sign-out-button">
            <Button color="w3-indigo" text="Sign out" onClick={this.props.signOut} />
          </div>
        </div>
      </div>
    );
  }
}

export default UserMenu;
