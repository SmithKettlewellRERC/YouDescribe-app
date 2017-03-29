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
      <div id="user-menu">
        <div className="arrow-up"></div>
        <div className="w3-card-4">
          <div className="user-menu-header"><h4>{this.props.getAppState().userName}</h4></div>
          <div className="my-described-videos-button">
          <Link to={myVideosUrl} title="View my described videos">My videos</Link>
          </div>
          <hr />
          <div className="sign-out-button">
            <Button title="Sign out" color="w3-indigo" text="Sign out" onClick={this.props.signOut} />
          </div>
        </div>
      </div>
    );
  }
}

export default UserMenu;
