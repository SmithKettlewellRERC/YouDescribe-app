import React from 'react';

const SwitchTrackType = (props) => {
  return (
    <div className="switchTrackType">
      <i className="fa fa-exchange" aria-hidden="true" title="Switch this track from inline to extended and vice-versa" onClick={(evt) => { props.switchTrackType(evt, props.id, props.data); }}></i>
    </div>
  )
};

export default SwitchTrackType;
