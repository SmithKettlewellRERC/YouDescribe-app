import React from 'react';

const ActionIcon = (props) => {
  return (
    <div id="action-icon" className="">
      <i className={`fa ${props.icon}`} icon="blah" id={props.id} aria-hidden="true" onClick={(evt) => { props.recordAudioClip(evt, props.playBackType); }}></i>
    </div>
  )
};

export default ActionIcon;
