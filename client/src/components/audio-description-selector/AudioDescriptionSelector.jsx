import React, { Component } from 'react';
import { browserHistory } from 'react-router';

class AudioDescriptionSelector extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const selectedAudioDescriptionId = e.target.value;
    if (selectedAudioDescriptionId === 'add') {
      if (this.props.getAppState().isSignedIn) {
        // alert('We are upgrading our systems! This feature is currently unavailable')
        browserHistory.push('/authoring-tool/' + this.props.videoId);
      } else {
        alert(this.props.translate('You must sign in to perform this action'));
      }
    } else {
      this.props.changeAudioDescription(selectedAudioDescriptionId);
    }
  }

  render() {
    const options = [];
    options.push(<option key={-1} value="">None</option>);
    const ads = this.props.audioDescriptionsIdsUsers;
    Object.keys(ads).forEach((ad, idx) => {
      if (ads[ad]) {
        options.push(<option key={idx+1} value={ad}>{ads[ad].name}</option>);
      }
    });
    let selectedAudioDescriptionId = '';
    if (this.props.selectedAudioDescriptionId !== null) {
      selectedAudioDescriptionId = this.props.selectedAudioDescriptionId;
    }
    return (
      <div id="audio-description-selector">
        <select
          aria-label="describer selector"
          onChange={this.handleChange}
          value={selectedAudioDescriptionId}
          accessKey="d"
        >
          {options}
        </select>
      </div>
    );
  };
}

export default AudioDescriptionSelector;
