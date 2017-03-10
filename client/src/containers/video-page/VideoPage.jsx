import React from 'react';

import VideoPlayer from '../../components/video-player/VideoPlayer.jsx';

const VideoPage = (props) => {
  return (
    <div id="video-player">
      <div id="video" className="w3-center">
        <VideoPlayer videoId={props.params.videoId} />
      </div>
    </div>);
};

export default VideoPage;
