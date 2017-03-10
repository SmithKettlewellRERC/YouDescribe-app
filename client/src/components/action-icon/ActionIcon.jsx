import React from 'react';

const ActionIcon = (props) => {
  return (
    <div id="action-icon">
      <i className={`fa ${props.icon}`} icon="blah" id={props.id} aria-hidden="true" onClick={props.actionClick}></i>
    </div>
  )
};

export default ActionIcon;
