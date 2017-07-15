import React from 'react';
import Button from '../button/Button.jsx';
import Playhead from '../playhead/Playhead.jsx';

const Editor = (props) => {
  const audioDescriptionId = props.getATState().audioDescriptionId;
  const audioDescriptionStatus = props.getATState().audioDescriptionStatus;

  let publishButton = null;

  // Publish button should just be showed if we have at least one track.
  if (props.getATState().tracksComponents.length > 0) {
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
  }

  // Just show save button after the audio description has at least one audio clip.
  // let saveButton = null;
  // if (audioDescriptionId) {
  let saveButton = <Button
      title="Save notes and labels anytime"
      text="Save"
      color="w3-indigo"
      onClick={props.saveLabelsAndNotes}
    />
  // }
  return (
    <div id="editor" className="w3-card-2">
      <div className="w3-card-4">
        <div id="video-time" className="w3-row">
          <div className="w3-col l3 m3 s3">
            <div id="timer" className="w3-center">{props.currentVideoProgressToDisplay}</div>
          </div>
          <div className="w3-col l9 m9 s9">
            <div id="timeline">
              <div id="timers">
                <span className="w3-left">{props.currentVideoProgressToDisplay}</span>
                <span className="w3-right">{props.videoDurationToDisplay}</span>
              </div>

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
          </div>
          <div className="w3-col l9 m9 s9">
            <div id="add-track-space" />
          </div>
        </div>
      </div>
      <div className="w3-right-align w3-border-top w3-border-black w3-padding">
        {saveButton}
        {publishButton}
      </div>
    </div>
  );
};

export default Editor;
