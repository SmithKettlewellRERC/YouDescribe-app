import React from 'react';

const Playhead = (props) => {
  console.log(props.playheadPosition);
  return (
    <div id="playhead" style={{ left: props.playheadPosition + 'px' }}>
      <div id="playhead-head" className="w3-red"></div>
      <div id="playhead-tail" className="w3-indigo"></div>
    </div>
  );
};

export default Playhead;
