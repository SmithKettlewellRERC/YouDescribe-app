import React, { Component } from 'react';
import { ourFetch, getLang } from '../../shared/helperFunctions';

const conf = require('../../shared/config')();

class LanguageSelector extends Component {
  constructor(props) {
    super(props);
    this.languages = [];
    this.handleChange = this.handleChange.bind(this);    
  }

  handleChange(e) {
    this.props.updateState({ audioDescriptionSelectedLanguage: e.target.value });
  }

  getLanguagesList() {
    const self = this;
    const url = `${conf.apiUrl}/languages`;
    ourFetch(url)
    .then(response => {
      if (response.result) {
        this.languages = response.result;
      } else {
        console.log('Problems to retrieve languages');
      }
    })
    .catch(err => {
      console.log('err', err);
    });
  }

  getOptions() {
    const options = [];
    this.languages.forEach((item, idx) => {
      options.push(<option key={idx} value={item.code}>{item.name}</option>);
    });
    return options;
  }

  componentDidMount() {
    this.getLanguagesList();
  }

  render() {
    const selectedLanguage = this.props.getATState().audioDescriptionSelectedLanguage || getLang();
    return (
      <div id="language-selector">
        <div className="w3-card-4">{this.props.translate('Audio description language')}</div>
        <div id="language-select-wrapper">
          <select onChange={this.handleChange} value={selectedLanguage}>
            {this.getOptions()}
          </select>
        </div>
      </div>
    );
  }
}

export default LanguageSelector;
