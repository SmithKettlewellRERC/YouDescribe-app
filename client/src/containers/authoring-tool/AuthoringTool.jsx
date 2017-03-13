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
      videoCompleteData: null,
      tracksComponents: [],
      currentWorkingTrack: {
        label: null,
        trackId: null,
        playBackType: null,
        recordingStatus: 'stopped', // recording, stopped, playing
      }
    };
    this.getState = this.getState.bind(this);
    this.updateState = this.updateState.bind(this);
    this.publishVideo = this.publishVideo.bind(this);
    this.updateTrackLabel = this.updateTrackLabel.bind(this);
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
    this.fetchVideoData();
    // this.scrollingFix();
  }

  updateTrackLabel(e) {
    console.log(e.target.value);
  }

  loadTracksComponentsFromData(data) {
    this.setState({ tracksComponents: [] });
    if (data.audio_descriptions && data.audio_descriptions['1'].clips) {
      const clips = data.audio_descriptions['1'].clips;
      const audioClipsKeys = Object.keys(clips);
      audioClipsKeys.forEach((key) => {
        const audioClip = clips[key];
        this.addAudioClipTrack(audioClip.playback_type, audioClip);
      });
    }
  }

  fetchVideoData() {
    const self = this;
    const url = `${conf.apiUrl}/videos/${this.state.currentVideoId}`;
    var xhr = new XMLHttpRequest();
    // xhr.setRequestHeader("Content-type", "application/json");
    xhr.open("GET", url, true);
    xhr.onload = function() {
      self.loadTracksComponentsFromData(JSON.parse(this.responseText).result);
    };
    xhr.send();
    // CORS PROBLEM... :(
    // const headers = new Headers();
    // const headers = new Headers({
    //   "Content-Type": "text/plain",
    //   // "Content-Length": content.length.toString(),
    //   "X-Custom-Header": "ProcessThisImmediately",
    // });

    // const options = { method: 'GET',
    //               headers: headers,
    //               mode: 'cors-with-forced-preflight',
    //               credentials: 'omit',  
    //               cache: 'default' };

    // const request = new Request(url, options);

    // fetch(request)
    // .then((video) => {
    //   console.log(video);
    // })
    // .catch((errFetchVideo) => {
    //   console.log(errFetchVideo)
    // })
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

  addAudioClipTrack(playBackType, audioClipObj = {}) {
    // if (this.state.currentWorkingTrack.recordingStatus === 'recording') {
    //   alert('Unable to add a new track while in the middle of a recording session');
    //   return;
    // }

    // Current tracks.
    const tracks = this.state.tracksComponents.slice();

    // If the last track added doesn't have a url, I don't allow adding more tracks.
    const lastTrackAdded = tracks[tracks.length - 1];
    if ((lastTrackAdded) && (lastTrackAdded.props.audioClipUrl === '')) {
      alert('You can just add more tracks when you finish recording the existing one.');
      return;
    }

    const newTrackId = tracks.length + 1;

    // If we are adding an existing track.
    let audioClipLabel = '';
    let audioClipUrl = '';
    if (Object.keys(audioClipObj).length > 0) {
      audioClipLabel = audioClipObj.file_name;
      audioClipUrl = `${conf.audioClipsUploadsPath}${audioClipObj.file_path}/${audioClipObj.file_name}`;
    }

    console.log('audioClipObj', audioClipObj);

    tracks.push(<Track
      key={newTrackId}
      id={newTrackId}
      label={audioClipLabel}
      audioClipUrl={audioClipUrl}
      playBackType={playBackType}
      recordAudioClip={this.recordAudioClip}
      updateTrackLabel={this.updateTrackLabel}
    />);

    this.setState({
      tracksComponents: tracks,
      playheadTailHeight: this.state.playheadTailHeight < 189 ? this.state.playheadTailHeight + 27 : this.state.playheadTailHeight,
    });
  }

      // currentWorkingTrack: {
      //   trackId: newTrackId,
      //   playBackType: playBackType,
      //   recordingStatus: 'stopped',
      // },



  getCurrentVideoTime(currentVideoTime) {
    if (this.state.currentVideoTime !== currentVideoTime) {
      this.setState({ currentVideoTime });
    }
  }

  getTrackComponentByTrackId(trackId) {
    const tc = this.state.tracksComponents;
    for (let i = 0; i < tc.length; i++) {
      if (tc[i].props.id === trackId) {
        return tc[i];
      }
    }
    return;
  }

  recordAudioClip(e, trackId) {
    const tracks = this.state.tracksComponents.slice();
    const trackComponent = this.getTrackComponentByTrackId(trackId);

    if (e.target.className === 'fa fa-circle') {
      if (this.state.currentWorkingTrack.recordingStatus === 'recording') {
        alert('You cannot record two tracks at the same time');
        return;
      }
      console.log('Start recording for track', trackId);
      this.setState({
        currentWorkingTrack: {
          trackId: trackId,
          playBackType: trackComponent.props.playBackType,
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
          playBackType: trackComponent.props.playBackType,
          recordingStatus: 'stopped',
        }
      });
      // Call to recorder that is going to stop to record.
      stopRecordingAndSave(this.callbackFileSaved);
      e.target.className = 'fa fa-step-forward';
    } else {
      this.setState({
        currentWorkingTrack: {
          trackId: trackId,
          playBackType: trackComponent.props.playBackType,
          recordingStatus: 'playing',
        }
      });
      console.log('Just play');
      this.playAudioClipTrack(trackComponent);
    }
  }

  playAudioClipTrack(trackComponent) {
    // Spinner.
    const audioClipUrl = trackComponent.props.audioClipUrl;
    console.log(audioClipUrl);



    // When stop to play, update currentWorkingTrack.
      // this.setState({
      //   currentWorkingTrack: {
      //     trackId: trackId,
      //     playBackType: trackComponent.props.playBackType,
      //     recordingStatus: 'playing',
      //   }
      // });

    const audioClipLoaded = () => { console.log('audioClipLoaded') };
    const audioClipOnPlay = () => { console.log('audioClipOnPlay') };

    const sound = new Howl({
      src: [audioClipUrl],
      autoplay: true,
      buffer: false,
      onload: audioClipLoaded,
      // onloaderror
      // onend
      // onpause
      onplay: audioClipOnPlay,
    });

  }

  // As we have the file, now we need to get the file info and store metadata.
  callbackFileSaved(blob) {
    const self = this;
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
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.onload = function () {
      self.loadTracksComponentsFromData(JSON.parse(this.responseText).result);
    };
    xhr.send(formData);
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
