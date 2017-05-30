import React, { Component } from 'react';
import ActionIcon from '../action-icon/ActionIcon.jsx';
import DeleteTrack from '../delete-track/DeleteTrack.jsx';
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
        label = <input type="text" data-id={this.props.data._id} onChange={this.props.updateTrackLabel} placeholder="No label for this track" />;
      } else {
        label = <input type="text" data-id={this.props.data._id} onChange={this.props.updateTrackLabel} value={this.props.data.label} />;
      }
    } else {
      label = <input
        type="text"
        data-id=""
        placeholder={'Label for this track'}
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
              <div className="w3-right">
                <DeleteTrack {...this.props} />
              </div>
              <div className="w3-right" style={{ paddingRight: '8px' }}>
                <ActionIcon {...this.props} />
              </div>
            </div>
          </div>
        </div>
        <div id="sinewave-container" className="w3-col l9 m9 s9">
          <div
            id="sinewave"
            className={this.styleButton}
            style={{
              left: `${756 * (this.props.data.start_time / this.props.getATState().videoDurationInSeconds)}px`,
              width: Math.abs(756 * ((this.props.data.end_time - this.props.data.start_time) / this.props.getATState().videoDurationInSeconds)) !== 0 ?
              `${~~(756 * ((this.props.data.end_time - this.props.data.start_time) / this.props.getATState().videoDurationInSeconds))}px` :
              1,
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
