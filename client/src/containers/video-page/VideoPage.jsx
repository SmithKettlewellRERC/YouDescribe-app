import React from 'react';

import VideoPlayer from '../../components/video-player/VideoPlayer.jsx';

// <iframe width="560px" height="315px" src="https://www.youtube.com/embed/O7j4_aP8dWA?modestbranding=1&autohide=1&showinfo=0" frameBorder="0px" />
const VideoPage = () => (
  <div id="video-player">
    <center>
      <h1>VIDEO PLAYER</h1>
      <VideoPlayer />
    </center>
  </div>
);

export default VideoPage;
