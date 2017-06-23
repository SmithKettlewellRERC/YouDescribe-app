import React from 'react';

const NudgeLeft = props => (
  <span id="nudge-left">
    <i
      className="fa fa-arrow-left"
      aria-hidden="true"
      onClick={(evt) => { props.nudgeTrackLeft(evt, props.id, props.data); }}
    />
  </span>
);

export default NudgeLeft;
