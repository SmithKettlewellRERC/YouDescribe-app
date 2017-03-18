import React, { Component } from 'react';
import { Howl } from 'howler';

const conf = require('../../shared/config')();

class VideoPage extends Component {
  constructor(props) {
    super(props);
    this.watcher = null;
    // this.nextAudioClip = null;
    // this.currentClip = null;
    // this.previousAudioClip = null;
    // this.videoState = -1;

    this.state = {
      videoId: props.params.videoId,
      videoUrl: `${conf.apiUrl}/videos/${props.params.videoId}`,

      // Video controls and data.
      videoData: {},
      audioClips: [],
      videoPlayer: null,
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
      self.videoProgressWatcher();
    }

    function onPlayerStateChange(event) {
      self.videoState = event.data;
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

  // 7
  videoProgressWatcher() {
    console.log('7 -> videoProgressWatcher')
    let previousTime = 0;
    let currentVideoProgress = 0;
    let nextAudioClipStartTime;
    let previousAudioClipStartTime;
    let extendedAudioClipPlaying = false;
    let oldState = -1;
    let loaded = false;
    let type;
    let duration;

    if (this.watcher) {
      clearInterval(this.watcher);
      this.watcher = null;
    }

    this.watcher = setInterval(() => {
      currentVideoProgress = this.state.videoPlayer.getCurrentTime();

      this.setState({
        currentVideoProgress,
      });

      // When the user back the video.
      if (Math.abs(currentVideoProgress - previousTime) > 0.011) {
        this.getNextAudioClip(currentVideoProgress);
        if (this.currentClip) {
          console.log('im already playing');
          // this.currentClip.stop();
        }
      }

      if (this.nextAudioClip) {
        // console.log('nextaudioclip exists?!?!?!');
        nextAudioClipStartTime = Number(this.nextAudioClip.start_time);
      } else {
        nextAudioClipStartTime = Infinity;
      }

      if (this.previousAudioClip) {
        previousAudioClipStartTime = Number(this.previousAudioClip.start_time);
        type = this.previousAudioClip.playback_type;
        duration = this.previousAudioClip.duration;
      } else {
        previousAudioClipStartTime = Infinity;
        type = 'None';
        duration = 0;
      }

      if (this.videoState !== oldState) {
        // if it loaded = true
        if (loaded === true) {
          loaded = false;
          console.log('run');
          // move the video position into middle of an inline video
          if (((currentVideoProgress - previousAudioClipStartTime) < duration - 0.05) && type === 'inline') {
            this.currentClip = new Howl({
              src: [this.previousAudioClip.url],
              html5: true,
            });
            const playing = this.currentClip.play();
            this.currentClip.seek(currentVideoProgress - previousAudioClipStartTime, playing);
          }
        }

        // the condition remove the first unstart
        // resume for both manual resume and auto resume
        // playing or buffering state
        if (this.videoState === 1 || this.videoState === 3) {
          extendedAudioClipPlaying = false;
          // careful here: the different usually are 0.1
          if (Math.abs(currentVideoProgress - previousTime) > 0.15) {
            if (this.currentClip) {
              this.currentClip.stop();
            }
          }
          if (Math.abs(currentVideoProgress - previousTime) > 0.15) {
            console.log('load location');
            console.log('run ');
            // move the video position into middle of an inline video
            if (((currentVideoProgress - previousAudioClipStartTime) < duration - 0.05) && type === 'inline') {
              this.currentClip = new Howl({
                src: [this.previousAudioClip.url],
                html5: true,
              });
              const playing = this.currentClip.play();
              this.currentClip.seek(currentVideoProgress - previousAudioClipStartTime, playing);
            }
          }
        }

        // pause for only manual pause
        if (this.videoState === 2 && !extendedAudioClipPlaying) {
          // console.log('pause this: ', this.currentClip)

          if (this.currentClip) {
            this.currentClip.stop();
          }
          loaded = true;
        }
      }

      previousTime = currentVideoProgress;

      if (currentVideoProgress > nextAudioClipStartTime) {
        const url = this.nextAudioClip.url;
        if (this.nextAudioClip.playback_type === 'inline') {
          console.log('### INLINE ###', url);
          // pause the previous video, otherwise the playback gonna keep playing
          if (this.currentClip) {
            this.currentClip.pause();
          }
          this.currentClip = new Howl({ src: [url], html5: true });
          this.currentClip.play();
          // let playing = this.currentClip.play();
          // this.currentClip.seek(2, playing)
        } else {
          console.log('### EXTENDED ###', url);
          // pause the previous video, otherwise the playback gonna keep playing
          if (this.currentClip) {
            this.currentClip.pause();
          }
          this.state.videoPlayer.pauseVideo();
          extendedAudioClipPlaying = true;
          this.currentClip = new Howl({
            src: [url],
            html5: true,
            onend: () => {
              extendedAudioClipPlaying = false;
              this.state.videoPlayer.playVideo();
            },
          });
          this.currentClip.play();
        }
        this.getNextAudioClip(currentVideoProgress);
      }

      oldState = this.videoState;
    }, 10);
  }

  // 8

  componentWillUnmount() {
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
