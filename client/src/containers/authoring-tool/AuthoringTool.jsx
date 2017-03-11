import React, { Component } from 'react';
import VideoPlayer from '../../components/video-player/VideoPlayer.jsx';
import Notes from '../../components/notes/Notes.jsx';
import Editor from '../../components/editor/Editor.jsx';
import Track from '../../components/track/Track.jsx';

const conf = require('../../shared/config')();

class AuthoringTool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      youTubeVideoDuration: -1,
      playheadPosition: 0,
    };

    this.publishVideo = this.publishVideo.bind(this);
    this.addAudioClipTrack = this.addAudioClipTrack.bind(this);
    this.recordAudioClip = this.recordAudioClip.bind(this);
    // this.callbackFileSaved = this.callbackFileSaved.bind(this);
  }

  componentDidMount() {
    // const timeInt = setInterval(() => {
    //   if (this.state.playheadPosition === this.state.youTubeVideoDuration) clearInterval(timeInt);
    //   this.setState({ playheadPosition: this.state.playheadPosition + 1 });
    // }, 100);
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

    const url = `${conf.youTubeApiUrl}/videos?id=${this.props.getState().authoringToolActiveVideoId}&part=contentDetails&key=${conf.youTubeApiKey}`;
    fetch(url)
    .then(response => response.json())
    .then((data) => {
      function convertISO8601ToSeconds(input) {
        const reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        let totalseconds;

        if (reptms.test(input)) {
          const matches = reptms.exec(input);
          if (matches[1]) hours = Number(matches[1]);
          if (matches[2]) minutes = Number(matches[2]);
          if (matches[3]) seconds = Number(matches[3]);
          totalseconds = (hours * 3600) + (minutes * 60) + seconds;
        }

        return (totalseconds);
      }

      function convertSecondsToEditorFormat(timeInSeconds) {
        let hours = Math.floor(timeInSeconds / 3600);
        let minutes = Math.floor(timeInSeconds / 60);
        let seconds = Math.floor(timeInSeconds);
        let milliseconds = Math.floor((timeInSeconds - Math.floor(timeInSeconds)) * 100);

        if (hours >= 24) hours = Math.floor(hours % 24);
        if (hours < 10) hours = String(0) + hours;
        if (minutes >= 60) minutes = Math.floor(minutes % 60);
        if (minutes < 10) minutes = String(0) + minutes;
        if (seconds >= 60) seconds = Math.floor(seconds % 60);
        if (seconds < 10) seconds = String(0) + seconds;
        if (milliseconds < 10) milliseconds = String(0) + milliseconds;

        return `${hours}:${minutes}:${seconds}:${milliseconds}`;
      }

      this.setState({
        youTubeVideoDuration: convertSecondsToEditorFormat(
          convertISO8601ToSeconds(data.items[0].contentDetails.duration),
        ),
      });
    });
  }

  addAudioClipTrack(playBackType) {
    const tracks = this.props.getState().authoringTooltracksComponents.slice();
    const newTrackId = tracks.length + 1;
    tracks.push(<Track
      key={newTrackId}
      playBackType={playBackType}
      id={newTrackId}
      recordAudioClip={this.recordAudioClip}
    />);
    this.props.updateState({
      authoringTooltracksComponents: tracks,
      authoringTooltrackComponentsCount: newTrackId,
    });
  }

  recordAudioClip(e, playBackType) {
    // const tracks = this.props.getState.authoringTooltracksComponents.slice();
    // if (e.target.className === 'fa fa-circle') {
    //   console.log('Start recording');
    //   startRecording();
    //   e.target.className = 'fa fa-stop';
    // } else if (e.target.className === 'fa fa-stop') {
    //   console.log('Stop recording');
    //   // Is going to stop the recording and save the file.
    //   this.setState({
    //     authoringToolCurrentPlayBackType: playBackType,
    //   });
    //   stopRecordingAndSave(this.callbackFileSaved);
    //   e.target.className = 'fa fa-step-forward';
    // } else {
    //   console.log('Just play');
    // }
  }

  callbackFileSaved(blob) {
    console.log('The blob is in memory');
    const formData = new FormData();
    formData.append('label', 'The title from debug');
    formData.append('playbackType', this.props.getState().authoringToolCurrentPlayBackType);
    formData.append('startTime', '100.087');
    formData.append('endTime', '134.098');
    formData.append('duration', '10.000');
    formData.append('wavfile', blob);
    fetch('http://localhost:8080/v1/audioclips/qwe', {
      method: 'POST',
      body: formData,
    })
    .then((response) => {
      console.log('RESPONSE', response);
    })
    .catch((errPostingFile) => {
      console.log(errPostingFile);
    });
  }

  publishVideo() {
    alert('published');
  }

  render() {
    return (
      <main id="authoring-tool">
        <div className="w3-row">
          <div
            id="video-section"
            className="w3-left w3-card-2 w3-margin-top w3-hide-small w3-hide-medium"
          >
            <VideoPlayer
              videoId={this.props.getState().authoringToolActiveVideoId}
              getVideoProgress={this.props.getVideoProgress}
            />
          </div>
          <div
            id="notes-section"
            className="w3-left w3-card-2 w3-margin-top w3-hide-small w3-hide-medium"
          >
            <Notes />
          </div>
        </div>
        <div className="w3-row w3-margin-top w3-hide-small w3-hide-medium">
          <div className="w3-col w3-margin-bottom">
            <Editor
              getState={this.props.getState}
              publishVideo={this.publishVideo}
              addAudioClipTrack={this.addAudioClipTrack}
              recordAudioClip={this.recordAudioClip}
              {...this.state}
            />
          </div>
        </div>
      </main>
    );
  }
}

export default AuthoringTool;
