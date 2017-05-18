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
          <p>Welcome to the Public Beta of the new YouDescribe!</p>

          <p>We have just launched the updated version of YouDescribe which we will be improving and refining over the coming weeks and months.</p>

          <p>This support page will soon include links to description tutorials, lists of frequently asked questions, support forums for describers and viewers, and articles about how to use YouDescribe to get the most out of your audio description, whether it is for education, employment, or just good old fashioned entertainment.</p>

          <p>If you’d like to get in touch with the developers of YouDescribe, please send e-mail to info@youdescribe.org</p>

          <p>Please be patient with us as we build out this support section of the web site.</p>
        </main>

      </div>
    );
  }
}

export default Support;
