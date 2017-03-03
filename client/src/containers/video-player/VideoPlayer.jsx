import React from 'react';
import { Link } from 'react-router';
import path from 'path';

const VideoPlayer = () => (
  <div id="video-player">
    <h1>VIDEO PLAYER</h1>
    <iframe width="560px" height="315px" src="https://www.youtube.com/embed/O7j4_aP8dWA" frameborder="0px" allowfullscreen></iframe>
  </div>
);

export default VideoPlayer;
