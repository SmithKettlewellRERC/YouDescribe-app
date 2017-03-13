import React, { Component } from 'react';
import VideoPlayer from '../../components/video-player/VideoPlayerAuthoringTool.jsx';
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
      seekVideoPosition: 0,

      videoPlayer: null,

      // Tracks controls.
      videoCompleteData: null,
      tracksComponents: [],
      // selectedComponentLabel: '',

      selectedComponentId: null,
      selectedComponentPlaybackType: null,
      selectedComponentStatus: null,
      // selectedComponentPlayer: null,
      // selectedComponentUrl: null,
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
    xhr.open("GET", url, true);
    xhr.onload = function() {
      self.loadTracksComponentsFromData(JSON.parse(this.responseText).result);
    };
    xhr.send();
  }

  scrollingFix() {
    function mouseWheelHandler(e) {
      const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
    document.getElementById('notes-textarea').addEventListener('mousewheel', mouseWheelHandler);
    document.getElementById('tracks').addEventListener('mousewheel', mouseWheelHandler);
  }

  addAudioClipTrack(playBackType, audioClipObj = {}) {
    // Current tracks components.
    const tracks = this.state.tracksComponents.slice();

    // I will just add tracks if all existing have urls.
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].props.audioClipUrl === '') {
        alert('Finish using your available record tracks.');
        return;
      }
    }

    // Don't allow adding more tracks while recording.
    if (this.state.selectedComponentStatus === 'recording') {
      alert('You can just add more tracks when you finish recording the existing one.');
      return;
    }

    const newTrackId = tracks.length + 1;

    // If we are adding an existing track in the db.
    let audioClipLabel = '';
    let audioClipUrl = '';
    let actionIconClass = 'fa-circle';
    let startTime = 0;
    if (Object.keys(audioClipObj).length > 0) {
      audioClipLabel = audioClipObj.file_name;
      audioClipUrl = `${conf.audioClipsUploadsPath}${audioClipObj.file_path}/${audioClipObj.file_name}`;
      startTime = audioClipObj.start_time;
      actionIconClass = 'fa-step-forward';
    }

    tracks.push(<Track
      key={newTrackId}
      id={newTrackId}
      label={audioClipLabel}
      audioClipUrl={audioClipUrl}
      playBackType={playBackType}
      startTime={startTime}
      recordAudioClip={this.recordAudioClip}
      updateTrackLabel={this.updateTrackLabel}
      actionIconClass={actionIconClass}
    />);

    this.setState({
      tracksComponents: tracks,
      playheadTailHeight: this.state.playheadTailHeight < 189 ? this.state.playheadTailHeight + 27 : this.state.playheadTailHeight,
    });
  }

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


    console.log('currentVideoTime', this.state.currentVideoTime);
    // If there is another component active, I need to stop it before accepting the action.
    if (this.state.selectedComponentId !== trackId) {

      if (this.state.selectedComponentStatus === 'recording') {
        alert('You need to stop recording in order to activate any other track');
        return;
      }

      // if (this.state.selectedComponentStatus === 'playing') {
      //   console.log('You have another track playing/paused');
      //   this.stopAudioClipTrack();
      //   return;
      // }
    }

    const clickedTrackComponent = this.getTrackComponentByTrackId(trackId);

    if (e.target.className === 'fa fa-circle') {
      
      // RECORD.
      this.setState({
        selectedComponentId: trackId,
        selectedComponentPlaybackType: clickedTrackComponent.props.playBackType,
        selectedComponentStatus: 'recording',
      }, () => {
        this.updateTrackComponent('fa-stop');
        if (this.state.selectedComponentPlaybackType == 'inline') {
          this.state.videoPlayer.playVideo();
        } else {
          this.state.videoPlayer.stopVideo();
        }
        startRecording();
      });

    } else if (e.target.className === 'fa fa-stop') {

      // STOP RECORDING.
      this.setState({ selectedComponentStatus: 'stopped' }, () => {
        this.updateTrackComponent('fa-step-forward');
        this.state.videoPlayer.stopVideo();
        stopRecordingAndSave(this.callbackFileSaved);
      });

    } else if (e.target.className === 'fa fa-step-forward') {

      // PLAY.
      // this.setState({
      //   selectedComponentId: clickedTrackComponent.props.id,
      //   selectedComponentUrl: clickedTrackComponent.props.audioClipUrl,
      //   selectedComponentPlaybackType: clickedTrackComponent.props.playBackType,
      //   selectedComponentStatus: 'playing'
      // }, () => {
      //   this.playAudioClipTrack();
      // });
      // SeekTo
      const seekToValue = clickedTrackComponent.props.startTime;
      console.log('Seek video to', seekToValue);
      this.state.videoPlayer.seekTo(parseFloat(seekToValue));
      this.setState({ seekVideoPosition: seekToValue });

    } else if (e.target.className === 'fa fa-pause') {

      // PAUSE.
      // this.setState({
      //   selectedComponentId: clickedTrackComponent.props.id,
      //   selectedComponentUrl: clickedTrackComponent.props.audioClipUrl,
      //   selectedComponentPlaybackType: clickedTrackComponent.props.playBackType,
      //   selectedComponentStatus: 'paused'
      // }, () => {
      //   this.pauseAudioClipTrack();
      // });

    } else {
      console.log('????????????????????????????????????');
    }
  }

  updateTrackComponent(classIcon) {
    // console.log('Updating track component');
    let newTracks = [];
    const tracks = this.state.tracksComponents.slice();
    for (let i = 0; i < tracks.length; i++) {
      // console.log(this.state.selectedComponentId, tracks[i].props.id);
      if (this.state.selectedComponentId === tracks[i].props.id) {
        tracks[i] = <Track
          key={this.state.selectedComponentId}
          id={this.state.selectedComponentId}
          label={this.state.selectedComponentLabel}
          audioClipUrl={this.state.selectedComponentUrl}
          playBackType={this.state.selectedComponentPlaybackType}
          actionIconClass={classIcon}
          recordAudioClip={this.recordAudioClip}
          updateTrackLabel={this.updateTrackLabel}
        />
      }
    }
    this.setState({ tracksComponents: tracks });
  }

  playAudioClipTrack() {

    const audioClipUrl = this.state.selectedComponentUrl;

    const audioClipLoaded = () => {
      this.state.selectedComponentPlayer.play();
    };

    const audioClipPlay = () => {
      console.log('play')
      this.setState({ selectedComponentStatus: 'playing' }, () => {
        this.updateTrackComponent('fa-pause');
      });
    };

    const audioClipEnded = () => {
      console.log('onend')
      this.setState({ selectedComponentStatus: 'stopped' }, () => {
        this.updateTrackComponent('fa-step-forward');
      });
    };

    const audioClipPaused = () => {
      this.setState({ selectedComponentStatus: 'paused' }, () => {
        this.updateTrackComponent('fa-step-forward');
      });
    };

    const audioClipError = () => { console.log('error') };

    this.setState({
      selectedComponentPlayer: new Howl({
        src: [audioClipUrl],
        autoplay: false,
        buffer: false,
        onload: audioClipLoaded,
        onloaderror: audioClipError,
        onend: audioClipEnded,
        onpause: audioClipPaused,
        onplay: audioClipPlay,
      })
    });
  }

  stopAudioClipTrack() {
    this.setState({ selectedComponentStatus: 'stopped' }, () => {
      this.updateTrackComponent('fa-step-forward');
      this.state.selectedComponentPlayer.stop();
    });
  }

  pauseAudioClipTrack(clickedTrackComponent) {
    this.state.selectedComponentPlayer.pause();
  }

  // As we have the file, now we need to get the file info and store metadata.
  callbackFileSaved(blob) {
    const self = this;
    const formData = new FormData();
    formData.append('label', this.state.selectedComponentLabel);
    formData.append('playbackType', this.state.selectedComponentPlaybackType);
    formData.append('startTime', this.state.currentVideoTime);
    formData.append('wavfile', blob);
    const url = `${conf.apiUrl}/audioclips/${this.state.currentVideoId}`;
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
            <VideoPlayer
              videoId={this.state.currentVideoId}
              getState={this.getState}
              updateState={this.updateState}
              getCurrentVideoTime={this.getCurrentVideoTime}
              seekVideoTo={this.seekVideoTo}
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
