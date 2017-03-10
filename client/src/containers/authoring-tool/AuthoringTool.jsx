import React from 'react';

import VideoPlayer from '../../components/video-player/VideoPlayer.jsx';
import Notes from '../../components/notes/Notes.jsx';
import Editor from '../../components/editor/Editor.jsx';

const AuthoringTool = (props) => {
  console.log('authtool', props.actionClick);
  return (
    <div id="authoring-tool">
      <div className="w3-row-padding">
        <div className="w3-col l8 w3-margin-top">
          <div id="notes" className="w3-card-2 w3-black">
            <VideoPlayer id={props.params.videoId} />
          </div>
        </div>
        <div className="w3-col l4 w3-margin-top">
          <Notes />
        </div>
      </div>
      <div className="w3-row-padding w3-margin-top">
        <div className="w3-col w3-margin-bottom">
          <Editor {...props} />
        </div>
      </div>
    </div>
  );
};

export default AuthoringTool;
