import React from 'react';

const VideoTimer = (props) => (
  <div id="video-timer">
    {props.currentVideoProgress.slice(0, 8)} / {props.videoDurationToDisplay.slice(0, 8)}
  </div>
);

export default VideoTimer;
