import React from 'react';

import Button from '../button/Button.jsx';
import ActionIcon from '../action-icon/ActionIcon.jsx';
import Track from '../../components/track/Track.jsx';
import {
  convertSecondsToEditorFormat,
} from '../../shared/helperFunctions';
import Playhead from '../playhead/Playhead.jsx';

const Editor = (props) => {
  // Open a dialog box
  function dialogOpen() {
    const dialogBox = document.getElementById('dialog-box');

    if (dialogBox.style.display === 'none') {
      dialogBox.style.display = 'block';
    }
  }

  // Close a dialog box
  function dialogClose() {
    const dialogBox = document.getElementById('dialog-box');

    dialogBox.style.display = 'none';
  }

  return (
    <div id="editor" className="w3-card-2">
      <div className="w3-card-4">
        <div id="video-time" className="w3-row">
          <div className="w3-col l3 m3 s3">
            <div id="timer" className="w3-center">{props.currentVideoProgressToDisplay}</div>
          </div>
          <div className="w3-col l9 m9 s9">
            <div id="timeline">
              <div>
                <span className="w3-left">{props.currentVideoProgressToDisplay}</span>
                <span className="w3-right">{props.videoDurationToDisplay}</span>
              </div>

              {/* This is the line that need to add time mark */}
              <hr />

              {/* This is moving line that show the time */}
              <Playhead
                playheadPosition={props.playheadPosition}
                playheadTailHeight={props.playheadTailHeight}
              />
            </div>
          </div>
        </div>
        {/* <div id="video-audio-track-row" className="w3-row w3-display-container">
          <div className="w3-col l3 m3 s3">
            <div id="video-audio-track" className="w3-center">Video audio track</div>
          </div>
          <div className="w3-col l9 m9 s9">
            <div id="video-audio-sinewave">VIDEO AUDIO TRACK SINEWAVE</div>
          </div>
        </div> */}
      </div>

      <div id="tracks">
        {props.tracksComponents}
        <div id="add-track-row" className="w3-row w3-display-container">
          <div className="w3-col l3 m3 s3">
            <div className="cont">
              <div className="w3-padding-right w3-left">
                <Button title="Add an inline audio description track which plays concurrently with the video's audio" text="Add inline" color="w3-yellow" onClick={() => props.addAudioClipTrack('inline')} />
              </div>
              <div className="w3-left">
                <Button title="Add an extended audio description track which pauses the video as it plays and then resumes the video when it finishes" text="Add extended" color="w3-purple" onClick={() => props.addAudioClipTrack('extended')}  />
              </div>
            </div>
          </div>
          <div className="w3-col l9 m9 s9">
            <div id="add-track-space" />
          </div>
        </div>
      </div>
      <div className="w3-right-align w3-border-top w3-border-black w3-padding">
        <Button
          title="Publish the video along with all audio description tracks"
          text="Publish"
          color="w3-indigo"
          onClick={props.publishVideo}
        />
        <div id="publish-dialog" style={{ display: 'none' }}>
          <div className="w3-card-4 w3-indigo centered w3-padding">
            <h6>Your audio description has been published along with the video</h6>
            <div className="w3-center w3-padding">
              <Button
                title="Okay"
                text="Okay"
                color="w3-white"
                onClick={props.publishVideo}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
