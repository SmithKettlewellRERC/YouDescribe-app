import React from 'react';

import VideoPlayer from '../../components/video-player/VideoPlayer.jsx';

const AuthoringTool = () => (
  <div id="authoring-tool">
    <div className="w3-row-padding">
      <div className="w3-col l9 w3-margin-top">
        <div id="video" className="w3-card-2">
          <VideoPlayer />
        </div>
      </div>
      <div className="w3-col l3 w3-margin-top">
        <div id="notes" className="w3-card-2">
          NOTES
        </div>
      </div>
    </div>
    <div className="w3-row-padding w3-margin-top">
      <div className="w3-col w3-margin-bottom">
        <div id="editor" className="w3-card-2">
          EDITOR
        </div>
      </div>
    </div>
  </div>
);

export default AuthoringTool;
