import React from 'react';

import Button from '../button/Button.jsx';
import ActionIcon from '../action-icon/ActionIcon.jsx';
import Track from '../../components/track/Track.jsx';
import AlertBox from '../../components/alert-box/AlertBox.jsx';

import {
  convertSecondsToEditorFormat,
} from '../../shared/helperFunctions';
import Playhead from '../playhead/Playhead.jsx';

const Editor = (props) => {
  const audioDescriptionId = props.getATState().audioDescriptionId;
  const audioDescriptionStatus = props.getATState().audioDescriptionStatus;
  let publishButton = null;
  let saveButton = null;
  if (audioDescriptionStatus === 'draft') {
    publishButton = <Button
      title="Publish the video along with all audio description tracks"
      text="Publish"
      color="w3-indigo"
      onClick={props.publishAudioDescription}
    />
  }
  if (audioDescriptionStatus === 'published') {
    publishButton = <Button
      title="Unpublish this audio description for the current video"
      text="Unpublish"
      color="w3-indigo"
      onClick={props.unpublishAudioDescription}
    />
  }
  // Just show save button after the audio description has at least one audio clip.
  if (audioDescriptionId) {
    saveButton = <Button
      title="Save notes and labels anytime"
      text="Save"
      color="w3-indigo"
      onClick={props.saveLabelsAndNotes}
    />
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
                videoDurationInSeconds={props.videoDurationInSeconds}
                currentVideoProgress={props.currentVideoProgress}
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
              <div className="w3-left" style={{ paddingRight: '14px' }}>
                <Button title="Add an inline audio description track which plays concurrently with the video's audio" text="Add inline" color="w3-yellow" onClick={() => props.addAudioClipTrack('inline')} />
              </div>
              <div className="w3-left">
                <Button title="Add an extended audio description track which pauses the video as it plays and then resumes the video when it finishes" text="Add extended" color="w3-purple" onClick={() => props.addAudioClipTrack('extended')}  />
              </div>
            </div>
            <AlertBox
              id="unused-track"
              backgroundColor="w3-red"
              content={<div><i className="fa fa-exclamation-triangle" aria-hidden="true"></i><h5>UNUSED TRACK AVAILABLE</h5><h6>Please use the unused track before adding a new one</h6></div>}
              title="Unused track available. Please use the unused track before adding a new one."
              text="Dismiss"
              buttonColor="w3-white"
              alertBoxClose={props.alertBoxClose}
            />
            <AlertBox
              id="recording-in-process"
              backgroundColor="w3-red"
              content={<div><i className="fa fa-exclamation-triangle" aria-hidden="true"></i><h5>RECORDING IN PROCESS</h5><h6>Please finish your current recording before adding a new track</h6></div>}
              title="Recording in process. Please finish your current recording before adding a new track."
              text="Dismiss"
              buttonColor="w3-white"
              alertBoxClose={props.alertBoxClose}
            />
          </div>
          <div className="w3-col l9 m9 s9">
            <div id="add-track-space" />
          </div>
        </div>
      </div>
      <div className="w3-right-align w3-border-top w3-border-black w3-padding">
        {saveButton}
        {publishButton}
        <AlertBox
          id="publish-button"
          backgroundColor="w3-indigo"
          content={<div><i className="fa fa-thumbs-up" aria-hidden="true"></i><h5>Audio description successfully published</h5></div>}
          title="Successfully published"
          text="Okay"
          buttonColor="w3-white"
          alertBoxClose={props.alertBoxClose}
        />
      </div>
    </div>
  );
};

export default Editor;
