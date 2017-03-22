import React, { Component } from 'react';
import { Howl } from 'howler';
import Notes from '../../components/notes/Notes.jsx';
import Editor from '../../components/editor/Editor.jsx';
import Track from '../../components/track/Track.jsx';
import { convertISO8601ToSeconds, convertSecondsToEditorFormat } from '../../shared/helperFunctions';

const conf = require('../../shared/config')();

class AuthoringTool extends Component {
  constructor(props) {
    super(props);
    this.LOGGED_USER = {
      _id: '58cf556546e13d72f1c70490',
      name: 'Rodrigo',
      email: 'lemerodrigo@gmail.com',
    };
    this.watcher = null;
    this.videoState = -1;
    this.currentClip = null;
    this.audioClipsCopy = {};
    this.videoDurationInSeconds = -1;

    this.state = {
      allSet: false,
      videoId: props.params.videoId,
      videoUrl: `${conf.apiUrl}/videos/${props.params.videoId}`,
      notes: '',

      // Video controls and data.
      videoData: {},
      videoPlayer: null,
      videoTitle: '',
      videoDescription: '',
      videoState: -1,
      currentVideoProgress: 0,
      currentVideoProgressToDisplay: '00:00:00:00',
      videoDurationToDisplay: '',
      playheadPosition: 0,
      playheadTailHeight: 0,
      currentTimeInVideo: 0,

      // Audio descriptions.
      audioDescriptionId: null,
      audioDescriptionAudioClips: {},

      // Tracks controls.
      tracksComponents: [],
      selectedTrackComponentId: null,
      selectedTrackComponentPlaybackType: null,
      selectedTrackComponentStatus: null,
      selectedTrackComponentAudioClipStartTime: 0,
      selectedTrackComponentAudioClipSEndTime: -1,
      selectedTrackComponentAudioClipDuration: -1,
      selectedTrackComponentLabel: '',
      selectedTrackComponentUrl: null,
    };
    
    // Bindings.
    this.getState = this.getState.bind(this);
    this.updateState = this.updateState.bind(this);
    this.publishVideo = this.publishVideo.bind(this);
    this.updateTrackLabel = this.updateTrackLabel.bind(this);
    this.addAudioClipTrack = this.addAudioClipTrack.bind(this);
    this.recordAudioClip = this.recordAudioClip.bind(this);
    this.uploadAudioRecorded = this.uploadAudioRecorded.bind(this);
    this.setSelectedTrack = this.setSelectedTrack.bind(this);
  }

  componentDidMount() {
    this.fetchVideoData();
    this.scrollingFix();
  }

  // 2. The main get request that gets the json from our api.
  fetchVideoData() {
    console.log('2 -> fetchingVideoData');
    const self = this;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', this.state.videoUrl, true);
    xhr.onload = function () {
      if (xhr.readyState === 4) {
        const response = JSON.parse(xhr.response);
        if (response.result) {
          self.setState({
            videoData: response.result,
          }, () => {
            self.parseVideoData();
          });
        } else {
          self.parseVideoData();
        }
      }
    };
    xhr.send();
  }

  // 3. We must call this method only once.
  parseVideoData() {
    console.log('3 -> parseVideoData');
    const videoData = Object.assign({}, this.state.videoData);

    let audioDescriptionId = null;
    const audioDescriptionAudioClips = {};

    if (videoData && videoData.audio_descriptions && videoData.audio_descriptions.length > 0) {
      // This looping won't be necessary when the API just delivery the owned AD for the current video.
      for (let i = 0; i < videoData.audio_descriptions.length; i++) {
        const ad = videoData.audio_descriptions[i];
        if (ad.user._id === this.LOGGED_USER._id) {
          audioDescriptionId = ad['_id'];
          if (ad.audio_clips.length > 0) {
            ad.audio_clips.forEach((audioClip) => {
              audioClip.url = `${conf.audioClipsUploadsPath}${audioClip.file_path}/${audioClip.file_name}`;
              audioDescriptionAudioClips[audioClip['_id']] = audioClip;
            });
          }
          break;
        }
      }
    }
    this.setState({
      videoData,
      audioDescriptionId,
      audioDescriptionAudioClips,
    }, () => {
      this.preLoadAudioClips();
    });
  }

  // 4
  preLoadAudioClips() {
    console.log('4 -> preLoadAudioClips');
    const self = this;

    const audioClips = Object.values(this.state.audioDescriptionAudioClips);

    if (audioClips.length > 0) {
      const promises = [];
      audioClips.forEach((audioObj, idx) => {
        console.log(audioObj.url);
        promises.push(fetch(audioObj.url));
      });
      Promise.all(promises).then(function() {
        console.log('All audios loaded.');
        self.getVideoDuration();
      })
      .catch(function(errorAllAudios) {
        console.log('ERROR LOADING AUDIOS -> ', errorAllAudios);
      });
    } else {
      self.getVideoDuration();
    }
  }

  // 5
  getVideoDuration() {
    const self = this;
    console.log('5 -> getVideoDuration');
    const url = `${conf.youTubeApiUrl}/videos?id=${this.state.videoId}&part=contentDetails,snippet&key=${conf.youTubeApiKey}`;
    fetch(url).then(response => response.json()).then((data) => {
      this.videoDurationInSeconds = convertISO8601ToSeconds(data.items[0].contentDetails.duration);
      this.setState({
        videoTitle: data.items[0].snippet.title,
        videoDescription: data.items[0].snippet.description,
        videoDurationToDisplay: convertSecondsToEditorFormat(this.videoDurationInSeconds),
      }, () => {
        self.loadExistingTracks();
      });
    }).catch((err) => {
      console.log('Unable to load the video you are trying to edit.', err);
    });
  }

  // 6
  loadExistingTracks() {
    console.log('6 -> loadTracksComponents');
    const tracksComponents = [];
    const audioClips = Object.values(this.state.audioDescriptionAudioClips);
    const audioClipsLength = audioClips.length;
    if (audioClipsLength > 0) {
      audioClips.forEach((audioClip, idx) => {
        tracksComponents.push(<Track
          key={idx}
          id={idx}
          data={audioClip}
          actionIconClass={'fa-step-forward'}
          getState={this.getState}
          recordAudioClip={this.recordAudioClip}
          updateTrackLabel={this.updateTrackLabel}
          setSelectedTrack={this.setSelectedTrack}
        />);
      });
    }
    const playheadTailHeight = audioClipsLength === 7 ? audioClipsLength * 27 : 189;
    this.setState({
      tracksComponents,
      playheadTailHeight,
    }, () => {
      this.initVideoPlayer();
    });
  }

  // 7
  initVideoPlayer() {
    console.log('7 -> initVideoPlayer -> YouTube Id: ', this.state.videoId);
    const self = this;

    if (YT.loaded) {
      startVideo();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        startVideo();
      };
    }

    function onVideoPlayerReady() {
      const audioClips = self.state.audioDescriptionAudioClips;
      self.audioClipsCopy = Object.values(audioClips);
      initAudioRecorder();
    }

    function onPlayerStateChange(event) {
      self.videoState = event.data;
      const audioClips = Object.values(self.state.audioDescriptionAudioClips);
      self.setState({ videoState: event.data }, () => {
        switch (event.data) {
          // ended
          case 0:
            if (self.watcher) {
              clearInterval(self.watcher);
              self.watcher = null;
            }
            break;
          // playing
          case 1:
            if (self.currentClip && self.currentClip.playbackType === 'extended') {
              self.currentClip.stop();
            }
            self.videoProgressWatcher();
            break;
          // paused
          case 2:
            self.audioClipsCopy = audioClips.slice();
            if (self.currentClip && self.currentClip.playbackType === 'inline') {
              self.currentClip.pause();
            }
            if (self.watcher) {
              clearInterval(self.watcher);
              self.watcher = null;
            }
            break;
          // buffering
          case 3:
            self.audioClipsCopy = audioClips.slice();
            if (self.currentClip && self.currentClip.playbackType === 'inline') {
              self.currentClip.pause();
            }
            break;
          default:
            if (self.watcher) {
              clearInterval(self.watcher);
              self.watcher = null;
            }
        }
      });
    }

    function startVideo() {
      if (self.state.videoPlayer === null) {
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
          }),
        });
      }
    }
  }

  // 8
  videoProgressWatcher() {
    console.log('8 -> videoProgressWatcher')

    const interval = 50;

    if (this.watcher) {
      clearInterval(this.watcher);
      this.watcher = null;
    }

    this.watcher = setInterval(() => {
      const currentVideoProgress = this.state.videoPlayer.getCurrentTime();
      const videoVolume = this.state.videoPlayer.getVolume();
      const playheadPosition = 755 * (currentVideoProgress / this.videoDurationInSeconds);

      this.setState({
        currentVideoProgress,
        currentVideoProgressToDisplay: convertSecondsToEditorFormat(currentVideoProgress),
        playheadPosition,
        videoVolume,
      });

      for (let i = 0; i < this.audioClipsCopy.length; i += 1) {
        switch (this.audioClipsCopy[i].playback_type) {
          case 'inline':
            if (currentVideoProgress >= +this.audioClipsCopy[i].start_time && currentVideoProgress < +this.audioClipsCopy[i].end_time) {
              console.log('## INLINE');
              this.currentClip = new Howl({
                src: [this.audioClipsCopy[i].url],
                html5: true,
                onload: () => {
                  this.currentClip.playbackType = 'inline',
                  this.currentClip.seek(currentVideoProgress - +this.audioClipsCopy[i].start_time, this.currentClip.play());
                  this.audioClipsCopy = this.audioClipsCopy.slice(i + 1);
                },
                onloaderror: (errToLoad) => {
                  console.log('Impossible to load', errToLoad)
                },
                onplay: () => {
                  console.log('Inline audio description clip');
                  this.previousVideoVolume = videoVolume;
                },
                onend: () => {
                  this.currentClip = null;
                  this.state.videoPlayer.setVolume(this.previousVideoVolume);
                },
              });
            }
            break;
          case 'extended':
            if (Math.abs(+this.audioClipsCopy[i].start_time - currentVideoProgress) <= interval / 1000 ||
            (+this.audioClipsCopy[i].start_time < 0.5 && currentVideoProgress <= interval / 500)) {
              console.log('Extended audio description clip');
              this.currentClip = new Howl({
                src: [this.audioClipsCopy[i].url],
                html5: true,
                onload: () => {
                  this.currentClip.playbackType = 'extended';
                  this.audioClipsCopy = this.audioClipsCopy.slice(i + 1);
                  this.currentClip.play();
                },
                onloaderror: (errToLoad) => {
                  console.log('Impossible to load current audio', errToLoad)
                },
                onplay: () => {
                  console.log('Extended?');
                  this.state.videoPlayer.pauseVideo();
                },
                onend: () => {
                  this.currentClip = null;
                  this.state.videoPlayer.playVideo();
                },
              });
            }
            break;
          default:
            console.log('Audio clip format not labelled or incorrect');
          }
        }
    }, interval);
  }

  componentWillUnmount() {
    if (this.watcher) {
      clearInterval(this.watcher);
      this.watcher = null;
    }
  }

  addAudioClipTrack(playbackType) {
    // Current tracks components.
    const tracks = this.state.tracksComponents.slice();

    // I will just add tracks if all existant have urls.
    for (let i = 0; i < tracks.length; i += 1) {
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
    };

    tracks.push(
      <Track
        key={newTrackId}
        id={newTrackId}
        data={audioClip}
        actionIconClass={'fa-circle'}
        getState={this.getState}
        recordAudioClip={this.recordAudioClip}
        updateTrackLabel={this.updateTrackLabel}
        setSelectedTrack={this.setSelectedTrack}
      />,
    );

    const playheadTailHeight = this.state.playheadTailHeight < 189 ? this.state.playheadTailHeight + 27 : this.state.playheadTailHeight;

    this.setState({
      tracksComponents: tracks,
      selectedTrackComponentPlaybackType: playbackType,
      playheadTailHeight,
    });
  }

  getTrackComponentByTrackId(trackId) {
    const tc = this.state.tracksComponents;
    for (let i = 0; i < tc.length; i += 1) {
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
        selectedTrackComponentAudioClipStartTime: this.state.currentVideoProgress,
        selectedTrackComponentId: trackId,
        selectedTrackComponentPlaybackType: clickedTrackComponent.props.data.playback_type,
        selectedTrackComponentStatus: 'recording',
      }, () => {
        this.updateTrackComponent('fa-stop', this.state.currentVideoProgress);
        if (this.state.selectedTrackComponentPlaybackType === 'inline') {
          this.state.videoPlayer.mute();
          this.state.videoPlayer.playVideo();
        } else {
          this.state.videoPlayer.pauseVideo();
        }
        startRecording();
      });
    } else if (e.target.className === 'fa fa-stop') {
      // STOP RECORDING.
      this.setState({
        selectedTrackComponentStatus: 'stopped',
      }, () => {
        this.updateTrackComponent('fa-step-forward');
        this.state.videoPlayer.unMute();
        this.state.videoPlayer.pauseVideo();
        stopRecordingAndSave(this.uploadAudioRecorded);
      });
    } else if (e.target.className === 'fa fa-step-forward') {
      // SEEK TO.
      const seekToValue = clickedTrackComponent.props.data.start_time;
      console.log('Seek video to', seekToValue);
      this.state.videoPlayer.seekTo(parseFloat(seekToValue) - conf.seekToPositionDelayFix, true);
      this.state.videoPlayer.unMute();
      this.state.videoPlayer.pauseVideo();

      this.setState({ currentTimeInVideo: seekToValue });
    } else {
      console.log('?');
    }
  }

  updateTrackComponent(classIcon, startTime = 0) {
    const tracks = this.state.tracksComponents.slice();
    for (let i = 0; i < tracks.length; i += 1) {
      if (this.state.selectedTrackComponentId === tracks[i].props.id) {
        const audioClip = {
          label: this.state.selectedTrackComponentLabel,
          playback_type: this.state.selectedTrackComponentPlaybackType,
          start_time: startTime,
          url: this.state.selectedTrackComponentUrl,
        };

        tracks[i] = (
          <Track
            key={this.state.selectedTrackComponentId}
            id={this.state.selectedTrackComponentId}
            data={audioClip}
            actionIconClass={classIcon}
            getState={this.getState}
            recordAudioClip={this.recordAudioClip}
            updateTrackLabel={this.updateTrackLabel}
            setSelectedTrack={this.setSelectedTrack}
          />
        );
      }
    }
    this.setState({ tracksComponents: tracks });
  }

  uploadAudioRecorded(args) {

    const self = this;
    const formData = new FormData();
    formData.append('title', this.state.videoTitle);
    formData.append('description', this.state.videoDescription);
    formData.append('notes', this.state.notes);
    formData.append('label', this.state.selectedTrackComponentLabel);
    formData.append('playbackType', this.state.selectedTrackComponentPlaybackType);
    formData.append('startTime', this.state.selectedTrackComponentAudioClipStartTime);
    formData.append('audioDescriptionId', this.state.audioDescriptionId);
    if (this.state.selectedTrackComponentPlaybackType === 'extended') {
      formData.append('endTime', this.state.selectedTrackComponentAudioClipStartTime);
    } else {
      formData.append('endTime', this.state.selectedTrackComponentAudioClipStartTime + args.duration);
    }
    formData.append('duration', args.duration);
    formData.append('wavfile', args.audioBlob);
    const url = `${conf.apiUrl}/audioclips/${this.state.videoId}`;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = function () {
      // console.log(JSON.parse(this.responseText).result);
      self.setState({
        videoData: JSON.parse(this.responseText).result,
      }, () => {
        self.parseVideoData();
      });
    };
    xhr.send(formData);
  }

  publishVideo() {
    const url = `${conf.apiUrl}/videos/${this.state.videoId}`;
    const xhr = new XMLHttpRequest();
    xhr.open('put', url, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-type', 'application/json');
    const data = new FormData();
    data.append('publish', 'true');
    xhr.onload = function () {
      self.setState({
        videoData: JSON.parse(this.responseText).result,
      }, () => {
        self.parseVideoData();
      });
    };
    xhr.send(data);
  }

  getState() {
    return this.state;
  }

  updateState(newState) {
    this.setState(newState);
  }

  scrollingFix() {
    function mouseWheelHandler(e) {
      const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

      this.scrollTop += (delta < 0
        ? 1
        : -1) * 30;
      e.preventDefault();
    }
    document.getElementById('notes-textarea').addEventListener('mousewheel', mouseWheelHandler);
    document.getElementById('tracks').addEventListener('mousewheel', mouseWheelHandler);
  }

  setSelectedTrack(e, trackId) {
    console.log('Set selected track');
    const tracks = this.state.tracksComponents;
    for (let i = 0; i < tracks.length; i += 1) {
      if (trackId === tracks[i].props.id) {
        this.setState({
          selectedTrackComponentId: tracks[i].props.id,
          selectedTrackComponentPlaybackType: tracks[i].props.playBackType,
          selectedTrackComponentAudioClipStartTime: tracks[i].props.startTime,
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
    this.setState({
      selectedTrackComponentLabel: e.target.value,
    });
  }

  // 1
  render() {
    // console.log('1 -> render authoring tool')
    return (
      <main id="authoring-tool">
        <div className="w3-row">
          <div
            id="video-section"
            className="w3-left w3-card-2 w3-margin-top w3-hide-small w3-hide-medium"
          >
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
