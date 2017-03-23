import React, { Component } from 'react';
import { Howl } from 'howler';
import Slider from '../../components/slider/Slider.jsx';
import AudioDescriptionSelector from '../../components/audio-description-selector/AudioDescriptionSelector.jsx';
import DescriberChooser from '../../components/describer-chooser/DescriberChooser.jsx';
import { ourFetch } from '../../shared/helperFunctions';

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
      videoVolume: 0,
      sliderValue: 50,
    };
    this.getState = this.getState.bind(this);
    this.updateState = this.updateState.bind(this);
    this.setAudioDescriptionActive = this.setAudioDescriptionActive.bind(this);
    // this.sliderIsReady = this.sliderIsReady.bind(this);
  }

  componentDidMount() {
    this.fetchVideoData();
  }

  getAudioClips() {
    if (this.state.audioDescriptionsIdsAudioClips && this.state.selectedAudioDescriptionId) {
      return this.state.audioDescriptionsIdsAudioClips[this.state.selectedAudioDescriptionId];
    } else {
      return [];
    }
  }

  // 2 Keep this for safari bug detecting
  // fetchVideoData() {
  //   console.log('2 -> fetchingVideoData');
  //   const self = this;
  //   const xhr = new XMLHttpRequest();
  //   xhr.open('GET', this.state.videoUrl, true);
  //   xhr.onload = function () {
  //     if (xhr.readyState === 4) {
  //       const response = JSON.parse(xhr.response);
  //       const result = response.result
  //         ? response.result
  //         : {};
  //       self.setState({
  //         videoData: result,
  //       }, () => {
  //         self.parseVideoData();
  //       });
  //     }
  //   };
  //   xhr.send();
  // }

  //2 relaced fetchVideoData with the new Fetch
  fetchVideoData() {
    console.log('2 -> fetchingVideoData');
    const self = this;
    ourFetch(this.state.videoUrl)
    .then((response) => {
        const result = response.result
          ? response.result
          : {};
        self.setState({
          videoData: result,
        }, () => {
          console.log(self.state.videoData);
          self.parseVideoData();
        });
    })
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
        audioDescriptionsIds.push(ad['_id']);
        audioDescriptionsIdsUsers[ad['_id']] = ad['user'];
        audioDescriptionsIdsAudioClips[ad['_id']] = [];
        if (ad.audio_clips.length > 0) {
          ad.audio_clips.forEach((audioClip) => {
            audioClip.url = `${conf.audioClipsUploadsPath}${audioClip.file_path}/${audioClip.file_name}`;
            audioDescriptionsIdsAudioClips[ad['_id']].push(audioClip);
          });
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
      console.log('Selected audio description ID', selectedAudioDescriptionId);
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
      Promise.all(promises).then(function() {
        console.log('All audios loaded.');
        self.initVideoPlayer();
      })
      .catch(function(errorAllAudios) {
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
      self.audioClipsCopy = self.getAudioClips().slice();
      // console.log('slider ready', self.sliderIsReady());
      // self.sliderIsReady();
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
            if (self.currentClip && self.currentClip.playbackType === 'extended') {
              self.currentClip.stop();
            }
            self.videoProgressWatcher();
            break;
          case 2:
            // paused
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
            height: '100%',
            videoId: self.state.videoId,
            enablejsapi: true,
            fs: 1,
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

  // 7
  videoProgressWatcher() {
    console.log('6 -> videoProgressWatcher')
    const interval = 100;

    if (this.watcher) {
      clearInterval(this.watcher);
      this.watcher = null;
    }

    this.watcher = setInterval(() => {
      const currentVideoProgress = this.state.videoPlayer.getCurrentTime();
      const videoVolume = this.state.videoPlayer.getVolume();

      // this.setState({
      //   currentVideoProgress,
      //   videoVolume,
      // });

      if (this.currentClip) {
        this.currentClip.volume(this.state.sliderValue / 100);
        this.state.videoPlayer.setVolume((100 - this.state.sliderValue) * 0.1);
      } else this.state.videoPlayer.setVolume(100 - this.state.sliderValue);

      // console.log('yt volume', videoVolume);
      // console.log('clip volume', this.state.currentClipVolume);

      for (let i = 0; i < this.audioClipsCopy.length; i += 1) {
        switch (this.audioClipsCopy[i].playback_type) {
          case 'inline':
            if (currentVideoProgress >= +this.audioClipsCopy[i].start_time && currentVideoProgress < +this.audioClipsCopy[i].end_time) {
              console.log('## INLINE');
              this.currentClip = new Howl({
                src: [this.audioClipsCopy[i].url],
                html5: true,
                volume: this.state.sliderValue / 100,
                onload: () => {
                  this.currentClip.playbackType = 'inline';
                  this.currentClip.seek(currentVideoProgress - +this.audioClipsCopy[i].start_time, this.currentClip.play());
                  this.audioClipsCopy = this.audioClipsCopy.slice(i + 1);
                },
                onloaderror: (errToLoad) => {
                  console.log('Impossible to load', errToLoad)
                },
                onplay: () => {
                  console.log('## INLINE PLAYING');
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
              console.log('## EXTENDED ##');
              this.currentClip = new Howl({
                src: [this.audioClipsCopy[i].url],
                html5: true,
                volume: this.state.sliderValue / 100,
                onload: () => {
                  this.currentClip.playbackType = 'extended';
                  this.audioClipsCopy = this.audioClipsCopy.slice(i + 1);
                  this.currentClip.play();
                },
                onloaderror: (errToLoad) => {
                  console.log('Impossible to load', errToLoad)
                },
                onplay: () => {
                  console.log('EXTENDED PLAYING');
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

  // 1
  render() {
    console.log('1 -> Render')
    return (

      <div id="video-player">
        <main role="application" title="Video player">
          <div className="w3-row">
            <div
              id="video"
              className="w3-card-2"
              >
              <div id="playerVP" />
            </div>
          </div>
        </main>
        <Slider
          updateState={this.updateState}
          sliderIsReady={this.sliderIsReady}
        />
        <AudioDescriptionSelector
          updateState={this.updateState}
          audioDescriptionsIdsUsers={this.state.audioDescriptionsIdsUsers}
          selectedAudioDescriptionId={this.state.selectedAudioDescriptionId}
          setAudioDescriptionActive={this.setAudioDescriptionActive}
        />
      </div>
    );
  }
}

export default VideoPage;
