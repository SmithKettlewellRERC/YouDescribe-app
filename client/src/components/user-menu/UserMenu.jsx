import React from 'react';
// import SignOutButton from '../sign-out-button/SignOutButton.jsx';
import Button from '../button/Button.jsx';
import UserAvatar from '../user-avatar/UserAvatar.jsx';

const UserMenu = (props) => {
  console.log(props.getAppState().userName);
  return (
    <div id="user-menu">
      <div className="arrow-up"></div>
      <div className="w3-card-4">
        <div className="user-menu-header"><h4>{props.getAppState().userName}</h4></div>
        <div className="my-described-videos-button">
          <Button title="View my described videos" color="w3-light-grey" text="My described videos" onClick={props.viewDescribedVideos} />
        </div>
        <hr />
        <div className="sign-out-button">
          <Button title="Sign out" color="w3-indigo" text="Sign out" onClick={props.signOut} />
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
