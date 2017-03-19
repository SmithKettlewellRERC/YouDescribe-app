import React, { Component } from 'react';
import { Howl } from 'howler';
import Slider from '../../components/slider/Slider.jsx';

const conf = require('../../shared/config')();

class VideoPage extends Component {
  constructor(props) {
    super(props);
    this.watcher = null;
    this.nextAudioClip = null;
    this.currentClip = null;
    this.previousAudioClip = null;
    this.videoDurationInSeconds = -1;
    this.videoState = -1;
    this.extendedAudioClipPlaying = false;

    this.state = {
      videoId: props.params.videoId,
      videoUrl: `${conf.apiUrl}/videos/${props.params.videoId}`,
      notes: '',

      videoData: {},
      videoPlayer: null,
      videoState: -1,
      audioClips: [],
      videoDuration: 0,
      videoTitle: '',
      videoDescription: '',
      currentVideoProgress: 0,
      videoDurationToDisplay: '',
      playheadPosition: 0,
      playheadTailHeight: 0,
      currentTimeInVideo: 0,
      volume: 0,
    };
    this.getState = this.getState.bind(this);
    this.updateState = this.updateState.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
  }

  // 1
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
      playheadTailHeight: audioClips.length <= 7
        ? audioClips.length * 27
        : 189,
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
    }

    function onPlayerStateChange(event) {
      self.videoState = event.data;
      self.setState({ videoState: event.data }, () => {
        switch (event.data) {
          case 1:
            clearInterval(self.watcher);
            if (self.currentClip) {
              self.currentClip.stop();
            }
            self.currentClip = null;
            self.watcher = null;
        
            self.videoProgressWatcher();
            break;
          case 2:
            console.log('paused: 2 ')
            if (!self.extendedAudioClipPlaying) {
              clearInterval(self.watcher);
              if (self.currentClip) {
                self.currentClip.stop();
              }
              self.currentClip = null;
              self.watcher = null;
            }
            break;
          case 3:
            console.log('paused: 3 ')
            if (!self.extendedAudioClipPlaying) {
              clearInterval(self.watcher);
              if (self.currentClip) {
                self.currentClip.stop();
              }
              self.currentClip = null;
              self.watcher = null;
            }
          default:
            console.log('default');
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

  videoProgressWatcher() {
    console.log('7 -> videoProgressWatcher')

    let interval = 50;
    let previousTime = 0;
    let nextAudioClipStartTime;
    let previousAudioClipStartTime;
    let type;
    let duration;
    // this.extendedAudioClipPlaying = true;

    if (this.watcher) {
      clearInterval(this.watcher);
      this.watcher = null;
    }

    let once = true;
    let temp = true;
    this.watcher = setInterval(() => {
      const currentVideoProgress = this.state.videoPlayer.getCurrentTime();
      console.log(currentVideoProgress);


      if (once) {
        this.getNextAudioClip(currentVideoProgress);
        once = false;
      }

      this.setState({
        currentVideoProgress,
      });

      // get that next audio clip right at 0;


      if (this.nextAudioClip) {
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

      console.log('previous audio clip start time: ', previousAudioClipStartTime,'type: ', type, 'duration: ', duration, 'and the next audio clip start time: ',nextAudioClipStartTime)

      // let the inline video is played once
      if ((currentVideoProgress - previousAudioClipStartTime) > duration) {
        temp = true;
      }

      if (((currentVideoProgress - previousAudioClipStartTime) < duration) && type === 'inline' && temp) {
        if (this.currentClip) {
          this.currentClip.stop();
        }
        this.currentClip = null;

        this.currentClip = new Howl({
          src: [this.previousAudioClip.url],
          html5: true,
        });
        const playing = this.currentClip.play();
        this.currentClip.seek(currentVideoProgress - previousAudioClipStartTime, playing);
        temp = false;
      }

      
      if (currentVideoProgress > nextAudioClipStartTime) {
        const url = this.nextAudioClip.url;
        if (this.currentClip) {
          this.currentClip.stop();
        }
        this.currentClip = null;

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
          this.extendedAudioClipPlaying = true;
          this.currentClip = new Howl({
            src: [url],
            html5: true,
            onend: () => {
              this.extendedAudioClipPlaying = false;
              this.state.videoPlayer.playVideo();
            },
          });
          this.currentClip.play();
        }
        this.getNextAudioClip(currentVideoProgress);
      }
      
    }, 50);
  }

  // 7

  componentWillUnmount() {
    console.log('leaving the page');
    clearInterval(this.watcher);
    if (this.currentClip) {
      this.currentClip.stop();
    }
    this.currentClip = null;
    this.watcher = null;
  }

  getNextAudioClip(currentVideoProgress) {
    const length = this.state.audioClips.length;
    for (let i = 0; i < length; i += 1) {
      if (currentVideoProgress <= this.state.audioClips[i].start_time) {
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

  changeVolume(newVolumeValue) {
    //change youtube and all the audio volume
    const video = document.getElementById('playerAT');
    video.setVolume(0);
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
        </div>
        <Slider changeVolume={this.changeVolume} />
        {/*<div>Hello</div>*/}
      </main>
    );
  }
}

export default VideoPage;
