import React from 'react';

const Playhead = (props) => {
  return (
    <div id="playhead" style={{ left: (756 * props.currentVideoProgress / props.videoDurationInSeconds) + 'px' }}>
      <div id="playhead-head"></div>
      <div id="playhead-tail" style={{ height: props.playheadTailHeight + 'px' }}></div>
    </div>
  );
};

export default Playhead;
