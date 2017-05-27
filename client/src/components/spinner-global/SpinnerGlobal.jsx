import React, { Component } from 'react';

class SpinnerGlobal extends Component {
  constructor(props) {
    super(props);
  }

  on() {
    const spinner = document.getElementById('spinner-global');
    spinner.style.display = 'block';
  }

  off() {
    const spinner = document.getElementById('spinner-global');
    spinner.style.display = 'none';
  }

  render() {
    return (
      <div id="spinner-global">
        <img
          src="/assets/img/spinner-global.gif"
          alt="Loading"
        />
        <span>Loading...</span>
      </div>
    );
  }
}

export default SpinnerGlobal;
