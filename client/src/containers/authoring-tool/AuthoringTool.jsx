import React from 'react';

import VideoPlayer from '../../components/video-player/VideoPlayer.jsx';
import Notes from '../../components/notes/Notes.jsx';
import Editor from '../../components/editor/Editor.jsx';

const AuthoringTool = (props) => {
  return (
    <main id="authoring-tool">
      <div className="w3-row-padding">
        <div className="w3-col l8 m8 w3-margin-top">
          <div id="notes" className="w3-card-2 w3-black w3-hide-small w3-hide-medium">
            <VideoPlayer videoId={props.params.videoId} />
          </div>
        </div>
        <div className="w3-col l4 m4 w3-margin-top w3-hide-small w3-hide-medium">
          <Notes />
        </div>
      </div>
      <div className="w3-row-padding w3-margin-top w3-hide-small w3-hide-medium">
        <div className="w3-col w3-margin-bottom">
          <Editor {...props} />
        </div>
      </div>
      <div id="mobile" className="w3-hide-large">
        <center>Authoring is only available for desktop at this time</center>
      </div>
    </main>
  );
};

export default AuthoringTool;
