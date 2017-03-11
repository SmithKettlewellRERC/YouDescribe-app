import React from 'react';

import Button from '../button/Button.jsx';
import ActionIcon from '../action-icon/ActionIcon.jsx';
import Track from '../track/Track.jsx';

const Editor = (props) => {
  const timeInSeconds = props.getState().editorTimerValue;

  function convertSecondsToEditorFormat(timeInSeconds) {
    let hours = ~~(timeInSeconds / 3600);
    let minutes = ~~(timeInSeconds / 60);
    let seconds = ~~timeInSeconds;
    let milliseconds = ~~((timeInSeconds - ~~timeInSeconds) * 100);

    if (hours >= 24) hours = ~~(hours % 24);
    if (hours < 10) hours = '0' + hours;
    if (minutes >= 60) minutes = ~~(minutes % 60);
    if (minutes < 10) minutes = '0' + minutes;
    if (seconds >= 60) seconds = ~~(seconds % 60);
    if (seconds < 10) seconds = '0' + seconds;
    if (milliseconds < 10) milliseconds = '0' + milliseconds;

    return `${hours}:${minutes}:${seconds}:${milliseconds}`;
  }

  const convertedTime = convertSecondsToEditorFormat(timeInSeconds);

  return (
    <div id="editor" className="w3-card-2">
      <div className="w3-card-4">
        <div id="video-time" className="w3-row">
          <div className="w3-col l3 m3 s3">
            <div id="timer" className="w3-center">{convertedTime}</div>
          </div>
          <div className="w3-col l9 m9 s9">
            <div id="timeline">
              <div>
                <span className="w3-left">00:00:00:00</span>
                <span className="w3-right">{props.youTubeVideoDuration}</span>
              </div>
              <hr />
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
        {props.getState().authoringTooltracksComponents}
        <div id="add-track-row" className="w3-row w3-display-container">
          <div className="w3-col l3 m3 s3">
            <div className="cont">
              <div className="w3-padding-right w3-left">
                <Button title="Add inline" color="w3-yellow" onClick={() => props.addAudioClipTrack('inline')} />
              </div>
              <div className="w3-left">
                <Button title="Add extended" color="w3-purple" onClick={() => props.addAudioClipTrack('extended')}  />
              </div>
            </div>
          </div>
          <div className="w3-col l9 m9 s9">
            <div id="add-track-space" />
          </div>
        </div>

      </div>

      <div className="w3-right-align w3-border-top w3-border-black w3-padding">
        <Button title="Publish" color="w3-indigo" onClick={props.publishVideo} />
      </div>
    </div>
  );
};

export default Editor;
