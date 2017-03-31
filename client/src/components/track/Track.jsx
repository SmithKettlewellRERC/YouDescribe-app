import React, { Component } from 'react';
import ActionIcon from '../action-icon/ActionIcon.jsx';
import AlertBox from '../alert-box/AlertBox.jsx';
const conf = require('../../shared/config');

class Track extends Component {
  constructor(props) {
    super(props);
    this.label = this.props.data.label;
    this.url = this.props.data.url;
    this.labelText = props.data.playback_type === 'inline' ? 'I' : 'E';
    this.styleButton = props.data.playback_type === 'inline' ? 'w3-yellow' : 'w3-purple';
    this.wavesurfer = null;
  }

  render() {
    let label;
    if (this.props.data._id) {
      if (this.props.data.label === '') {
        label = <input type="text" value="No label for this track" readOnly />;
      } else {
        label = <input type="text" value={this.props.data.label} readOnly />;
      }
    } else {
      label = <input
        type="text"
        placeholder={'Enter some label for this track'}
        onChange={this.props.updateTrackLabel}
        onKeyPress={evt => {
          this.props.setSelectedTrack(evt, this.props.id)
        }}
      />
    }
    return (
      <div id="track" className="w3-row w3-display-container">
        <div className="w3-col l3 m3 s3">
          <div id="track-info">
            <div className="w3-left">
              <div id="type" className={this.styleButton}>{this.labelText}</div>
            </div>
            <div className="w3-left">
              {label}
            </div>
            <div id="track-action" className="w3-right">
              <ActionIcon {...this.props} />
            </div>
          </div>
        </div>
        <div id="sinewave-container" className="w3-col l9 m9 s9">
          <div
            id="sinewave"
            className={this.styleButton}
            style={{
              left: `${755 * (this.props.data.start_time / this.props.getATState().videoDurationInSeconds)}px`,
              width: `${Math.abs((755 * ((this.props.data.end_time - this.props.data.start_time) / this.props.getATState().videoDurationInSeconds)) - 1)}px`,
              height: '27px',
            }}
          >
            <div id={`wave${this.props.id}`} />
          </div>
        </div>
      </div>
    );
  }
}

export default Track;
