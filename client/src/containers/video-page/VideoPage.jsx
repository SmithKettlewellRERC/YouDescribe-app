import React, { Component } from 'react';
import { Howl } from 'howler';

const conf = require('../../shared/config')();

class VideoPage extends Component {
  constructor(props) {
    super(props);
    this.watcher = null;
    this.videoState = -1;
    // this.previousClip = {};
    this.currentClip = {};
    this.timeAtPause = 0;
    this.audioClipsCopy = {};
    // this.nextAudioClip = null;
    // this.currentClip = null;
    // this.previousAudioClip = null;

    this.state = {
      videoId: props.params.videoId,
      videoUrl: `${conf.apiUrl}/videos/${props.params.videoId}`,

      // Video controls and data.
      videoData: {},
      audioClips: [],
      videoPlayer: null,
      videoState: -1,
      // videoDuration: 0,
      // videoTitle: '',
      // videoDescription: '',
      // currentVideoProgress: 0,
      // currentTimeInVideo: 0,
    };
    this.getState = this.getState.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  componentDidMount() {
    this.fetchVideoData();
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
      videoData,
      audioClips,
    }, () => {
      this.preLoadAudioClips();
    });
  }

  // 4
  preLoadAudioClips() {
    console.log('4 -> preLoadAudioClips');
    const self = this;
    if (this.state.audioClips.length > 0) {
      const promises = [];
      this.state.audioClips.forEach((audioObj, idx) => {
        console.log(idx + 1, 'audio description loaded', audioObj.url);
        promises.push(fetch(audioObj.url));
      });
      Promise.all(promises).then(function() {
        console.log('All audios loaded');
        self.initVideoPlayer();
      })
      .catch(function(errorAllAudios) {
        console.log('ERROR LOADING AUDIOS -> ', errorAllAudios);
      });
    } else {
      self.initVideoPlayer();
    }
  }

  // 5
  initVideoPlayer() {
    const self = this;
    console.log('5 -> initVideoPlayer', this.state.videoId);
    if (YT.loaded) {
      startVideo();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        startVideo();
      };
    }

    function onVideoPlayerReady() {
      // self.videoProgressWatcher();
      self.audioClipsCopy = self.state.audioClips.slice();
    }

    function onPlayerStateChange(event) {
      console.log('## STATE CHANGE ##');
      self.videoState = event.data;
      self.setState({ videoState: event.data }, () => {
        switch (event.data) {
          case 1:
            if (self.currentClip && self.currentClip.playbackType === 'extended') {
              self.currentClip.stop();
            }
            self.videoProgressWatcher();
            break;
          case 2:
            self.audioClipsCopy = self.state.audioClips.slice();
            if (self.currentClip && self.currentClip.playbackType === 'inline') {
              self.currentClip.pause();
            }
            if (self.watcher) {
              clearInterval(self.watcher);
              self.watcher = null;
            }
            break;
          default:
            if (self.watcher) {
              clearInterval(self.watcher);
              self.watcher = null;
            }
        }
      });
      // const videoState = {
      //   '-1': 'unstarted',
      //   '0': 'ended',
      //   '1': 'playing',
      //   '2': 'paused',
      //   '3': 'buffering',
      //   '5': 'video cued',
      // }
      // console.log('Video player new state', videoState[newState.data.toString()])
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

  // 6
  videoProgressWatcher() {
    console.log('6 -> videoProgressWatcher')
    const interval = 50;

    if (this.watcher) {
      clearInterval(this.watcher);
      this.watcher = null;
    }

    this.watcher = setInterval(() => {
      const currentVideoProgress = this.state.videoPlayer.getCurrentTime();

      this.setState({
        currentVideoProgress,
      });

      // if (this.previousClip && (currentVideoProgress > this.previousClip.end_time)) this.currentClip.stop();
        for (let i = 0; i < this.audioClipsCopy.length; i += 1) {
          // console.log(Math.abs(+this.audioClipsCopy[i].start_time - currentVideoProgress));
          // console.log(.25);
          // if (Math.abs(+this.audioClipsCopy[i].start_time - currentVideoProgress) <= .25) {
          // if (currentVideoProgress >= +this.audioClipsCopy[i].start_time && currentVideoProgress < +this.audioClipsCopy[i].end_time) {
            switch (this.audioClipsCopy[i].playback_type) {
              case 'inline':
                // console.log('INLINE TRY');
                if (currentVideoProgress >= +this.audioClipsCopy[i].start_time && currentVideoProgress < +this.audioClipsCopy[i].end_time) {
                  console.log('## INLINE ##');
                  this.currentClip = new Howl({
                    src: [this.audioClipsCopy[i].url],
                    html5: true,
                  });
                  this.currentClip.playbackType = 'inline';
                  this.currentClip.seek(currentVideoProgress - +this.audioClipsCopy[i].start_time, this.currentClip.play());
                  this.audioClipsCopy = this.audioClipsCopy.slice(i + 1);
                  // this.currentClip.play();
                  // this.previousClip = this.currentClip;
                }
                break;
              case 'extended':
                if (Math.abs(+this.audioClipsCopy[i].start_time - currentVideoProgress) <= interval / 1000 ||
                (+this.audioClipsCopy[i].start_time < 0.5 && currentVideoProgress <= interval / 500)) {
                  console.log('## EXTENDED ##');
                  this.currentClip = new Howl({
                    src: [this.audioClipsCopy[i].url],
                    html5: true,
                    onend: () => {
                      this.state.videoPlayer.playVideo();
                      this.previousClip = this.currentClip;
                      // setTimeout(() => this.previousClip = {}, interval + 200);
                    },
                    onload: () => {
                      // console.log('ON LOAD ####', this.previousClip._src, this.currentClip._src)
                      this.currentClip.playbackType = 'extended';
                      this.audioClipsCopy = this.audioClipsCopy.slice(i + 1);
                      // if (this.previousClip._src !== this.currentClip._src) {
                        console.log('GOT THERE');
                        this.currentClip.play();
                      // } else {
                      //   console.log('ELSE')
                      // }
                    },
                    onloaderror: (errToLoad) => {
                      console.log('Impossible to load', errToLoad)
                    },
                    onplay: () => {
                      console.log('PLAYING');
                      this.state.videoPlayer.pauseVideo();
                    }
                  });
                }
                break;
              default:
                console.log('Audio clip format not labelled or incorrect');
            }
            // break;
          // }
        }
      // }
    }, interval);
  }

  componentWillUnmount() {
    if (this.currentClip.stop) this.currentClip.stop();
    if (this.watcher) {
      clearInterval(this.watcher);
      this.watcher = null;
    }
  }

  getNextAudioClip(currentVideoProgress) {
    const length = this.state.audioClips.length;
    for (let i = 0; i < length; i += 1) {
      if (currentVideoProgress < this.state.audioClips[i].start_time) {
        this.nextAudioClip = this.state.audioClips[i];
        if (this.state.audioClips[i - 1]) {
          this.previousAudioClip = this.state.audioClips[i - 1];
        } else {
          this.previousAudioClip = this.state.audioClips[i];
        }
        return i;
      }
    }
    this.nextAudioClip = null;
    this.previousAudioClip = this.state.audioClips[length - 1];
    return null;
  }

  getState() {
    return this.state;
  }

  updateState(newState) {
    this.setState(newState);
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
            <div id="playerVP" />
          </div>

        </div>
        <div className="w3-row w3-margin-top w3-hide-small w3-hide-medium">

        </div>
      </main>
    );
  }
}

export default VideoPage;
