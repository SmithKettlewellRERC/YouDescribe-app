import React from 'react';

const NudgeLeft = props => (
  <div id="nudge-left">
    <i
      className="fa fa-caret-left"
      aria-hidden="true"
      onClick={(evt) => { props.nudgeTrackLeft(evt, props.id, props.data); }}
    />
  </div>
);

export default NudgeLeft;
