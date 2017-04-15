import React, { Component } from 'react';
import { Howl } from 'howler';
import Spinner from '../../components/spinner/Spinner.jsx';
import VolumeBalancer from '../../components/volume-balancer/VolumeBalancer.jsx';
import VideoPlayerAccessibleSeekbar from '../../components/video-player-accessible-seekbar/VideoPlayerAccessibleSeekbar.jsx';
import AudioDescriptionSelector from '../../components/audio-description-selector/AudioDescriptionSelector.jsx';
import { ourFetch } from '../../shared/helperFunctions';
import { convertISO8601ToSeconds, convertSecondsToEditorFormat } from '../../shared/helperFunctions';


const conf = require('../../shared/config')();

class VideoPage extends Component {
  constructor(props) {
    super(props);
    this.watcher = null;
    this.videoState = -1;
    this.previousVideoVolume = 0;
    this.audioClipsPlayed = {};

    this.state = {
      videoId: props.params.videoId,

      // Audio descriptions.
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
    this.playVideo = this.playVideo.bind(this);
    this.pauseVideo = this.pauseVideo.bind(this);
    this.closeSpinner = this.closeSpinner.bind(this);
    this.resetPlayedAudioClips = this.resetPlayedAudioClips.bind(this);
    this.changeAudioDescription = this.changeAudioDescription.bind(this);
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
        self.getVideoDuration();
      })
      .catch(function (errorAllAudios) {
        console.log('ERROR LOADING AUDIOS -> ', errorAllAudios);
      });
    } else {
      self.getVideoDuration();
    }
  }

  // 6
  getVideoDuration() {
    console.log('6 -> getVideoDuration');
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
      switch (event.data) {
        case 0: // ended
          self.stopProgressWatcher();
          break;
        case 1: // playing

          // Just changing the button display.
          self.changePlayPauseButtonToPaused();
          
          // Starting the watcher.
          self.startProgressWatcher();

          break;
        case 2: // paused
          
          // Pausing the watcher.
          self.stopProgressWatcher();
          
          // Just changing the button display.
          self.changePlayPauseButtonToPlay();
          
          break;
        case 3: // buffering
          break;
        case 5: // video cued
          
          // Starting the watcher.
          self.state.videoPlayer.playVideo();
          self.startProgressWatcher();
          break;
        default:
          // self.stopProgressWatcher();
      }
    }
  }

  // 10
  startProgressWatcher() {
    console.log('10 -> startProgressWatcher')
    const self = this;
    const audioClips = this.getAudioClips();
    const interval = 250;

    if (this.watcher) {
      this.stopProgressWatcher();
    }

    this.watcher = setInterval(() => {
      const currentVideoProgress = self.state.videoPlayer.getCurrentTime();
      // console.log(currentVideoProgress);

      this.setState({
        videoPlayerAccessibilitySeekbarValue: currentVideoProgress / this.state.videoDurationInSeconds,
      });

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
    
    if (!this.audioClipsPlayed.hasOwnProperty(audioClipId)) {
      this.audioClipsPlayed[audioClipId] = new Howl({
        src: [audioClip.url],
        html5: false,
        volume: self.state.balancerValue / 100,
        onplay: () => {
          if (playbackType === 'extended') {
            self.state.videoPlayer.pauseVideo();
          }
        },
        onend: () => {
          self.state.videoPlayer.playVideo();
        },
      });
      
      console.log('Let\'s play', playbackType, audioClip.start_time);

      // Audio ducking.
      if (playbackType === 'inline') {
        self.audioClipsPlayed[audioClipId].volume(self.state.balancerValue / 100);
        self.state.videoPlayer.setVolume((100 - self.state.balancerValue) * 0.4);
      } else {
        self.state.videoPlayer.setVolume(100 - self.state.balancerValue);
      }

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

  pauseAudioClips() {
    const audioClipsIds = Object.keys(this.audioClipsPlayed);
    audioClipsIds.forEach(id => {
      this.audioClipsPlayed[id].stop();
    });
  }

  changeAudioDescription(selectedAudioDescriptionId) {
    const r = confirm("By changing the video describer, we have to restart the video. Are you sure you want to change?");
    if (r == true) {
      this.state.videoPlayer.stopVideo();
      this.resetPlayedAudioClips();
      this.setState({
        selectedAudioDescriptionId: selectedAudioDescriptionId,
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

  changePlayPauseButtonToPaused() {
    const play = document.getElementById('play-button');
    const pause = document.getElementById('pause-button');
    play.style.display = 'none';
    pause.style.display = 'block';    
  }

  changePlayPauseButtonToPlay() {
    const play = document.getElementById('play-button');
    const pause = document.getElementById('pause-button');
    play.style.display = 'block';
    pause.style.display = 'none';
  }

  playVideo() {
    this.state.videoPlayer.playVideo();
  }

  pauseVideo() {
    this.pauseAudioClips();
    this.state.videoPlayer.pauseVideo();
  }

  // 1
  render() {
    // console.log('1 -> Render');
    return (
      <div id="video-player">
        <main role="application" title="Video player">
          <div className="">
            <div id="video" className="w3-card-2">
              <Spinner />
              <div id="playerVP" />
              <div id="video-controls">
                <VideoPlayerAccessibleSeekbar updateState={this.updateState} resetPlayedAudioClips={this.resetPlayedAudioClips} {...this.state} />
                <div id="play-button" onClick={this.playVideo} accessKey="p"><i className="fa fa-play" aria-hidden="true"></i></div>
                <div id="pause-button" onClick={this.pauseVideo} accessKey="s"><i className="fa fa-pause" aria-hidden="true"></i></div>
                <VolumeBalancer updateState={this.updateState} />
                <AudioDescriptionSelector
                  audioDescriptionsIdsUsers={this.state.audioDescriptionsIdsUsers}
                  selectedAudioDescriptionId={this.state.selectedAudioDescriptionId}
                  changeAudioDescription={this.changeAudioDescription}
                  videoId={this.state.videoId}
                  getAppState={this.props.getAppState}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default VideoPage;
