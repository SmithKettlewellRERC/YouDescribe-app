import React, { Component } from 'react';

class AudioDescriptionSelector extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const selectedAudioDescriptionId = e.target.value;
    this.props.updateState({
      selectedAudioDescriptionId: selectedAudioDescriptionId,
    }, () => {
      this.props.setAudioDescriptionActive();
    });
  }
  
  render() {
    const options = [];
    const ads = this.props.audioDescriptionsIdsUsers;
    Object.keys(ads).forEach((ad) => {
      options.push(<option value={ad}>{ads[ad].name}</option>);
    });
    let selectedAudioDescriptionId = '';
    if (this.props.selectedAudioDescriptionId !== null) {
      selectedAudioDescriptionId = this.props.selectedAudioDescriptionId;
    }
    return (
      <div>
        <select id="audioDescriptionSelector" onChange={this.handleChange} value={selectedAudioDescriptionId}>
          {options}
        </select>
        <span>{this.props.currentVideoDescriber}</span>
      </div>
    );
  };
}

export default AudioDescriptionSelector;
