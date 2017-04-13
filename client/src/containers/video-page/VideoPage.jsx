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
    this.currentClip = null;
    this.audioClipsCopy = {};
    this.previousVideoVolume = 0;

    this.state = {
      videoId: props.params.videoId,
      videoUrl: `${conf.apiUrl}/videos/${props.params.videoId}`,

      // Audio descriptions.
      audioDescriptionsIds: [],
      audioDescriptionsIdsUsers: {},
      audioDescriptionsIdsAudioClips: {},
      selectedAudioDescriptionId: null,

      currentClipVolume: 0.5,

      // Video controls and data.
      videoData: {},
      videoPlayer: null,
      videoState: -1,
      videoPlayerAccessibilitySeekbarValue: 0,
      videoVolume: 0,
      balancerValue: 50,
    };
    this.getState = this.getState.bind(this);
    this.updateState = this.updateState.bind(this);
    this.setAudioDescriptionActive = this.setAudioDescriptionActive.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.pauseVideo = this.pauseVideo.bind(this);
    this.closeSpinner = this.closeSpinner.bind(this);
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
    ourFetch(this.state.videoUrl)
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
        console.log(idx + 1, audioObj.url);
        promises.push(ourFetch(audioObj.url, false));
      });
      Promise.all(promises).then(function () {
        // console.log('All audios loaded.');
        self.initVideoPlayer();
      })
      .catch(function (errorAllAudios) {
        console.log('ERROR LOADING AUDIOS -> ', errorAllAudios);
      });
    } else {
      self.initVideoPlayer();
    }
  }

  // 6
  initVideoPlayer() {
    const self = this;
    console.log('6 -> initVideoPlayer', this.state.videoId);
    if (YT.loaded) {
      // If the video is playing, we need to change the state.
      if (this.state.videoPlayer) {
        const r = confirm("By changing the video describer, we have to restart the video. Are you sure you want to change?");
        if (r == true) {
          this.state.videoPlayer.stopVideo();
        }
      }
      startVideo();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        startVideo();
      };
    }

    function onVideoPlayerReady() {
      self.closeSpinner();
      self.audioClipsCopy = self.getAudioClips().slice();
      self.getVideoDuration();
    }

    function onPlayerStateChange(event) {
      self.videoState = event.data;
      self.setState({ videoState: event.data }, () => {
        switch (event.data) {
          case 0:
            // ended
            if (self.watcher) {
              clearInterval(self.watcher);
              self.watcher = null;
            }
            break;
          case 1:
            // playing
            self.playVideo();
            if (self.currentClip && self.currentClip.playbackType === 'extended') {
              self.currentClip.stop();
            }
            self.videoProgressWatcher();
            break;
          case 2:
            // paused
            self.pauseVideo();
            self.audioClipsCopy = self.getAudioClips().slice();
            if (self.currentClip && self.currentClip.playbackType === 'inline') {
              self.currentClip.pause();
            }
            if (self.watcher) {
              clearInterval(self.watcher);
              self.watcher = null;
            }
            break;
          case 3:
            // buffering
            self.audioClipsCopy = self.getAudioClips().slice();
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
  }

  // 7
  getVideoDuration() {
    console.log('7 -> getVideoDuration');
    const self = this;
    const url = `${conf.youTubeApiUrl}/videos?id=${this.state.videoId}&part=contentDetails,snippet&key=${conf.youTubeApiKey}`;
    ourFetch(url).then((data) => {
      this.videoDurationInSeconds = convertISO8601ToSeconds(data.items[0].contentDetails.duration);
      this.setState({
        videoTitle: data.items[0].snippet.title,
        videoDescription: data.items[0].snippet.description,
        videoDurationInSeconds: this.videoDurationInSeconds,
        videoDurationToDisplay: convertSecondsToEditorFormat(this.videoDurationInSeconds),
      });
    }).catch((err) => {
      console.log('Unable to load the video you are trying to edit.', err);
    });
  }

  // 8
  videoProgressWatcher() {
    console.log('8 -> videoProgressWatcher')
    const interval = 100;

    if (this.watcher) {
      clearInterval(this.watcher);
      this.watcher = null;
    }

    this.watcher = setInterval(() => {
      const currentVideoProgress = this.state.videoPlayer.getCurrentTime();

      this.setState({
        videoPlayerAccessibilitySeekbarValue: currentVideoProgress / this.state.videoDurationInSeconds,
      });

      if (this.currentClip && this.currentClip.playbackType === 'inline') {
        this.currentClip.volume(this.state.balancerValue / 100);
        this.state.videoPlayer.setVolume((100 - this.state.balancerValue) * 0.4);
      } else {
        this.state.videoPlayer.setVolume(100 - this.state.balancerValue);
      }

      for (let i = 0; i < this.audioClipsCopy.length; i += 1) {
        switch (this.audioClipsCopy[i].playback_type) {
          case 'inline':
            if (currentVideoProgress >= +this.audioClipsCopy[i].start_time &&
              currentVideoProgress < +this.audioClipsCopy[i].end_time) {
              this.currentClip = new Howl({
                src: [this.audioClipsCopy[i].url],
                html5: false,
                volume: this.state.balancerValue / 100,
                onload: () => {
                  this.currentClip.playbackType = 'inline';
                  const temp = +this.audioClipsCopy[i];
                  this.audioClipsCopy = this.audioClipsCopy.slice(i + 1);
                  this.currentClip.seek(currentVideoProgress - temp.start_time, this.currentClip.play());
                },
                onloaderror: (errToLoad) => {
                  console.log('Impossible to load', errToLoad);
                },
                onplay: () => {
                  console.log('INLINE PLAYING...');
                  // this.previousVideoVolume = videoVolume;
                },
                onend: () => {
                  this.currentClip = null;
                  // this.state.videoPlayer.setVolume(this.previousVideoVolume);
                },
              });
            }
            break;
          case 'extended':
            if (Math.abs(+this.audioClipsCopy[i].start_time - currentVideoProgress) <= interval / 2000 ||
            (+this.audioClipsCopy[i].start_time < 0.5 && currentVideoProgress <= interval / 500)) {
              this.currentClip = new Howl({
                src: [this.audioClipsCopy[i].url],
                html5: false,
                volume: this.state.balancerValue / 100,
                onload: () => {
                  this.currentClip.playbackType = 'extended';
                  this.audioClipsCopy = this.audioClipsCopy.slice(i + 1);
                  this.currentClip.play();
                },
                onloaderror: (errToLoad) => {
                  console.log('Impossible to load', errToLoad)
                },
                onplay: () => {
                  console.log('EXTENDED PLAYING...');
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
    clearInterval(this.watcher);
    this.watcher = null;
    if (this.currentClip && this.currentClip.stop) this.currentClip.stop();
    this.currentClip = null;
    // if (this.watcher) {
    // }
    // this.watcher = null;
  }

  getState() {
    return this.state;
  }

  updateState(newState, callback) {
    this.setState(newState, callback);
  }

  closeSpinner() {
    const spinner = document.getElementsByClassName('spinner')[0];
    spinner.style.display = 'none';
  }

  playVideo() {
    const play = document.getElementById('play-button');
    const pause = document.getElementById('pause-button');

    play.style.display = 'none';
    pause.style.display = 'block';
    this.state.videoPlayer.playVideo();

  }

  pauseVideo() {
    const play = document.getElementById('play-button');
    const pause = document.getElementById('pause-button');

    pause.style.display = 'none';
    play.style.display = 'block';
    this.state.videoPlayer.pauseVideo();
  }

  // playPauseToggle() {
  //   const play = document.getElementById('play-button');
  //   const pause = document.getElementById('pause-button');
  //   if (play.style.display === 'block') {
  //     play.style.display = 'none';
  //     pause.style.display = 'block';
  //   } else {
  //     pause.style.display = 'none';
  //     play.style.display = 'block';
  //   }
  // }

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
                <VideoPlayerAccessibleSeekbar updateState={this.updateState} {...this.state} />
                <div id="play-button" onClick={this.playVideo} accessKey="p"><i className="fa fa-play" aria-hidden="true"></i></div>
                <div id="pause-button" onClick={this.pauseVideo} accessKey="s"><i className="fa fa-pause" aria-hidden="true"></i></div>
                <VolumeBalancer updateState={this.updateState} />
                <AudioDescriptionSelector
                  updateState={this.updateState}
                  audioDescriptionsIdsUsers={this.state.audioDescriptionsIdsUsers}
                  selectedAudioDescriptionId={this.state.selectedAudioDescriptionId}
                  setAudioDescriptionActive={this.setAudioDescriptionActive}
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
