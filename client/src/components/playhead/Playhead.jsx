import React from 'react';

const Playhead = (props) => {
  return (
    <div id="playhead" style={{ left: Math.round(props.playheadPosition) + 'px' }}>
      <div id="playhead-head" className="w3-red"></div>
      <div id="playhead-tail" className="w3-indigo" style={{ height: props.playheadTailHeight + 'px' }}></div>
    </div>
  );
};

export default Playhead;
