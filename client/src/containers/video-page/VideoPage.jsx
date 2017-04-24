import React, { Component } from 'react';
import { Howl } from 'howler';
import Spinner from '../../components/spinner/Spinner.jsx';
import VideoPlayerControls from '../../components/video-player-controls/VideoPlayerControls.jsx';
import { ourFetch } from '../../shared/helperFunctions';
import { convertISO8601ToSeconds, convertSecondsToEditorFormat } from '../../shared/helperFunctions';

const conf = require('../../shared/config')();

class VideoPage extends Component {
  constructor(props) {
    super(props);
    this.watcher = null;
    this.previousVideoVolume = 0;
    this.audioClipsPlayed = {};

    this.state = {
      videoId: props.params.videoId,

      // Audio descriptions.
      inlineClipsCurrentlyPlaying: [],
      audioDescriptionsIds: [],
      audioDescriptionsIdsUsers: {},
      audioDescriptionsIdsAudioClips: {},
      selectedAudioDescriptionId: null,

      // Video controls and data.
      videoData: {},
      videoPlayer: null,
      videoState: -1,
      videoPlayerAccessibilitySeekbarValue: 0,
      videoVolume: 0,
      balancerValue: 50,
    };
    this.updateState = this.updateState.bind(this);
    this.setAudioDescriptionActive = this.setAudioDescriptionActive.bind(this);
    this.closeSpinner = this.closeSpinner.bind(this);
    this.resetPlayedAudioClips = this.resetPlayedAudioClips.bind(this);
    this.changeAudioDescription = this.changeAudioDescription.bind(this);
    this.pauseAudioClips = this.pauseAudioClips.bind(this);
  }

  componentDidMount() {
    this.fetchVideoData();
  }

  getAudioClips() {
    if (this.state.audioDescriptionsIdsAudioClips && this.state.selectedAudioDescriptionId) {
      return this.state.audioDescriptionsIdsAudioClips[this.state.selectedAudioDescriptionId];
    }
    return [];
  }

  // 2
  fetchVideoData() {
    console.log('2 -> fetchingVideoData');
    const self = this;
    const url = `${conf.apiUrl}/videos/${this.props.params.videoId}`;
    ourFetch(url)
    .then((response) => {
      if (response.result) {
        self.setState({
          videoData: response.result,
        }, () => {
          self.parseVideoData();
        });
      } else {
        self.parseVideoData();
      }
    })
    .catch(err => {
      console.log(err)
      self.parseVideoData();
    });
  }

  // 3
  parseVideoData() {
    console.log('3 -> parseVideoData');
    const videoData = Object.assign({}, this.state.videoData);
    const audioDescriptionsIds = [];
    const audioDescriptionsIdsUsers = {};
    const audioDescriptionsIdsAudioClips = {};
    if (videoData && videoData.audio_descriptions && videoData.audio_descriptions.length > 0) {
      videoData.audio_descriptions.forEach((ad) => {
        if (ad.status === 'published') {
          audioDescriptionsIds.push(ad['_id']);
          audioDescriptionsIdsUsers[ad['_id']] = ad['user'];
          audioDescriptionsIdsAudioClips[ad['_id']] = [];
          if (ad.audio_clips.length > 0) {
            ad.audio_clips.forEach((audioClip) => {
              audioClip.url = `${conf.audioClipsUploadsPath}${audioClip.file_path}/${audioClip.file_name}`;
              audioDescriptionsIdsAudioClips[ad['_id']].push(audioClip);
            });
          }
        }
      });
    }
    this.setState({
      videoData,
      audioDescriptionsIds,
      audioDescriptionsIdsUsers,
      audioDescriptionsIdsAudioClips,
    }, () => {
      this.setAudioDescriptionActive();
    });
  }

  // 4.
  setAudioDescriptionActive() {
    console.log('4 -> setAudioDescriptionActive');
    let selectedAudioDescriptionId = null;
    if (this.state.selectedAudioDescriptionId !== null) {
      selectedAudioDescriptionId = this.state.selectedAudioDescriptionId;
    } else {
      selectedAudioDescriptionId = this.state.audioDescriptionsIds[0];
    }
    this.setState({
      selectedAudioDescriptionId,
    }, () => {
      this.preLoadAudioClips();
    });
  }

  // 5
  preLoadAudioClips() {
    console.log('5 -> preLoadAudioClips');
    const self = this;
    const audioClips = this.getAudioClips();
    if (audioClips.length > 0) {
      const promises = [];
      audioClips.forEach((audioObj, idx) => {
        console.log(audioObj.url, audioObj.start_time, audioObj.end_time, audioObj.duration, audioObj.playback_type);
        promises.push(ourFetch(audioObj.url, false));
      });
      Promise.all(promises).then(function () {
        self.getYTVideoInfo();
      })
      .catch(function (errorAllAudios) {
        console.log('ERROR LOADING AUDIOS -> ', errorAllAudios);
      });
    } else {
      self.getYTVideoInfo();
    }
  }

  // 6
  getYTVideoInfo() {
    console.log('6 -> getYTVideoInfo');
    const self = this;
    const url = `${conf.youTubeApiUrl}/videos?id=${this.state.videoId}&part=contentDetails,snippet&key=${conf.youTubeApiKey}`;
    ourFetch(url).then((data) => {
      this.videoDurationInSeconds = convertISO8601ToSeconds(data.items[0].contentDetails.duration);
      this.setState({
        videoTitle: data.items[0].snippet.title,
        videoDescription: data.items[0].snippet.description,
        videoDurationInSeconds: this.videoDurationInSeconds,
        videoDurationToDisplay: convertSecondsToEditorFormat(this.videoDurationInSeconds),
      }, () => {
        self.initVideoPlayer();
      });
    }).catch((err) => {
      console.log('Unable to load the video you are trying to edit.', err);
    });
  }

  // 7
  initVideoPlayer() {
    const self = this;
    console.log('7 -> initVideoPlayer');
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
          videoPlayer: new YT.Player('playerVP', {
            width: '100%',
            videoId: self.state.videoId,
            playerVars: {
              rel: 0,
              controls: 0,
              disablekb: 1,
              autoplay: true,
            },
            events: {
              onReady: onVideoPlayerReady,
              onStateChange: onPlayerStateChange,
            },
          }),
        });
      }
    }

    function onVideoPlayerReady() {
      console.log('9 -> onVideoPlayerReady');
      self.closeSpinner();
    }

    function onPlayerStateChange(event) {
      self.setState({ videoState: event.data }, () => {
        switch (event.data) {
          case 0: // ended
            // stops the watcher
            self.stopProgressWatcher();

            break;
          case 1: // playing
            // starts the watcher
            self.startProgressWatcher();

            break;
          case 2: // paused
            // stops all inline clip instances
            for (const clip in self.audioClipsPlayed) {
              if (self.audioClipsPlayed[clip].playbackType === 'inline') {
                self.audioClipsPlayed[clip].stop();
              }
            }

            // clears out the inline clips array so audio no longer ducked
            self.setState({ inlineClipsCurrentlyPlaying: [] });

            // stops the watcher
            self.stopProgressWatcher();

            break;
          case 3: // buffering
            break;
          case 5: // video cued
            self.state.videoPlayer.playVideo();
            self.startProgressWatcher();
            break;
          default:
            self.stopProgressWatcher();
        }
      });
    }
  }

  // 10
  startProgressWatcher() {
    console.log('10 -> startProgressWatcher');
    const self = this;
    const audioClips = this.getAudioClips();
    const interval = 250;

    if (this.watcher) {
      this.stopProgressWatcher();
    }

    this.watcher = setInterval(() => {
      const currentVideoProgress = self.state.videoPlayer.getCurrentTime();

      console.log(self.state.videoPlayer.getVolume());
      // audio ducking
      self.state.inlineClipsCurrentlyPlaying.length ?
        self.state.videoPlayer.setVolume((100 - self.state.balancerValue) * 0.4) :
        self.state.videoPlayer.setVolume(100 - self.state.balancerValue);

      for (const clip in this.audioClipsPlayed) {
        this.audioClipsPlayed[clip].volume(self.state.balancerValue / 100);
      }

      this.setState({
        videoPlayerAccessibilitySeekbarValue: currentVideoProgress / this.state.videoDurationInSeconds,
      });

      const currentVideoProgressFloor = Math.floor(currentVideoProgress);

      for (let i = 0; i < audioClips.length; i += 1) {
        const audioClip = audioClips[i];

        // We will always try to play the clip. The playAudioClip is in charge of control!
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

    if (!this.audioClipsPlayed.hasOwnProperty(audioClipId)) {
      this.audioClipsPlayed[audioClipId] = new Howl({
        src: [audioClip.url],
        html5: false,
        volume: self.state.balancerValue / 100,
        onplay: () => {
          if (playbackType === 'extended') {
            self.state.videoPlayer.pauseVideo();
          }
          if (playbackType === 'inline') {
            const inlineClipsCurrentlyPlaying = self.state.inlineClipsCurrentlyPlaying;

            inlineClipsCurrentlyPlaying.push(audioClipId);
            self.setState({ inlineClipsCurrentlyPlaying });
          }
        },
        onend: () => {
          if (playbackType === 'extended') {
            self.state.videoPlayer.playVideo();
          }
          if (playbackType === 'inline') {
            const inlineClipsCurrentlyPlaying = self.state.inlineClipsCurrentlyPlaying;

            inlineClipsCurrentlyPlaying.pop();
            if (!inlineClipsCurrentlyPlaying.length) {
              self.state.videoPlayer.setVolume(100 - self.state.balancerValue);
            }
            self.setState({ inlineClipsCurrentlyPlaying });
          }
        },
      });

      console.log('Let\'s play', playbackType, audioClip.start_time);
      this.audioClipsPlayed[audioClipId].playbackType = playbackType;
      this.audioClipsPlayed[audioClipId].play();
      console.log(this.audioClipsPlayed[audioClipId].seek());
    }
  }

  resetPlayedAudioClips() {
    const audioClipsIds = Object.keys(this.audioClipsPlayed);
    audioClipsIds.forEach(id => {
      this.audioClipsPlayed[id].stop();
    });
    this.audioClipsPlayed = {};
  }

  pauseAudioClips() {
    const audioClipsObjs = Object.values(this.audioClipsPlayed);
    audioClipsObjs.forEach(howler => {
      howler.stop();
    });
  }

  changeAudioDescription(selectedAudioDescriptionId) {
    const r = confirm("By changing the video describer, we have to restart the video. Are you sure you want to change?");
    if (r == true) {
      this.state.videoPlayer.stopVideo();
      this.resetPlayedAudioClips();
      this.setState({
        selectedAudioDescriptionId,
      }, () => {
        this.setAudioDescriptionActive();
      });
    }
  }

  componentWillUnmount() {
    this.state.videoPlayer.stopVideo();
    this.resetPlayedAudioClips();
    this.stopProgressWatcher();
  }

  updateState(newState, callback) {
    this.setState(newState, callback);
  }

  closeSpinner() {
    const spinner = document.getElementsByClassName('spinner')[0];
    spinner.style.display = 'none';
  }

  // 1
  render() {
    // console.log('1 -> Render');
    return (
      <div id="video-player">
        <main role="main" title="Video player">
          <section>
            <div id="video" className="w3-card-2">
              <Spinner />
              <div id="playerVP" />
              <VideoPlayerControls
                getAppState={this.props.getAppState}
                updateState={this.updateState}
                changeAudioDescription={this.changeAudioDescription}
                resetPlayedAudioClips={this.resetPlayedAudioClips}
                audioDescriptionsIdsUsers={this.state.audioDescriptionsIdsUsers}
                selectedAudioDescriptionId={this.state.selectedAudioDescriptionId}
                videoId={this.state.videoId}
                pauseAudioClips={this.pauseAudioClips}
                {...this.state}
              />
            </div>
          </section>
        </main>
      </div>
    );
  }
}

export default VideoPage;
