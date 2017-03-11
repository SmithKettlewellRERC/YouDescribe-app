import React, { Component } from 'react';
import VideoPlayer from '../../components/video-player/VideoPlayer.jsx';
import Notes from '../../components/notes/Notes.jsx';
import Editor from '../../components/editor/Editor.jsx';

const conf = require('../../shared/config')();

class AuthoringTool extends Component {
  constructor(props) {
    super(props);
    this.state = {
      youTubeVideoDuration: 0,
    };
  }

  componentDidMount() {
    function mouseWheelHandler(e) {
      // const e0 = e.originalEvent;
      // const delta = e0.wheelDelta || -e0.detail;
      const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }

    document.getElementById('notes-textarea').addEventListener('mousewheel', mouseWheelHandler);
    document.getElementById('tracks').addEventListener('mousewheel', mouseWheelHandler);

    initAudioRecorder();

    const url = `${conf.youTubeApiUrl}/videos?id=${this.props.params.videoId}&part=contentDetails&key=${conf.youTubeApiKey}`;
    fetch(url)
    .then(response => response.json())
    .then((data) => {
      function convertISO8601ToSeconds(input) {
        const reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
        let hours = 0, minutes = 0, seconds = 0, totalseconds;

        if (reptms.test(input)) {
            const matches = reptms.exec(input);
            if (matches[1]) hours = Number(matches[1]);
            if (matches[2]) minutes = Number(matches[2]);
            if (matches[3]) seconds = Number(matches[3]);
            totalseconds = hours * 3600  + minutes * 60 + seconds;
        }

        return (totalseconds);
      }

      function convertSecondsToEditorFormat(timeInSeconds) {
        let hours = ~~(timeInSeconds / 3600);
        let minutes = ~~(timeInSeconds / 60);
        let seconds = ~~timeInSeconds;
        let milliseconds = ~~((timeInSeconds - ~~timeInSeconds) * 100);

        if (hours >= 24) hours = ~~(hours % 24);
        if (hours < 10) hours = '0' + hours;
        if (minutes >= 60) minutes = ~~(minutes % 60);
        if (minutes < 10) minutes = '0' + minutes;
        if (seconds >= 60) seconds = ~~(seconds % 60);
        if (seconds < 10) seconds = '0' + seconds;
        if (milliseconds < 10) milliseconds = '0' + milliseconds;

        return `${hours}:${minutes}:${seconds}:${milliseconds}`;
      }

      this.setState({
        youTubeVideoDuration: convertSecondsToEditorFormat(convertISO8601ToSeconds(data.items[0].contentDetails.duration)),
      });
    });
  }

  render() {
    return (
      <main id="authoring-tool">
        <div className="w3-row">
          <div id="video-section" className="w3-left w3-card-2 w3-margin-top w3-hide-small w3-hide-medium">
            <VideoPlayer videoId={this.props.params.videoId} getVideoProgress={this.props.getVideoProgress} />
          </div>
          <div id="notes-section" className="w3-left w3-card-2 w3-margin-top w3-hide-small w3-hide-medium">
            <Notes />
          </div>
        </div>
        <div className="w3-row w3-margin-top w3-hide-small w3-hide-medium">
          <div className="w3-col w3-margin-bottom">
            <Editor {...this.props} youTubeVideoDuration={this.state.youTubeVideoDuration} />
          </div>
        </div>
      </main>
    );
  }
}

export default AuthoringTool;
