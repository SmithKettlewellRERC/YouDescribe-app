import React, { Component } from 'react';
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
    this.nextAudioClip = null;
    this.state = {
      videoId: props.params.videoId,
      videoUrl: `${conf.apiUrl}/videos/${props.params.videoId}`,

      // Video controls and data.
      videoData: {},
      videoPlayer: null,
      audioClips: [],
      videoDuration: 0,
      videoTitle: '',
      videoDescription: '',
      currentVideoProgress: 0,
      currentVideoProgressToDisplay: '00:00:00:00',
      videoDurationToDisplay: '',
      playheadPosition: 0,
      playheadTailHeight: 0,
      currentTimeInVideo: 0,

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
    this.setSelectedTrack = this.setSelectedTrack.bind(this);
  }

  componentDidMount() {
    this.fetchVideoData();
    this.scrollingFix();
  }

  // 2
  fetchVideoData() {
    console.log('2 -> fetchingVideoData');
    const self = this;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.state.videoUrl, true);
    xhr.onload = function() {
      if (xhr.readyState === 4) {
        const response = JSON.parse(xhr.response);
        const result = response.result ? response.result : {};
        self.setState({
          videoData: response.result,
        }, () => {
          self.parseVideoData();
        });
      }
    };
    xhr.send();
  }

  // 3
  parseVideoData() {
    console.log('3 -> parseVideoData');
    const videoData = Object.assign({}, this.state.videoData);
    const audioClips = [];
    if (videoData && videoData.audio_descriptions && videoData.audio_descriptions['1'].clips) {
      const clips = videoData.audio_descriptions['1'].clips;
      const clipsIds = Object.keys(clips);
      clipsIds.forEach((id) => {
        const obj = clips[id];
        obj.url = `${conf.audioClipsUploadsPath}${obj.file_path}/${obj.file_name}`;
        audioClips.push(obj);
      });
      videoData.audio_descriptions['1'].clips = audioClips;
    }
    this.setState({
      videoData: videoData,
      audioClips: audioClips,
    }, () => {
      this.preLoadAudioClips();
    });
  }

  // 4
  preLoadAudioClips() {
    console.log('4 -> preLoadAudioClips');
    const self = this;
    if (this.state.audioClips.length > 0) {
      let promises = [];
      this.state.audioClips.forEach((audioObj, idx) => {
        console.log(idx+1, 'audio description loaded', audioObj.url);
        promises.push(fetch(audioObj.url));
      });
      Promise
      .all(promises)
      .then(function() {
        console.log('All audios loaded');
        self.loadExistingTracks();
      })
      .catch(function(errorAllAudios) {
        console.log('ERROR LOADING AUDIOS -> ', errorAllAudios);
      });
    } else {
      self.loadExistingTracks();
    }
  }

  // 5
  loadExistingTracks() {
    console.log('5 -> loadTracksComponents');
    const tracksComponents = [];
    if (this.state.audioClips.length > 0) {
      this.state.audioClips.forEach((audioClip, idx) => {
        tracksComponents.push(<Track
          key={idx}
          id={idx}
          data={audioClip}
          actionIconClass={'fa-step-forward'}
          recordAudioClip={this.recordAudioClip}
          updateTrackLabel={this.updateTrackLabel}
          setSelectedTrack={this.setSelectedTrack}
        />);
      });
    }
    this.setState({ tracksComponents }, () => {
      this.initVideoPlayer();
    });
  }

  // 6
 initVideoPlayer() {
    const self = this;
    console.log('6 -> initVideoPlayer', this.state.videoId);
    if (YT.loaded) {
      startVideo();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        startVideo();
      }
    }

    function startVideo() {
      self.setState({
        videoPlayer: new YT.Player('playerAT', {
            height: '100%',
            videoId: self.state.videoId,
            enablejsapi: true,
            fs: 0,
            rel: 0,
            controls: 2,
            disablekb: 1,
            events: {
              onReady: onVideoPlayerReady,
              onStateChange: onPlayerStateChange,
            },
          })
      });
    }
      
    function onVideoPlayerReady() {
      self.getVideoDuration();
    }

    function onPlayerStateChange(newState) {
      const videoState = {
        '-1': 'unstarted',
        '0': 'ended',
        '1': 'playing',
        '2': 'paused',
        '3': 'buffering',
        '5': 'video cued',
      }
      // console.log('Video player new state', videoState[newState.data.toString()])
    }
  }

  // 7
  getVideoDuration() {
    console.log('7 -> getVideoDuration');
    const url = `${conf.youTubeApiUrl}/videos?id=${this.state.videoId}&part=contentDetails,snippet&key=${conf.youTubeApiKey}`;
    fetch(url)
    .then(response => response.json())
    .then((data) => {
      console.log(data.items[0])
      this.videoDurationInSeconds = convertISO8601ToSeconds(data.items[0].contentDetails.duration);
      this.setState({
        videoTitle: data.items[0].snippet.title,
        videoDescription: data.items[0].snippet.description,
        videoDuration: this.videoDurationInSeconds,
        videoDurationToDisplay: convertSecondsToEditorFormat(convertISO8601ToSeconds(data.items[0].contentDetails.duration)),
      }, () => {
        console.log('Video duration to display -> ', this.state.videoDurationToDisplay);
        console.log('Initializing audio recorder...')
        initAudioRecorder();
        this.videoProgressWatcher();
      });
    })
    .catch(() => {
      alert('Unable to load the video you are trying to edit.');
    });
  }

  // 8
  videoProgressWatcher() {
    console.log('8 -> videoProgressWatcher')
    let previousTime = 0;
    let currentVideoProgress = 0;
    let currentAudioClip = null;

    this.watcher = setInterval(() => {
      currentVideoProgress = this.state.videoPlayer.getCurrentTime();
      // console.log(currentVideoProgress)
      this.setState({
        currentVideoProgress,
        currentVideoProgressToDisplay: convertSecondsToEditorFormat(currentVideoProgress),        
        playheadPosition: 731 * (currentVideoProgress / this.videoDuration),
      })

      // When the user back the video.
      if (Math.abs(currentVideoProgress - previousTime) > conf.videoPlayerWathcerDelay) {
        currentAudioClip = this.getNextAudioClip(currentVideoProgress);
      }

      previousTime = currentVideoProgress;

      let timedEvent;
      if (this.nextAudioClip) {
        timedEvent = Number(this.nextAudioClip.start_time);
      } else {
        timedEvent = Infinity;
      }

      if (currentVideoProgress > timedEvent) {
        const url = this.nextAudioClip.url
        if (this.nextAudioClip.playback_type === 'inline') {
          console.log('### INLINE -> ', url);
          this.playAudioClip(url, currentVideoProgress);
        } else {
          console.log('### EXTENDED -> ', url);
          this.state().videoPlayer.pauseVideo();
          this.playAudioClip(url, () => {
            this.state().videoPlayer.playVideo();
          });
        }
        this.getNextAudioClip(currentVideoProgress);
      }
    }, conf.videoPlayerWathcerInterval);
  }

  getNextAudioClip(currentVideoProgress) {
    const audioClipsCuePoints = this.state.audioClips.map((clip) => clip.start_time).sort((a, b) => a - b);
    for (let i = 0; i < audioClipsCuePoints.length; i += 1) {
      if (currentVideoProgress < this.state.audioClips[i].start_time) {
        this.nextAudioClip = this.state.audioClips[i];
        return this.nextAudioClip;
      }
    }
    this.nextAudioClip = null;
    return null;
  }

  playAudioClip(url, callback = () => {}) {
    const audio = new Howl({
      src: [url],
      html5: true,
      onend: () => {
        callback();
      },
    });
    audio.play();
  }

  addAudioClipTrack(playbackType) {
    console.log('addAudioClipTrack -> ', playbackType);

    // Current tracks components.
    const tracks = this.state.tracksComponents.slice();

    // I will just add tracks if all existant have urls.
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].props.data.url === '') {
        alert('Finish using your available record tracks.');
        return;
      }
    }

    // Don't allow adding more tracks while recording.
    if (this.state.selectedTrackComponentStatus === 'recording') {
      alert('You can just add more tracks when you finish recording the existing one.');
      return;
    }

    const newTrackId = this.state.tracksComponents.length;

    const audioClip = {
      label: '',
      playback_type: playbackType,
      start_time: 0,
      url: '',
    }    

    tracks.push(<Track
      key={newTrackId}
      id={newTrackId}
      data={audioClip}
      actionIconClass={'fa-circle'}
      recordAudioClip={this.recordAudioClip}
      updateTrackLabel={this.updateTrackLabel}
      setSelectedTrack={this.setSelectedTrack}
    />);

    this.setState({
      tracksComponents: tracks,
      selectedTrackComponentPlaybackType: playbackType,
      playheadTailHeight: this.state.playheadTailHeight < 189 ? this.state.playheadTailHeight + 27 : this.state.playheadTailHeight,
    });
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
        selectedTrackComponentStartTime: this.state.currentVideoProgress,
        selectedTrackComponentId: trackId,
        selectedTrackComponentPlaybackType: clickedTrackComponent.props.data.playback_type,
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
      this.setState({ currentTimeInVideo: seekToValue });

    } else {
      console.log('?');
    }
  }

  updateTrackComponent(classIcon) {
    const tracks = this.state.tracksComponents.slice();
    for (let i = 0; i < tracks.length; i++) {
      if (this.state.selectedTrackComponentId === tracks[i].props.id) {

        const audioClip = {
          label: this.state.selectedTrackComponentLabel,
          playback_type: this.state.selectedTrackComponentPlaybackType,
          start_time: 0,
          url: this.state.selectedTrackComponentUrl,
        }    

        tracks[i] = <Track
          key={this.state.selectedTrackComponentId}
          id={this.state.selectedTrackComponentId}
          data={audioClip}
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
    console.log('blob', blob)
    const self = this;
    const formData = new FormData();
    formData.append('videoTitle', this.state.videoTitle);
    formData.append('videoDescription', this.state.videoDescription);
    formData.append('label', this.state.selectedTrackComponentLabel);
    formData.append('playbackType', this.state.selectedTrackComponentPlaybackType);
    formData.append('startTime', this.state.selectedTrackComponentStartTime);
    formData.append('wavfile', blob);
    console.log('Going to save start time at', this.state.selectedTrackComponentStartTime);
    const url = `${conf.apiUrl}/audioclips/${this.state.videoId}`;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.onload = function () {
      // self.loadTracksComponentsFromData(JSON.parse(this.responseText).result);
      console.log('RESULTTTTTT TEXT', JSON.parse(this.responseText))
      console.log('RESULTTTTTT', JSON.parse(this.responseText).result)
      // self.setState({
      //   videoData: response.result,
      // }, () => {
      //   self.parseVideoData();
      // });
    };
    xhr.send(formData);
  }

  publishVideo() {
    alert('published');
  }

  getState() { return this.state; }
  
  updateState(newState) { this.setState(newState); }

  scrollingFix() {
    function mouseWheelHandler(e) {
      const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
    document.getElementById('notes-textarea').addEventListener('mousewheel', mouseWheelHandler);
    document.getElementById('tracks').addEventListener('mousewheel', mouseWheelHandler);
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
  
  updateTrackLabel(e) {
    this.setState({ selectedTrackComponentLabel: e.target.value });
  }

  // 1
  render() {
    // console.log('1 -> render authoring tool')
    return (
      <main id="authoring-tool">
        <div className="w3-row">
          <div id="video-section" className="w3-left w3-card-2 w3-margin-top w3-hide-small w3-hide-medium">
            <div id="playerAT" />
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
