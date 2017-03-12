import React, { Component } from 'react';
import VideoPlayer from '../../components/video-player/VideoPlayer.jsx';
import Notes from '../../components/notes/Notes.jsx';
import Editor from '../../components/editor/Editor.jsx';
import Track from '../../components/track/Track.jsx';
import {
  convertISO8601ToSeconds,
  convertSecondsToEditorFormat,
} from '../../shared/helperFunctions';

const conf = require('../../shared/config')();

class AuthoringTool extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVideoId: props.params.videoId,

      // Video controls.
      videoDurationInSeconds: -1,
      currentVideoTime: 0,
      playheadPosition: 0,
      playheadTailHeight: 0,

      // Tracks controls.
      tracksComponents: [],
      currentWorkingTrack: {
        trackId: null,
        playBackType: null,
        recordingStatus: 'stopped', // recording, stopped, playing
      }
    };
    this.getState = this.getState.bind(this);
    this.updateState = this.updateState.bind(this);
    this.publishVideo = this.publishVideo.bind(this);
    this.addAudioClipTrack = this.addAudioClipTrack.bind(this);
    this.recordAudioClip = this.recordAudioClip.bind(this);
    this.callbackFileSaved = this.callbackFileSaved.bind(this);
    this.getCurrentVideoTime = this.getCurrentVideoTime.bind(this);
  }

  getState() {
    return this.state;
  }

  updateState(newState) {
    this.setState(newState);
  }

  componentDidMount() {
    console.log(this.state.playheadPosition);
    initAudioRecorder();
    this.scrollingFix();
  }

  scrollingFix() {
    function mouseWheelHandler(e) {
      // const e0 = e.originalEvent;
      // const delta = e0.wheelDelta || -e0.detail;
      const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
    document.getElementById('notes-textarea').addEventListener('mousewheel', mouseWheelHandler);
    document.getElementById('tracks').addEventListener('mousewheel', mouseWheelHandler);
  }

  addAudioClipTrack(playBackType) {
    if (this.state.currentWorkingTrack.recordingStatus === 'recording') {
      alert('Unable to add a new track while in the middle of a recording session');
      return;
    }
    const tracks = this.state.tracksComponents.slice();
    const newTrackId = tracks.length + 1;
    tracks.push(<Track
      key={newTrackId}
      id={newTrackId}
      audioFileUrl=''
      playBackType={playBackType}
      recordAudioClip={this.recordAudioClip}
    />);

    this.setState({
      tracksComponents: tracks,
      currentWorkingTrack: {
        trackId: newTrackId,
        playBackType: playBackType,
        recordingStatus: 'stopped',
      },
      playheadTailHeight: this.state.playheadTailHeight < 189 ? this.state.playheadTailHeight + 27 : this.state.playheadTailHeight,
    });
  }

  getCurrentVideoTime(currentVideoTime) {
    if (this.state.currentVideoTime !== currentVideoTime) {
      this.setState({ currentVideoTime });
    }
  }

  recordAudioClip(e, trackId, playBackType) {
    const tracks = this.state.tracksComponents.slice();
    if (e.target.className === 'fa fa-circle') {
      if (this.state.currentWorkingTrack.recordingStatus === 'recording') {
        alert('You cannot record two tracks at the same time');
        return;
      }
      console.log('Start recording for track', trackId);
      this.setState({
        currentWorkingTrack: {
          trackId: trackId,
          playBackType: playBackType,
          recordingStatus: 'recording',
        }
      });
      startRecording();
      e.target.className = 'fa fa-stop';
    } else if (e.target.className === 'fa fa-stop') {
      console.log('Stop recording');
      // Is going to stop the recording and save the file.
      this.setState({
        currentWorkingTrack: {
          trackId: trackId,
          playBackType: playBackType,
          recordingStatus: 'stopped',
        }
      });
      stopRecordingAndSave(this.callbackFileSaved);
      e.target.className = 'fa fa-step-forward';
    } else {
      this.setState({
        currentWorkingTrack: {
          trackId: trackId,
          playBackType: playBackType,
          recordingStatus: 'playing',
        }
      });
      console.log('Just play');
    }
  }

  callbackFileSaved(blob) {
    console.log('The blob is in memory');
    console.log(blob);
    console.log(this.state.currentVideoId);
    console.log(this.state.currentWorkingTrack);
    const formData = new FormData();
    formData.append('label', 'The title from debug');
    formData.append('playbackType', this.state.currentWorkingTrack.playBackType);
    formData.append('startTime', '100.087');
    formData.append('endTime', '134.098');
    formData.append('duration', '10.000');
    formData.append('wavfile', blob);
    const url = `${conf.apiUrl}/audioclips/${this.state.currentVideoId}`;
    console.log('URL', url)
    fetch(url, {
      method: 'POST',
      body: formData,
      mode: 'cors', // no-cors, cors, same-origin
      // headers: {
      //   'Accept': 'application/json',
      //   'Content-Type': 'multipart/form-data',
      // }
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
          <div id="video-section" className="w3-left w3-card-2 w3-margin-top w3-hide-small w3-hide-medium">
            {/*<VideoPlayer*/}
              {/*videoId={this.videoId}*/}
              {/*updateState={this.updateState}*/}
              {/*getCurrentVideoTime={this.getCurrentVideoTime}*/}
            {/*/>*/}
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
              getState={this.getState}
              updateState={this.updateState}
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
