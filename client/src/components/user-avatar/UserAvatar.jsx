import React from 'react';
import Button from '../button/Button.jsx';
import UserMenu from '../user-menu/UserMenu.jsx';

const UserAvatar = (props) => {
  return (
    <div id="user-avatar">
      <button onClick={props.userMenuToggle}>
        <img
          aria-label={`Logged in as ${props.getAppState().userName}`}
          alt={`Logged in as ${props.getAppState().userName}`}
          title={`Logged in as ${props.getAppState().userName}`}
          src={props.getAppState().userPicture} height="33px"
        />
      </button>
      <UserMenu getAppState={props.getAppState} signOut={props.signOut} userMenuToggle={props.userMenuToggle} />
    </div>
  );
};

export default UserAvatar;
