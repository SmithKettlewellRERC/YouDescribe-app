import React, { Component } from 'react';
import ActionIcon from '../action-icon/ActionIcon.jsx';

class Track extends Component {
  constructor(props) {
    super(props);
    this.label = this.props.data.label;
    this.url = this.props.data.url;
    this.labelText = props.data.playback_type === 'inline' ? 'I' : 'E';
    this.styleButton = props.data.playback_type === 'inline' ? 'w3-yellow' : 'w3-purple';
    this.wavesurfer = null;
  }

  componentDidMount() {
    // this.wavesurfer = WaveSurfer.create({
    //   container: `#wave${this.props.id}`,
    //   waveColor: 'white'
    // });
    // this.wavesurfer.load(this.url);
  }

  render() {
    return (
      <div id="track" className="w3-row w3-display-container">
        <div className="w3-col l3 m3 s3">
          <div id="track-info">
            <div className="w3-left">
              <div id="type" className={this.styleButton}>{this.labelText}</div>
            </div>
            <div className="w3-left">
              <input type="text" value={this.label} placeholder={'Enter some label'} onChange={this.props.updateTrackLabel} onKeyPress={(evt) => {
                this.props.setSelectedTrack(evt, this.props.id)
              }} />
            </div>
            <div id="track-action" className="w3-right">
              <ActionIcon {...this.props} />
            </div>
          </div>
        </div>
        <div className="w3-col l9 m9 s9">
          <div id={`wave${this.props.id}`}></div>
        </div>
      </div>
    );
  }
};

export default Track;
