import React, { Component } from 'react';

class Support extends Component {
  componentDidMount() {
    document.getElementById('support').focus();
  }

  render() {
    return (
      <div id="support" tabIndex="-1">

        <header role="banner" className="w3-container w3-indigo">
          <h2>Support</h2>
        </header>

        <main className="w3-row">
          <p>
            Comming soon.
          </p>
        </main>

      </div>
    );
  }
}

export default Support;
