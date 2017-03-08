import React from 'react';

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
          <center>
            <button id="add-track" className="w3-btn w3-indigo">Add track</button>
          </center>
        </div>
        <div className="w3-col l9 m9 s9">
          <div id="add-track-space"></div>
        </div>
      </div>
    </div>

    <div className="w3-right-align w3-border-top w3-border-black">
      <button className="w3-btn w3-indigo w3-margin">Publish</button>
    </div>
  </div>
);

export default Notes;
