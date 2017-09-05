import React, { Component } from 'react';
import { ourFetch } from '../../shared/helperFunctions';

const conf = require('../../shared/config')();

class IdiomSelector extends Component {
  constructor(props) {
    super(props);
    this.idioms = [];
  }

  getIdiomsList() {
    const self = this;
    const url = `${conf.apiUrl}/idioms`;
    console.log(url);
    ourFetch(url)
    .then(response => {
      if (response.result) {
        this.idioms = response.result;
        self.idiomsSelectMount();
      } else {
        console.log('Problems to retrieve idioms');
      }
    })
    .catch(err => {
      console.log('err', err);
    });
  }

  idiomsSelectMount() {
    let html = '<select name="">';
    this.idioms.forEach(item => {
      let select = '';
      if (item.code === window.locale) {
        select = 'selected';
      }
      html += '<option value="' + item.code + '" ' + select + '>' + item.name + '</option>';
    });
    html += '</select>';
    const element = document.getElementById('idiom-select-wrapper');
    element.innerHTML = html;
    console.log(html);
  }

  componentDidMount() {
    this.getIdiomsList();
  }

  render() {
    return (
      <div id="idiom-selector">
        <div className="w3-card-4">{this.props.translate('Audio description idiom')}</div>
        <div id="idiom-select-wrapper" />
      </div>
    );
  }
}

export default IdiomSelector;
