import React from 'react';

const ActionIcon = (props) => {
  return (
    <div id="action-icon">
      <i className={`fa ${props.actionIconClass}`} id={props.id} aria-hidden="true" onClick={(evt) => { props.recordAudioClip(evt, props.id); }}></i>
    </div>
  )
};

export default ActionIcon;
