import React, { Component } from 'react';
import { Howl } from 'howler';
import Slider from '../../components/slider/Slider.jsx';
import DescriberChooser from '../../components/describer-chooser/DescriberChooser.jsx';

const conf = require('../../shared/config')();

class VideoPage extends Component {
  constructor(props) {
    super(props);
    this.watcher = null;
    this.videoState = -1;
    this.currentClip = null;
    this.timeAtPause = 0;
    this.audioClipsCopy = {};
    this.previousVideoVolume = 0;

    this.state = {
      videoId: props.params.videoId,
      videoUrl: `${conf.apiUrl}/videos/${props.params.videoId}`,

      currentVideoDescriber: '',

      // Audio descriptions.
      audioDescriptionsIds: [],
      audioDescriptionsIdsUsers: {},
      audioDescriptionsIdsAudioClips: {},
      selectedAudioDescriptionId: null,

      // Video controls and data.
      videoData: {},
      audioClips: [],
      videoPlayer: null,
      videoState: -1,
      videoVolume: 0,
    };
    this.getState = this.getState.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  componentDidMount() {
    this.fetchVideoData();
  }

  getAudioClips() {
    if (this.state.audioDescriptionsIdsAudioClips && this.state.selectedAudioDescriptionId) {
      const audioClips = this.state.audioDescriptionsIdsAudioClips[this.state.selectedAudioDescriptionId];
      console.log('getAudioClips', audioClips)
      return audioClips;
    } else {
      console.log('getAudioClips []')
      return [];
    }
  }

  // 2
  fetchVideoData() {
    console.log('2 -> fetchingVideoData');
    const self = this;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', this.state.videoUrl, true);
    xhr.onload = function () {
      if (xhr.readyState === 4) {
        const response = JSON.parse(xhr.response);
        const result = response.result
          ? response.result
          : {};
        self.setState({
          videoData: result,
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
    console.log(audioDescriptionsIdsUsers)
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
    if (!this.state.selectedAudioDescriptionId) {
      selectedAudioDescriptionId = this.state.audioDescriptionsIds[0];
    }

    let audioClipsLength = 0;
    if (this.state.audioDescriptionsIdsAudioClips && selectedAudioDescriptionId) {
      audioClipsLength = this.getAudioClips().length;
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
        console.log(idx + 1, 'audio clip loaded', audioObj.url);
        promises.push(fetch(audioObj.url));
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
      startVideo();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        startVideo();
      };
    }

    function onVideoPlayerReady() {
      self.audioClipsCopy = self.getAudioClips().slice();
    }

    function onPlayerStateChange(event) {
      console.log('## STATE CHANGE ##', event.data);
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
            self.audioClipsCopy = self.state.audioClips.slice();
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

    const interval = 50;


    if (this.watcher) {
      clearInterval(this.watcher);
      this.watcher = null;
    }

    this.watcher = setInterval(() => {
      const currentVideoProgress = this.state.videoPlayer.getCurrentTime();
      const videoVolume = this.state.videoPlayer.getVolume();
      console.log(videoVolume);

      // if (!this.currentClip) this.state.videoPlayer.setVolume(100);

      this.setState({
        currentVideoProgress,
        videoVolume,
      });

        for (let i = 0; i < this.audioClipsCopy.length; i += 1) {
            switch (this.audioClipsCopy[i].playback_type) {
              case 'inline':
                if (currentVideoProgress >= +this.audioClipsCopy[i].start_time && currentVideoProgress < +this.audioClipsCopy[i].end_time) {
                  console.log('## INLINE ##');
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
                      console.log('INLINE PLAYING');
                      this.previousVideoVolume = videoVolume;
                      this.state.videoPlayer.setVolume(10);
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
                  console.log('## EXTENDED ##');
                  this.currentClip = new Howl({
                    src: [this.audioClipsCopy[i].url],
                    html5: true,
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
    if (this.currentClip.stop) this.currentClip.stop();
    if (this.watcher) {
      clearInterval(this.watcher);
      this.watcher = null;
    }
    this.currentClip = null;
    this.watcher = null;
  }

  getNextAudioClip(currentVideoProgress) {
    const length = this.getAudioClips().length;
    for (let i = 0; i < length; i += 1) {
      if (currentVideoProgress <= this.getAudioClips()[i].start_time) {
        this.nextAudioClip = this.getAudioClips()[i];
        if (this.getAudioClips()[i - 1]) {
          this.previousAudioClip = this.getAudioClips()[i - 1];
        } else {
          this.previousAudioClip = this.getAudioClips()[i];
        }
        return i;
      }
    }
    this.nextAudioClip = null;
    this.previousAudioClip = this.getAudioClips()[length - 1];
    return null;
  }

  getState() {
    return this.state;
  }

  getNextAudioClip(currentVideoProgress) {
    const length = this.getAudioClips().length;
    for (let i = 0; i < length; i += 1) {
      if (currentVideoProgress < this.getAudioClips()[i].start_time) {
        this.nextAudioClip = this.getAudioClips()[i];
        if (this.getAudioClips()[i - 1]) {
          this.previousAudioClip = this.getAudioClips()[i - 1];
        } else {
          this.previousAudioClip = this.getAudioClips()[i];
        }
        return i;
      }
    }
    this.nextAudioClip = null;
    this.previousAudioClip = this.getAudioClips()[length - 1];
    return null;
  }

  getState() {
    return this.state;
  }

  updateState(newState) {
    this.setState(newState);
  }

  changeVolume(newVolumeValue) {
    // change youtube and all the audio volume
    const video = document.getElementById('playerVP');
    video.setVolume(0);
  }

  handleOption(event) {
    console.log(event.target.value);
    this.setState({ currentVideoDescriber: event.target.value });
  }

  // 1
  render() {
    return (
      <main id="video-player">
        <div className="w3-row">
          <div
            id="video"
            className="w3-card-2"
          >
            <div id="playerVP" />
          </div>
        </div>
        {/* <Slider changeVolume={this.changeVolume} /> */}
      </main>
    );
  }
}

export default VideoPage;
