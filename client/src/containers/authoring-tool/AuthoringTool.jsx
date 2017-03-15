import React, { Component } from 'react';
import VideoPlayerAT from '../../components/video-player/VideoPlayerAT.jsx';
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
      videoPlayer: null,
      // videoDurationInSeconds: -1,
      currentVideoTime: 0,
      playheadPosition: 0,
      playheadTailHeight: 0,
      seekVideoPosition: 0,

      // Tracks controls.
      tracksComponents: [],
      selectedTrackComponentId: null,
      selectedTrackComponentPlaybackType: null,
      selectedTrackComponentStatus: null,
      selectedTrackComponentStartTime: 0,
      selectedTrackComponentLabel: null,
      selectedTrackComponentUrl: null,
    };
    this.getState = this.getState.bind(this);
    this.updateState = this.updateState.bind(this);
    this.publishVideo = this.publishVideo.bind(this);
    this.updateTrackLabel = this.updateTrackLabel.bind(this);
    this.addAudioClipTrack = this.addAudioClipTrack.bind(this);
    this.recordAudioClip = this.recordAudioClip.bind(this);
    this.callbackFileSaved = this.callbackFileSaved.bind(this);
    this.setCurrentVideoTime = this.setCurrentVideoTime.bind
    (this);
    this.setSelectedTrack = this.setSelectedTrack.bind(this);
  }

  setSelectedTrack(e, trackId) {
    console.log('Set selected track');
    const tracks = this.state.tracksComponents;
    for (let i = 0; i < tracks.length; i++) {
      if (trackId === tracks[i].props.id) {
        this.setState({
          selectedTrackComponentId: tracks[i].props.id,
          selectedTrackComponentPlaybackType: tracks[i].props.playBackType,
          selectedTrackComponentStartTime: tracks[i].props.startTime,
          selectedTrackComponentLabel: tracks[i].props.label,
          selectedTrackComponentUrl: tracks[i].props.audioClipUrl,
        });
      }
    }
    if (e.charCode === 13) {
      console.log('Enter pressed');
    }
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
    this.scrollingFix();
  }

  updateTrackLabel(e) {
    this.setState({ selectedTrackComponentLabel: e.target.value });
  }

  loadTracksComponentsFromData(data) {
    this.setState({ tracksComponents: [] });
    if (data && data.audio_descriptions && data.audio_descriptions['1'].clips) {
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
    if (this.state.selectedTrackComponentStatus === 'recording') {
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
      audioClipLabel = audioClipObj.label;
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
      setSelectedTrack={this.setSelectedTrack}
    />);

    this.setState({
      tracksComponents: tracks,
      playheadTailHeight: this.state.playheadTailHeight < 189 ? this.state.playheadTailHeight + 27 : this.state.playheadTailHeight,
    });
  }

  setCurrentVideoTime(currentVideoTime) {
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

    if (this.state.selectedTrackComponentId !== trackId) {
      if (this.state.selectedTrackComponentStatus === 'recording') {
        alert('You need to stop recording in order to activate any other track');
        return;
      }
    }

    const clickedTrackComponent = this.getTrackComponentByTrackId(trackId);

    if (e.target.className === 'fa fa-circle') {

      // RECORD.
      this.setState({
        selectedTrackComponentStartTime: this.state.currentVideoTime,
        selectedTrackComponentId: trackId,
        selectedTrackComponentPlaybackType: clickedTrackComponent.props.playBackType,
        selectedTrackComponentStatus: 'recording',
      }, () => {
        this.updateTrackComponent('fa-stop');
        if (this.state.selectedTrackComponentPlaybackType == 'inline') {
          this.state.videoPlayer.mute();
          this.state.videoPlayer.playVideo();
        } else {
          this.state.videoPlayer.pauseVideo();
        }
        startRecording();
      });

    } else if (e.target.className === 'fa fa-stop') {

      // STOP RECORDING.
      this.setState({ selectedTrackComponentStatus: 'stopped' }, () => {
        this.updateTrackComponent('fa-step-forward');
        this.state.videoPlayer.unMute();
        this.state.videoPlayer.pauseVideo();
        stopRecordingAndSave(this.callbackFileSaved);
      });

    } else if (e.target.className === 'fa fa-step-forward') {

      // SEEK TO.
      const seekToValue = clickedTrackComponent.props.startTime;
      console.log('Seek video to', seekToValue);
      this.state.videoPlayer.seekTo(parseFloat(seekToValue) - conf.seekToPositionDelayFix, true);
      this.state.videoPlayer.unMute();
      this.state.videoPlayer.pauseVideo();
      this.setState({ seekVideoPosition: seekToValue });

    } else {
      console.log('?');
    }
  }

  updateTrackComponent(classIcon) {
    let newTracks = [];
    const tracks = this.state.tracksComponents.slice();
    for (let i = 0; i < tracks.length; i++) {
      if (this.state.selectedTrackComponentId === tracks[i].props.id) {
        tracks[i] = <Track
          key={this.state.selectedTrackComponentId}
          id={this.state.selectedTrackComponentId}
          label={this.state.selectedTrackComponentLabel}
          audioClipUrl={this.state.selectedTrackComponentUrl}
          playBackType={this.state.selectedTrackComponentPlaybackType}
          actionIconClass={classIcon}
          recordAudioClip={this.recordAudioClip}
          updateTrackLabel={this.updateTrackLabel}
          setSelectedTrack={this.setSelectedTrack}
        />
      }
    }
    this.setState({ tracksComponents: tracks });
  }

  // As we have the file, now we need to get the file info and store metadata.
  callbackFileSaved(blob) {
    const self = this;
    const formData = new FormData();
    formData.append('label', this.state.selectedTrackComponentLabel);
    formData.append('playbackType', this.state.selectedTrackComponentPlaybackType);
    formData.append('startTime', this.state.selectedTrackComponentStartTime);
    formData.append('wavfile', blob);
    console.log('Going to save start time st', this.state.selectedTrackComponentStartTime);
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
            <VideoPlayerAT
              videoId={this.state.currentVideoId}
              getState={this.getState}
              updateState={this.updateState}
              setCurrentVideoTime={this.setCurrentVideoTime}
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
