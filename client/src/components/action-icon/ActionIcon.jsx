import React from 'react';

const ActionIcon = (props) => {
  return (
    <span id="action-icon">
      <i className={`fa ${props.actionIconClass}`} id={props.id} aria-hidden="true" onClick={(evt) => { props.recordAudioClip(evt, props.id); }}></i>
    </span>
  )
};

export default ActionIcon;
