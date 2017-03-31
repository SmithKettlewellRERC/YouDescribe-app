import React from 'react';

const ActionIcon = (props) => {
  // console.log('ACTION ICON', props.actionIconClass);
  return (
    <div id="action-icon">
      <i className={`fa ${props.actionIconClass}`} id={props.id} aria-hidden="true" onClick={(evt) => { props.recordAudioClip(evt, props.id); }}></i>
    </div>
  )
};

export default ActionIcon;
