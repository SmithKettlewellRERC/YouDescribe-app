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
        browserHistory.push('/authoring-tool/' + this.props.videoId);
      } else {
        alert('You have to be legged in in order to up vote');
      }
    } else {
      this.props.updateState({
        selectedAudioDescriptionId: selectedAudioDescriptionId,
      }, () => {
        this.props.setAudioDescriptionActive();
      });
    }
  }

  render() {
    const options = [];
    options.push(<option key={-1} value="">None</option>);
    const ads = this.props.audioDescriptionsIdsUsers;
    Object.keys(ads).forEach((ad, idx) => {
      options.push(<option key={idx+1} value={ad}>{ads[ad].name}</option>);
    });
    options.push(<option key={0} value="add">Add a new audio description</option>);
    let selectedAudioDescriptionId = '';
    if (this.props.selectedAudioDescriptionId !== null) {
      selectedAudioDescriptionId = this.props.selectedAudioDescriptionId;
    }
    return (
      <div id="audio-description-selector">
        <div id="audio-description-selector-header">Describer</div>
        <select onChange={this.handleChange} value={selectedAudioDescriptionId}>
          {options}
        </select>
        <span>{this.props.currentVideoDescriber}</span>
      </div>
    );
  };
}

export default AudioDescriptionSelector;
