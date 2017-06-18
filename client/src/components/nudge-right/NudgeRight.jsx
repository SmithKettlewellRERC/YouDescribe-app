import React from 'react';

const NudgeRight = props => (
  <div id="nudge-left">
    <i
      className="fa fa-caret-right"
      aria-hidden="true"
      onClick={(evt) => { props.nudgeTrackRight(evt, props.id, props.data); }}
    />
  </div>
);

export default NudgeRight;
