import React from 'react';

import Button from '../button/Button.jsx';

const onButtonPress = () => {
  alert('Button has been pressed!');
};

const Notes = () => (
  <div id="editor" className="w3-card-2">
    <div className="w3-card-4">
      <div className="w3-row">
        <div className="w3-col l3 m3 s3">
          <div id="video-time" className="w3-center">00:00:00:00</div>
        </div>
        <div className="w3-col l9 m9 s9">
          <div id="timeline">TIMELINE</div>
        </div>
      </div>
      <div id="video-audio-track-row" className="w3-row w3-display-container">
        <div className="w3-col l3 m3 s3">
          <div id="video-audio-track" className="w3-center">Video audio track</div>
        </div>
        <div className="w3-col l9 m9 s9">
          <div id="video-audio-sinewave">VIDEO AUDIO TRACK SINEWAVE</div>
        </div>
      </div>
    </div>
    <div id="tracks">
      <div id="track" className="w3-row w3-display-container">
        <div className="w3-col l3 m3 s3">
          <div id="track-info">
            <div className="w3-left">
              <img alt="Extended" src="/assets/img/extended.gif" width="10px" className="w3-display-left" />
            </div>
            <div className="w3-left">
              <input type="text" placeholder="Enter Description" />
            </div>
            <div id="track-action" className="w3-right">
              <i className="fa fa-step-forward" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div className="w3-col l9 m9 s9">
          <div id="track-sinewave">SINEWAVE</div>
        </div>
      </div>
      <div id="track" className="w3-row w3-display-container">
        <div className="w3-col l3 m3 s3">
          <div id="track-info">
            <div className="w3-left">
              <img alt="Extended" src="/assets/img/inline.gif" width="10px" className="w3-display-left" />
            </div>
            <div className="w3-left">
              <input type="text" placeholder="Enter Description" />
            </div>
            <div id="track-action" className="w3-right">
              <i className="fa fa-circle" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div className="w3-col l9 m9 s9">
          <div id="track-sinewave">SINEWAVE</div>
        </div>
      </div>
      <div id="add-track-row" className="w3-row w3-display-container">
        <div className="w3-col l3 m3 s3">
          <div className="w3-padding-right w3-left">
            <Button title="Add inline" color="w3-purple" />
          </div>
          <div className="w3-left">
            <Button title="Add extended" color="w3-yellow" />
          </div>
        </div>
        <div className="w3-col l9 m9 s9">
          <div id="add-track-space"></div>
        </div>
      </div>
    </div>
    <div className="w3-right-align w3-border-top w3-border-black w3-padding">
      <Button title="Publish" color="w3-indigo" />
    </div>
  </div>
);

export default Notes;
