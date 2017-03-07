import React from 'react';

import VideoPlayer from '../../components/video-player/VideoPlayer.jsx';
import Notes from '../../components/notes/Notes.jsx';

const AuthoringTool = () => (
  <div id="authoring-tool">
    <div className="w3-row-padding">
      <div className="w3-col l9 w3-margin-top">
        <VideoPlayer />
      </div>
      <div className="w3-col l3 w3-margin-top">
        <Notes />
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
