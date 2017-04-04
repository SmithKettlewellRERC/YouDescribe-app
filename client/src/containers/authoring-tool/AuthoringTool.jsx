import React, { Component } from 'react';
import { Howl } from 'howler';
import Notes from '../../components/notes/Notes.jsx';
import Editor from '../../components/editor/Editor.jsx';
import Track from '../../components/track/Track.jsx';
import { convertISO8601ToSeconds, convertSecondsToEditorFormat } from '../../shared/helperFunctions';
import { ourFetch } from '../../shared/helperFunctions';
import { browserHistory } from 'react-router';

const conf = require('../../shared/config')();

class AuthoringTool extends Component {
  constructor(props) {
    super(props);
    this.watcher = null;
    this.videoState = -1;
    this.currentClip = null;
    this.audioClipsCopy = {};
    this.videoDurationInSeconds = -1;

    this.state = {
      // Video main info.
      videoId: props.params.videoId,
      videoUrl: `${conf.apiUrl}/videos/${props.params.videoId}`,

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
      audioDescriptionStatus: null,
      audioDescriptionNotes: '',
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

      // Alert box parameters
      alertBoxBackgroundColor: '',
      alertBoxContent: '',
      alertBoxTitle: '',
      alertBoxText: '',
      alertBoxButtonColor: '',
    };

    // Bindings.
    this.getATState = this.getATState.bind(this);
    this.updateState = this.updateState.bind(this);
    this.publishAudioDescription = this.publishAudioDescription.bind(this);
    this.unpublishAudioDescription = this.unpublishAudioDescription.bind(this);
    this.updateTrackLabel = this.updateTrackLabel.bind(this);
    this.addAudioClipTrack = this.addAudioClipTrack.bind(this);
    this.recordAudioClip = this.recordAudioClip.bind(this);
    this.uploadAudioRecorded = this.uploadAudioRecorded.bind(this);
    this.setSelectedTrack = this.setSelectedTrack.bind(this);
    this.alertBoxOpen = this.alertBoxOpen.bind(this);
    this.alertBoxClose = this.alertBoxClose.bind(this);
    this.updateNotes = this.updateNotes.bind(this);
    this.deleteTrack = this.deleteTrack.bind(this);
  }

  componentWillMount() {
    // const isSignedIn = this.props.getAppState().isSignedIn;
    // if (isSignedIn === false) {
    //   alert('You have to be logged in to describe a video')
    //   browserHistory.goBack();
    // }
  }

  componentDidMount() {
    this.getYDVideoData();
    this.scrollingFix();
  }

  // 2
  getYDVideoData() {
    console.log('2 -> getYDVideoData');
    const self = this;
    ourFetch(this.state.videoUrl)
    .then(response => {
      if (response.result) {
        self.setState({
          videoData: response.result,
        }, () => {
          self.parseYDVideoData();
        });
      } else {
        self.parseYDVideoData();
      }
    })
    .catch(err => {
      self.parseYDVideoData();
    });
  }

  // 3
  parseYDVideoData() {
    console.log('3 -> parseYDVideoData');
    const videoData = Object.assign({}, this.state.videoData);

    let audioDescriptionId = null;
    let audioDescriptionStatus = null;
    let audioDescriptionNotes = '';
    const audioDescriptionAudioClips = {};

    if (videoData && videoData.audio_descriptions && videoData.audio_descriptions.length > 0) {
      // This looping won't be necessary when the API just delivery the owned AD for the current user.
      for (let i = 0; i < videoData.audio_descriptions.length; i += 1) {
        const ad = videoData.audio_descriptions[i];
        if (ad.user._id === this.props.getUserInfo().userId) {
          audioDescriptionId = ad['_id'];
          audioDescriptionStatus = ad['status'];
          audioDescriptionNotes = ad['notes'];
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
      audioDescriptionStatus,
      audioDescriptionAudioClips,
      audioDescriptionNotes,
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
        promises.push(ourFetch(audioObj.url, false));
      });
      Promise.all(promises).then(function() {
        console.log('Total audio clips:', audioClips.length, 'Audio clips loaded:', promises.length);
        self.getYTVideoInfo();
      })
      .catch(function(errorAllAudios) {
        console.log('ERROR LOADING AUDIOS -> ', errorAllAudios);
      });
    } else {
      self.getYTVideoInfo();
    }
  }

  // 5
  getYTVideoInfo() {
    const self = this;
    console.log('5 -> getYTVideoInfo');
    const url = `${conf.youTubeApiUrl}/videos?id=${this.state.videoId}&part=contentDetails,snippet&key=${conf.youTubeApiKey}`;
    ourFetch(url).then((data) => {
      this.videoDurationInSeconds = convertISO8601ToSeconds(data.items[0].contentDetails.duration);
      this.setState({
        videoTitle: data.items[0].snippet.title,
        videoDescription: data.items[0].snippet.description,
        videoDurationInSeconds: this.videoDurationInSeconds,
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
    console.log('6 -> loadExistingTracks');
    const tracksComponents = [];
    const audioClips = Object.values(this.state.audioDescriptionAudioClips);
    const audioClipsLength = audioClips.length;
    if (audioClipsLength > 0) {
      audioClips.forEach((audioClip, idx) => {
        tracksComponents.push(
          <Track
            key={idx}
            id={idx}
            data={audioClip}
            actionIconClass={'fa-step-forward'}
            getATState={this.getATState}
            recordAudioClip={this.recordAudioClip}
            updateTrackLabel={this.updateTrackLabel}
            setSelectedTrack={this.setSelectedTrack}
            deleteTrack={this.deleteTrack}
          />);
      });
    }
    const playheadTailHeight = audioClipsLength <= 7 ? audioClipsLength * 27 : 189;
    this.setState({
      tracksComponents,
      playheadTailHeight,
    }, () => {
      this.initVideoPlayer();
    });
  }

  // 7
  initVideoPlayer() {
    console.log('7 -> initVideoPlayer');
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
      self.videoProgressWatcher();
    }

    function onPlayerStateChange(event) {
      self.videoState = event.data;
      const audioClips = Object.values(self.state.audioDescriptionAudioClips);
      self.setState({ videoState: event.data }, () => {
        switch (event.data) {
          // ended
          case 0:
            // if (self.watcher) {
            //   clearInterval(self.watcher);
            //   self.watcher = null;
            // }
            break;
          // playing
          case 1:
            if (self.currentClip && self.currentClip.playbackType === 'extended') {
              self.currentClip.stop();
            }
            // self.videoProgressWatcher();
            break;
          // paused
          case 2:
            self.audioClipsCopy = audioClips.slice();
            if (self.currentClip && self.currentClip.playbackType === 'inline') {
              self.currentClip.pause();
            }
            // if (self.watcher) {
            //   clearInterval(self.watcher);
            //   self.watcher = null;
            // }
            break;
          // buffering
          case 3:
            self.audioClipsCopy = audioClips.slice();
            if (self.currentClip && self.currentClip.playbackType === 'inline') {
              self.currentClip.pause();
            }
            break;
          default:
            // if (self.watcher) {
            //   clearInterval(self.watcher);
            //   self.watcher = null;
            // }
        }
      });
    }

    function startVideo() {
      if (self.state.videoPlayer === null) {
        self.setState({
          videoPlayer: new YT.Player('playerAT', {
            height: '100%',
            videoId: self.state.videoId,
            playerVars: {
              // 'controls': 1,
              modestbranding: 1,
              fs: 0,
              rel: 0,
              disablekb: 0,
              cc_load_policy: 0,
              iv_load_policy: 3,
            },
            // enablejsapi: true,
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

    const interval = 90;

    if (this.watcher) {
      clearInterval(this.watcher);
      this.watcher = null;
    }

    this.watcher = setInterval(() => {
      const currentVideoProgress = this.state.videoPlayer.getCurrentTime();
      const videoVolume = this.state.videoPlayer.getVolume();
      const playheadPosition = 756 * (currentVideoProgress / this.videoDurationInSeconds);

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
              this.currentClip = new Howl({
                src: [this.audioClipsCopy[i].url],
                html5: false,
                onload: () => {
                  this.currentClip.playbackType = 'inline',
                  this.currentClip.seek(currentVideoProgress - +this.audioClipsCopy[i].start_time, this.currentClip.play());
                  this.audioClipsCopy = this.audioClipsCopy.slice(i + 1);
                },
                onloaderror: (errToLoad) => {
                  console.log('Impossible to load', errToLoad)
                },
                onplay: () => {
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
              this.currentClip = new Howl({
                src: [this.audioClipsCopy[i].url],
                html5: false,
                onload: () => {
                  this.currentClip.playbackType = 'extended';
                  this.audioClipsCopy = this.audioClipsCopy.slice(i + 1);
                  this.currentClip.play();
                },
                onloaderror: (errToLoad) => {
                  console.log('Impossible to load current audio', errToLoad)
                },
                onplay: () => {
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
    if (!this.props.getAppState().isSignedIn) {
      alert('You have to be logged in in order to describe this video');
      return;
    }

    // Current tracks components.
    const tracks = this.state.tracksComponents.slice();

    // I will just add tracks if all existant have urls.
    for (let i = 0; i < tracks.length; i += 1) {
      if (tracks[i].props.data.url === '') {
        // this.alertBoxOpen('unused-track');
        alert('Finish using your available record tracks.');
        return;
      }
    }

    // Don't allow adding more tracks while recording.
    if (this.state.selectedTrackComponentStatus === 'recording') {
      // this.alertBoxOpen('recording-in-process');
      alert('You can just add more tracks when you finish recording the existing one.');
      return;
    }

    const newTrackId = this.state.tracksComponents.length;

    const audioClip = {
      id: newTrackId,
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
        getATState={this.getATState}
        recordAudioClip={this.recordAudioClip}
        updateTrackLabel={this.updateTrackLabel}
        setSelectedTrack={this.setSelectedTrack}
        deleteTrack={this.deleteTrack}
      />,
    );

    const playheadTailHeight = this.state.playheadTailHeight < 189 ? this.state.playheadTailHeight + 27 : this.state.playheadTailHeight;

    this.setState({
      tracksComponents: tracks,
      selectedTrackComponentPlaybackType: playbackType,
      playheadTailHeight,
      selectedTrackComponentId: null,
      selectedTrackComponentStatus: null,
      selectedTrackComponentLabel: '',
      selectedTrackComponentUrl: '',
      selectedTrackComponentAudioClipStartTime: 0,
      selectedTrackComponentAudioClipSEndTime: -1,
      selectedTrackComponentAudioClipDuration: -1,
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

  deleteTrack(e, id, data) {
    // It is an existing recorder audio track.
    if (data._id) {
      const resConfirm = confirm('Are you sure you want to remove this track? This action cannot be undone!');
      if (resConfirm) {
        const url = `${conf.apiUrl}/audioclips/${data._id}`;
        ourFetch(url, true, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: this.props.getAppState().userId,
            userToken: this.props.getAppState().userToken,
          }),
        })
        .then((response) => {
          const videoData = response.result;
          const tc = this.state.tracksComponents.slice();
          const newTracks = tc.filter(t => t.props.id !== id);
          this.setState({
            videoData: videoData,
          }, () => {
            this.resetSelectedTrack();
            this.parseYDVideoData();
          });
        })
        .catch((err) => {
          this.setState({
            videoData: {},
          }, () => {
            this.resetSelectedTrack();
            this.parseYDVideoData();
          });
        });
      }
    } else {
      // We just need to remove from the UI.
      const tc = this.state.tracksComponents.slice();
      const newTracks = tc.filter(t => t.props.id !== id);
      this.setState({
        tracksComponents: newTracks,
      }, this.resetSelectedTrack());
    }
  }

  resetSelectedTrack() {
    this.setState({
      selectedTrackComponentId: null,
      selectedTrackComponentPlaybackType: null,
      selectedTrackComponentStatus: null,
      selectedTrackComponentAudioClipStartTime: 0,
      selectedTrackComponentAudioClipSEndTime: -1,
      selectedTrackComponentAudioClipDuration: -1,
      selectedTrackComponentLabel: '',
      selectedTrackComponentUrl: null,
    });
  }

  recordAudioClip(e, trackId) {
    if (!this.props.getAppState().isSignedIn) {
      alert('You need to be logged in in order to record audio clips');
      return;
    }

    if (this.state.selectedTrackComponentId !== trackId) {
      if (this.state.selectedTrackComponentStatus === 'recording') {
        // this.alertBoxOpen();
        alert('You need to stop recording in order to activate any other track');
        return;
      }
    }

    const clickedTrackComponent = this.getTrackComponentByTrackId(trackId);

    if (e.target.className === 'fa fa-circle') {
      // RECORD.
      console.log(this.state.currentVideoProgress);
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

      this.setState({
        currentTimeInVideo: seekToValue,
        playheadPosition: 740 * seekToValue / this.state.videoDurationInSeconds,
      });
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
            getATState={this.getATState}
            recordAudioClip={this.recordAudioClip}
            updateTrackLabel={this.updateTrackLabel}
            setSelectedTrack={this.setSelectedTrack}
            deleteTrack={this.deleteTrack}
          />
        );
      }
    }
    this.setState({ tracksComponents: tracks });
  }

  uploadAudioRecorded(args) {
    const self = this;
    const formData = new FormData();
    formData.append('wavfile', args.audioBlob);
    formData.append('userId', this.props.getAppState().userId);
    formData.append('userToken', this.props.getAppState().userToken);
    formData.append('title', this.state.videoTitle);
    formData.append('description', this.state.videoDescription);
    formData.append('notes', this.state.notes);
    formData.append('label', this.state.selectedTrackComponentLabel);
    formData.append('playbackType', this.state.selectedTrackComponentPlaybackType);
    formData.append('startTime', this.state.selectedTrackComponentAudioClipStartTime);
    formData.append('audioDescriptionId', this.state.audioDescriptionId);
    formData.append('audioDescriptionNotes', this.state.audioDescriptionNotes);
    if (this.state.selectedTrackComponentPlaybackType === 'extended') {
      formData.append('endTime', this.state.selectedTrackComponentAudioClipStartTime);
    } else {
      formData.append('endTime', this.state.selectedTrackComponentAudioClipStartTime + args.duration);
    }
    formData.append('duration', args.duration);
    const url = `${conf.apiUrl}/audioclips/${this.state.videoId}`;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = function () {
      // console.log(JSON.parse(this.responseText).result);
      self.setState({
        videoData: JSON.parse(this.responseText).result,
      }, () => {
        self.parseYDVideoData();
      });
    }
    xhr.send(formData);
  }

  alertBoxOpen(id) {
    console.log('alert box id', id);
    const alertBox = document.getElementById(id);

    // // set parameters for the alert box
    // this.setState({
    //   alertBoxBackgroundColor,
    //   alertBoxContent,
    //   alertBoxTitle,
    //   alertBoxText,
    //   alertBoxButtonColor,
    // });

    if (alertBox.style.display === 'none') {
      alertBox.style.display = 'block';
    }
  }

  alertBoxClose(e) {
    const alertBox = document.getElementById(e.target.parentNode.parentNode.parentNode.parentNode.parentNode.id);

    if (alertBox.style.display === 'block') {
      alertBox.style.display = 'none';
    }
  }

  publishAudioDescription() {
    const self = this;
    const resultConfirm = confirm('Are you sure you wanna publish this audio description?');
    if (resultConfirm) {
      const url = `${conf.apiUrl}/audiodescriptions/${this.state.audioDescriptionId}?action=publish`;
      ourFetch(url, true, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.props.getAppState().userId,
          userToken: this.props.getAppState().userToken,
        }),
      })
      .then(response => {
        const result = response.result;
        if (result._id) {
          self.setState({
            videoData: result,
          }, () => {
            self.parseYDVideoData();
          });
        } else {
          console.log('There was a problem to publish your audio description');
        }
      });
    }
  }

  unpublishAudioDescription() {
    const self = this;
    const resultConfirm = confirm('Are you sure you wanna unpublish this audio description?');
    if (resultConfirm) {
      const url = `${conf.apiUrl}/audiodescriptions/${this.state.audioDescriptionId}?action=unpublish`;
      ourFetch(url, true, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.props.getAppState().userId,
          userToken: this.props.getAppState().userToken,
        }),
      })
      .then(response => {
        const result = response.result;
        if (result._id) {
          self.setState({
            videoData: result,
          }, () => {
            self.parseYDVideoData();
          });
        } else {
          console.log('There was a problem to unpublish your audio description');
        }
      });
    }
  }

  getATState() {
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
  }

  updateTrackLabel(e) {
    this.setState({
      selectedTrackComponentLabel: e.target.value,
    });
  }

  updateNotes(e) {
    this.setState({
      audioDescriptionNotes: e.target.value,
    });
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
          <div id="notes-section" className="w3-left w3-card-2 w3-margin-top w3-hide-small w3-hide-medium">
            <Notes updateNotes={this.updateNotes} getATState={this.getATState} />
          </div>
        </div>
        <div className="w3-row w3-margin-top w3-hide-small w3-hide-medium">
          <div className="w3-col w3-margin-bottom">
            <Editor
              getATState={this.getATState}
              updateState={this.updateState}
              publishAudioDescription={this.publishAudioDescription}
              unpublishAudioDescription={this.unpublishAudioDescription}
              alertBoxClose={this.alertBoxClose}
              addAudioClipTrack={this.addAudioClipTrack}
              recordAudioClip={this.recordAudioClip}
              deleteTrack={this.deleteTrack}
              {...this.state}
            />
          </div>
        </div>
      </main>
    );
  }
}

export default AuthoringTool;
