import React, { Component } from 'react';
import { Howl } from 'howler';
import SpinnerGlobal from '../../components/spinner-global/SpinnerGlobal.jsx';
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
    this.videoDurationInSeconds = -1;
    this.audioClipsPlayed = {};

    this.state = {
      // Video main info.
      videoId: props.params.videoId,

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

      audioClipsPlayed: '',
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
    this.updateNotes = this.updateNotes.bind(this);
    this.deleteTrack = this.deleteTrack.bind(this);
    this.deleteAudioDescription = this.deleteAudioDescription.bind(this);
    this.switchTrackType = this.switchTrackType.bind(this);
    this.saveLabelsAndNotes = this.saveLabelsAndNotes.bind(this);
    this.preLoadAudioClips = this.preLoadAudioClips.bind(this);
    this.getYTVideoInfo = this.getYTVideoInfo.bind(this);
    this.nudgeTrackLeft = this.nudgeTrackLeft.bind(this);
    this.nudgeTrackRight = this.nudgeTrackRight.bind(this);
  }

  componentDidMount() {
    this.refs.spinner.on();
    document.title = this.props.translate('YouDescribe - Authoring Tool');
    // if (!this.props.getAppState().isSignedIn) {
    //   location.href = '/';
    // }
    this.getYDVideoData();
  }

  // 2
  getYDVideoData() {
    console.log('2 -> getYDVideoData');
    const self = this;
    const url = `${conf.apiUrl}/videos/${this.props.params.videoId}`;
    ourFetch(url)
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
          if (ad.audio_clips && ad.audio_clips.length > 0) {
            ad.audio_clips.forEach((audioClip) => {
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
      this.preLoadAudioClips(this.getYTVideoInfo);
    });
  }

  // 4
  preLoadAudioClips(callback) {
    console.log('4 -> preLoadAudioClips');
    const self = this;
    const audioClips = Object.values(this.state.audioDescriptionAudioClips);

    if (audioClips.length > 0) {
      const promises = [];
      audioClips.forEach((audioObj, idx) => {
        const url = self.getAudioClipUrl(audioObj);
        console.log(url, audioObj.start_time, audioObj.end_time, audioObj.duration, audioObj.playback_type);
        promises.push(ourFetch(url, false));
      });
      Promise.all(promises).then(function() {
        console.log('Total audio clips:', audioClips.length, 'Audio clips loaded:', promises.length);
        callback();
      })
      .catch(function(errorAllAudios) {
        console.log('ERROR LOADING AUDIOS -> ', errorAllAudios);
      });
    } else {
      callback();
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
            nudgeTrackLeft={this.nudgeTrackLeft}
            nudgeTrackRight={this.nudgeTrackRight}
            switchTrackType={this.switchTrackType}
          />);
      });
    }
    const playheadTailHeight = audioClipsLength <= 4 ? (audioClipsLength * 54) - 1 : 189;
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

    function startVideo() {
      console.log('8 -> startVideo');
      if (self.state.videoPlayer === null) {
        self.setState({
          videoPlayer: new YT.Player('playerAT', {
            height: '100%',
            videoId: self.state.videoId,
            playerVars: {
              modestbranding: 1,
              fs: 0,
              rel: 0,
              disablekb: 0,
              cc_load_policy: 0,
              iv_load_policy: 3,
            },
            events: {
              onReady: onVideoPlayerReady,
              onStateChange: onPlayerStateChange,
            },
          }),
        }, () => {
          self.refs.spinner.off();
        });
      } else {
        self.refs.spinner.off();
      }
    }

    function onVideoPlayerReady() {
      console.log('9 -> onVideoPlayerReady');
      initAudioRecorder();
    }

    function onPlayerStateChange(event) {
      console.log('playerStateChange', event.data)
      self.setState({ videoState: event.data }, () => {
        switch (event.data) {
          case -1: // unstarted
            // self.stopProgressWatcher();
            break;
          case 0: // ended
            // self.stopProgressWatcher();
            self.resetPlayedAudioClips();
            break;
          case 1: // playing
            // self.pauseAudioClips();
            self.startProgressWatcher();
            break;
          case 2: // paused
            self.pauseAudioClips('inline');
            // self.stopProgressWatcher();
            break;
          case 3: // buffering
            // buffering
            self.resetPlayedAudioClips();
            // self.stopProgressWatcher();
            break;
          case 5: // video cued
            // Starting the watcher.
            self.state.videoPlayer.playVideo();
            // self.startProgressWatcher();
            break;
          default:
        }
      });
    }
  }

  getAudioClipUrl(audioClip) {
    return `${conf.audioClipsUploadsPath}${audioClip.file_path}/${audioClip.file_name}`;
  }

  // 10
  startProgressWatcher() {
    console.log('10 -> startProgressWatcher');
    const self = this;
    const audioClips = Object.values(this.state.audioDescriptionAudioClips);
    const interval = 100;

    if (this.watcher) {
      this.stopProgressWatcher();
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

      // if (this.currentClip && this.currentClip.playbackType === 'inline') {
      //   console.log(this.state.videoPlayer.getVolume());
      //   this.state.videoPlayer.setVolume(40);
      // } else {
      //   this.state.videoPlayer.setVolume(100);
      // }

      const currentVideoProgressFloor = Math.floor(currentVideoProgress);
      for (let i = 0; i < audioClips.length; i += 1) {
        const audioClip = audioClips[i];
        if (Math.floor(audioClip.start_time) === currentVideoProgressFloor) {
          self.playAudioClip(audioClip);
        }
      }
    }, interval);
  }

  stopProgressWatcher() {
    console.log('stopProgressWatcher');
    if (this.watcher) {
      clearInterval(this.watcher);
      this.watcher = null;
    }
  }

  playAudioClip(audioClip) {
    const self = this;
    const audioClipId = audioClip._id;
    const playbackType = audioClip.playback_type;
    const url = this.getAudioClipUrl(audioClip);
    if (!this.audioClipsPlayed.hasOwnProperty(audioClipId)) {
      this.audioClipsPlayed[audioClipId] = new Howl({
        src: [url],
        html5: false,
        onplay: () => {
          if (playbackType === 'extended') {
            // self.stopProgressWatcher();
            self.state.videoPlayer.pauseVideo();
          }
        },
        onend: () => {
          self.state.videoPlayer.playVideo();
          self.startProgressWatcher();
        },
      });

      // Audio ducking.
      // if (playbackType === 'inline') {
      //   self.audioClipsPlayed[audioClipId].volume(self.state.balancerValue / 100);
      //   self.state.videoPlayer.setVolume((100 - self.state.balancerValue) * 0.4);
      // } else {
      //   self.state.videoPlayer.setVolume(100 - self.state.balancerValue);
      // }

      this.audioClipsPlayed[audioClipId].play();
    }
  }

  resetPlayedAudioClips() {
    const audioClipsIds = Object.keys(this.audioClipsPlayed);
    audioClipsIds.forEach(id => {
      this.audioClipsPlayed[id].stop();
    });
    this.audioClipsPlayed = {};
  }

  pauseAudioClips(playbackType = '') {
    const self = this;

    // Howler objects.
    const audioClipsIdsPlayed = Object.keys(this.audioClipsPlayed);

    // Simple objects.
    const audioClips = Object.values(this.state.audioDescriptionAudioClips);

    for (let i = 0; i < audioClips.length; i++) {
      const audioClip = audioClips[i];

      // As we don't have any howler object, we should skip.
      if (!self.audioClipsPlayed[audioClip._id]) {
        continue;
      }

      if (playbackType === '') {
        this.audioClipsPlayed[audioClip._id].stop();
        continue;
      }

      if (audioClip.playback_type === playbackType) {
        this.audioClipsPlayed[audioClip._id].stop();
      }
    }
  }

  componentWillUnmount() {
    this.state.videoPlayer.stopVideo();
    this.resetPlayedAudioClips();
    this.stopProgressWatcher();
  }

  addAudioClipTrack(playbackType) {
    if (!this.props.getAppState().isSignedIn) {
      alert(this.props.translate('You have to be logged in in order to describe this video'));
      return;
    }

    // Current tracks components.
    const tracks = this.state.tracksComponents.slice();

    // I will just add tracks if all existant have urls.
    for (let i = 0; i < tracks.length; i += 1) {
      if (tracks[i].props.data.url === '') {
        // this.alertBoxOpen('unused-track');
        alert(this.props.translate('Finish using your available record tracks'));
        return;
      }
    }

    // Don't allow adding more tracks while recording.
    if (this.state.selectedTrackComponentStatus === 'recording') {
      // this.alertBoxOpen('recording-in-process');
      alert(this.props.translate('You can just add more tracks when you finish recording the existing one'));
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
        switchTrackType={this.switchTrackType}
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
      const resConfirm = confirm(this.props.translate('Are you sure you want to remove this track? This action cannot be undone!'));
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

  nudgeTrackLeft(e, id, data) {
    this.refs.spinner.on();
    const nudgeIncrementDecrementValue = conf.nudgeIncrementDecrementValue;

    // Trying to decrease from 0;
    if (data.start_time === 0) {
      alert(this.props.translate('Impossible to descrease the start time. It is already 0'));
      this.refs.spinner.off();
      return;
    }

    // Impossible to nudge to less than 0 so we decide to make it zero.
    if (data.start_time - nudgeIncrementDecrementValue < 0) {
      data.start_time = 0;
    } else {
      // Fix for 0.3 + 0.15 floating point issue.
      data.start_time = ((data.start_time * 1000) - (nudgeIncrementDecrementValue * 1000)) / 1000;
    }

    ourFetch(`${conf.apiUrl}/audioclips/${data._id}`, true, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: this.props.getAppState().userId,
        userToken: this.props.getAppState().userToken,
        playback_type: data.playback_type,
        start_time: data.start_time,
        end_time: data.end_time,
        duration: data.duration,
      }),
    })
    .then((response) => {
      this.refs.spinner.off();
      const saved = response.result;
      const tcs = this.state.tracksComponents.slice();
      const acs = Object.assign({}, this.state.audioDescriptionAudioClips);
      acs[saved._id] = saved;
      this.setState({ audioDescriptionAudioClips: acs }, () => {
        this.resetPlayedAudioClips();
        this.loadExistingTracks();
      });
    })
    .catch((err) => {
      console.log('Error nudge left');
    });
  }

  nudgeTrackRight(e, id, data) {
    this.refs.spinner.on();
    const nudgeIncrementDecrementValue = conf.nudgeIncrementDecrementValue;

    // Trying to increase beyond video duration.
    if (data.start_time + nudgeIncrementDecrementValue > this.videoDurationInSeconds - data.duration) {
      alert(this.props.translate('Impossible to increase the start time more'));
      this.refs.spinner.off();
      return;
    }

    data.start_time = ((data.start_time * 1000) + (nudgeIncrementDecrementValue * 1000)) / 1000;

    const url = `${conf.apiUrl}/audioclips/${data._id}`;

    ourFetch(url, true, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: this.props.getAppState().userId,
        userToken: this.props.getAppState().userToken,
        playback_type: data.playback_type,
        start_time: data.start_time,
        end_time: data.end_time,
        duration: data.duration,
      }),
    })
    .then((response) => {
      this.refs.spinner.off();
      const saved = response.result;
      const tcs = this.state.tracksComponents.slice();
      const acs = Object.assign({}, this.state.audioDescriptionAudioClips);
      acs[saved._id] = saved;
      this.setState({ audioDescriptionAudioClips: acs }, () => {
        this.resetPlayedAudioClips();
        this.loadExistingTracks();
      });
    })
    .catch((err) => {
      console.log('Error nudge right');
    });
  }

  switchTrackType(e, id, data) {
    this.refs.spinner.on();
    let resConfirm;
    let playback_type;
    if (data.playback_type === 'extended') {
      resConfirm = confirm(this.props.translate('Are you sure you want to change from EXTENDED to INLINE?'));
      playback_type = 'inline';
    } else {
      resConfirm = confirm(this.props.translate('Are you sure you want to change from INLINE to EXTENDED?'));
      playback_type = 'extended';
    }
    if (resConfirm) {
      const url = `${conf.apiUrl}/audioclips/${data._id}`;
      ourFetch(url, true, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.props.getAppState().userId,
          userToken: this.props.getAppState().userToken,
          playback_type,
          start_time: data.start_time,
          end_time: data.end_time,
          duration: data.duration,
        }),
      })
      .then(response => {
        this.refs.spinner.off();
        const saved = response.result;
        const tcs = this.state.tracksComponents.slice();
        const acs = Object.assign({}, this.state.audioDescriptionAudioClips);
        acs[saved._id] = saved;
        this.setState({ audioDescriptionAudioClips: acs }, () => {
          this.resetPlayedAudioClips();
          this.loadExistingTracks();
        });
      });
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
    const self = this;
    if (!this.props.getAppState().isSignedIn) {
      alert(this.props.translate('You need to be logged in in order to record audio clips'));
      return;
    }

    if (this.state.selectedTrackComponentId !== trackId) {
      if (this.state.selectedTrackComponentStatus === 'recording') {
        alert(this.props.translate('You need to stop recording in order to activate any other track'));
        return;
      }
    }

    const clickedTrackComponent = this.getTrackComponentByTrackId(trackId);

    if (e.target.className === 'fa fa-circle') {
      // RECORD.
      // if (this.state.selectedTrackComponentPlaybackType === 'inline' && this.state.videoState !== 1) {
      //   alert('Not ready to record an inline track because the video is not playing yet');
      //   return;
      // }
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
        self.refs.spinner.on();
        stopRecordingAndSave(this.uploadAudioRecorded);
      });
    } else if (e.target.className === 'fa fa-step-forward') {
      // SEEK TO.

      const seekToValue = clickedTrackComponent.props.data.start_time;
      const seekToValueWithCorrection = parseFloat(seekToValue) - conf.seekToPositionDelayFix;


      this.setState({
        currentVideoProgress: seekToValueWithCorrection,
        currentTimeInVideo: seekToValueWithCorrection,
        playheadPosition: 756 * seekToValue / this.videoDurationInSeconds,
      }, () => {
        this.state.videoPlayer.seekTo(seekToValueWithCorrection, true);
        this.state.videoPlayer.unMute();
        this.state.videoPlayer.pauseVideo();
        this.pauseAudioClips();
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
            switchTrackType={this.switchTrackType}
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
      self.setState({
        videoData: JSON.parse(this.responseText).result,
      }, () => {
        self.parseYDVideoData();
        self.refs.spinner.off();
      });
    }
    xhr.send(formData);
  }

  publishAudioDescription() {
    const self = this;
    const resultConfirm = confirm(this.props.translate('Are you sure you wanna publish this audio description?'));
    if (resultConfirm) {
      const url = `${conf.apiUrl}/audiodescriptions/${this.state.audioDescriptionId}?action=publish`;
      ourFetch(url, true, {
        method: 'PUT',
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
    const resultConfirm = confirm(this.props.translate('Are you sure you wanna unpublish this audio description?'));
    if (resultConfirm) {
      const url = `${conf.apiUrl}/audiodescriptions/${this.state.audioDescriptionId}?action=unpublish`;
      ourFetch(url, true, {
        method: 'PUT',
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

  setSelectedTrack(e, trackId) {
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
    const audioClipId = e.target.dataset['id'];
    const label = e.target.value;
    const audioClipsUpdated = Object.assign({}, this.state.audioDescriptionAudioClips);
    if (audioClipId) {
      audioClipsUpdated[audioClipId].label = label;
      this.setState({
        selectedTrackComponentLabel: label,
        audioDescriptionAudioClips: audioClipsUpdated,
      }, () => {
        this.loadExistingTracks();
      });
    } else {
      this.setState({
        selectedTrackComponentLabel: label,
      });
    }
  }

  updateNotes(e) {
    this.setState({
      audioDescriptionNotes: e.target.value,
    });
  }

  saveLabelsAndNotes() {
    this.refs.spinner.on();
    let url = `${conf.apiUrl}/audiodescriptions`;
    let method = 'PUT';

    // We already have an audio description.
    if (this.state.audioDescriptionId) {
      url += `/${this.state.audioDescriptionId}`;

      // Update labels at each audio clip.
      const audioClips = this.state.audioDescriptionAudioClips;
      Object.keys(audioClips).forEach((acId) => {
        const ac = this.state.audioDescriptionAudioClips[acId];
        ourFetch(`${conf.apiUrl}/audioclips/${acId}`, true, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: this.props.getAppState().userId,
            userToken: this.props.getAppState().userToken,
            label: ac.label,
          }),
        })
        .then(response => {
          this.refs.spinner.off();
        });
      });
    } else {
      // We still don't have a AD.
      url += `/${this.state.videoId}`;
      method = 'POST';
    }

    // Update audio description.
    ourFetch(url, true, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: this.state.videoTitle,
        description: this.state.videoDescription,
        userId: this.props.getAppState().userId,
        userToken: this.props.getAppState().userToken,
        notes: this.state.audioDescriptionNotes,
      }),
    })
    .then(response => {
      this.getYDVideoData();
    });
  }

  deleteAudioDescription() {
    const resConfirm = confirm(this.props.translate('Are you sure you want to delete the audio description? This will remove all recorder tracks and cannot be undone'));
    if (resConfirm) {
      this.refs.spinner.on();
      ourFetch(`${conf.apiUrl}/audiodescriptions/${this.state.audioDescriptionId}`, true, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.props.getAppState().userId,
          userToken: this.props.getAppState().userToken,
        }),
      })
      .then(response => {
        console.log('Deleted', response);
        this.refs.spinner.off();
        browserHistory.push(`/videos/user/${this.props.getAppState().userId}`);
      });
    }
  }

  // 1
  render() {
    // console.log('1 -> render authoring tool')
    return (
      <div id="authoring-tool">
        <SpinnerGlobal ref="spinner" />
        <main role="main">
          <div className="w3-row">
            <div className="w3-hide-large">{this.props.translate('Authoring is not available on this screen size. Please use a larger screen to add a description')}</div>
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
                translate={this.props.translate}
                getATState={this.getATState}
                updateState={this.updateState}
                publishAudioDescription={this.publishAudioDescription}
                unpublishAudioDescription={this.unpublishAudioDescription}
                alertBoxClose={this.alertBoxClose}
                addAudioClipTrack={this.addAudioClipTrack}
                recordAudioClip={this.recordAudioClip}
                deleteTrack={this.deleteTrack}
                deleteAudioDescription={this.deleteAudioDescription}
                saveLabelsAndNotes={this.saveLabelsAndNotes}
                {...this.state}
              />
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default AuthoringTool;
