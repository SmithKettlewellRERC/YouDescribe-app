import React from 'react';

const NudgeRight = props => (
  <span id="nudge-left">
    <i
      className="fa fa-arrow-right"
      aria-hidden="true"
      onClick={(evt) => { props.nudgeTrackRight(evt, props.id, props.data); }}
    />
  </span>
);

export default NudgeRight;
