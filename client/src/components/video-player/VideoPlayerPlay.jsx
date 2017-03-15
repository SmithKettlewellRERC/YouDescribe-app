import React, { Component } from 'react';
import { Howl } from 'howler';
import {
  convertISO8601ToSeconds,
  convertSecondsToEditorFormat,
} from '../../shared/helperFunctions';

const conf = require('./../../shared/config')();
const seedAudioList = require('./seedAudioList')
const seedData = seedAudioList.default;

class VideoPlayerPlay extends Component {
  constructor(props) {
    super(props);
    this.watcher = null;
    this.videoPlayer = null;
    this.videoId = props.videoId;
    this.audioClips = [];
    this.audioClipsLength = 0;
    this.audioClipsDuration = [];
    this.nextAudioClip = null;
    this.passedAudioClip = null;
    this.initVideoPlayer = this.initVideoPlayer.bind(this);
    this.currentClip = null;
    this.videoState = -1;
  }

  fetchAudioClips() {
    const url = `${conf.apiUrl}/videos/${this.videoId}`;
    console.log('Fetching', url);
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (json && json.result && json.result.status === 'published') {
          //test with fake data, replace with json.result later
          this.parseVideoData(seedData);
        } else {
          console.log('Invalid data');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  parseVideoData(videoData) {
    if (videoData.audio_descriptions) {
      const clips = videoData.audio_descriptions['1'].clips;
      const clipsIds = Object.keys(clips);
      clipsIds.forEach((id) => {
        const obj = clips[id];
        obj.url = `${conf.audioClipsUploadsPath}${obj.file_path}/${obj.file_name}`;
        this.audioClips.push(obj);
      });
      this.audioClipsLength = this.audioClips.length;
      this.preLoadAudioClips();
    }
  }

  preLoadAudioClips() {
    let totalAudioClipsLoaded = 0;
    const audioClipLoaded = () => {
      totalAudioClipsLoaded += 1;
      console.log('Loading', totalAudioClipsLoaded, 'of', this.audioClipsLength);
      if (this.audioClipsLength <= totalAudioClipsLoaded) {
        console.log('All audios loaded, let\'s start the video player');
        this.initVideoPlayer();
      }
    };

    this.audioClips = this.audioClips.sort((a, b) => a.start_time - b.start_time);;


    // Caching all audio clips???
    this.audioClips.forEach((audioObj) => {
      const sound = new Howl({
        src: [audioObj.url],
        buffer: false,
        loop: false,
        // preload: false,
        volume: 1.0, // 0.0 -> 1.0
        onload: () => {
          let duration = sound.duration();
          console.log('create clip start at: ',audioObj.start_time, ' have duration: ', duration);
          this.audioClipsDuration.push(duration)
          audioClipLoaded();
        }
        // onloaderror: (id, errToLoad) => {
        //   console.log('Error loading audio', id, errToLoad);
        // },
      });
    });
  }

  initVideoPlayer() {
    // console.log('initVideoPlayer');
    const self = this;

    this.videoPlayer = new YT.Player('playerPlay', {
      height: '100%',
      // width: '100%',
      cc_load_policy: 1,
      videoId: this.videoId,
      events: {
        onReady: onVideoPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    })

    function onVideoPlayerReady() {
      console.log('YouTube video player ready. Lets call the watcher');
      self.videoProgressWatcher();
    }

    function onPlayerStateChange(event) {
      self.videoState = event.data;
    }
  }

  getNextAudioClip(currentVideoProgress) {
    // const audioClipsCuePoints = this.audioClips.map((clip) => clip.start_time).sort((a, b) => a - b);
    for (let i = 0; i < this.audioClips.length; i += 1) {
      if (currentVideoProgress < this.audioClips[i].start_time) {
        this.nextAudioClip = this.audioClips[i];
        if (this.audioClips[i - 1]) {
          this.passedAudioClip = this.audioClips[i - 1];
        } else {
          this.passedAudioClip = this.audioClips[i];
        }
        return null;
      }
    }
    this.nextAudioClip = null;
    return null;
  }

  videoProgressWatcher() {
    console.log('Video progress watcher running...');
    let previousTime = 0;
    let currentVideoProgress = 0;
    let nextTimedEvent;
    let passedTimedEvent;;
    let extendedVideoPlaying = false;
    let oldState = -1;
    let loaded = false;

    this.watcher = setInterval(() => {
      currentVideoProgress = this.videoPlayer.getCurrentTime();

      // time and videoState tracking log
      // console.log(currentVideoProgress,' state is: ', this.videoState)
      

      // When the user back the video.
      if (Math.abs(currentVideoProgress - previousTime) > 0.07) {
        this.getNextAudioClip(currentVideoProgress);
        // stop the video if user back the video
        if (this.currentClip) {
          this.currentClip.stop();
        }
        // console.log('choice 1')
      }

      // when the video is paused 
      if (this.videoState == 2) {
        // when people change back the video when it paused
        if (Math.abs(currentVideoProgress - previousTime) > 0.07) {
          //load location
          console.log('load location')
          loaded = true;
        }
      }

      // Click detection occur when the videoState changed, which init by YouTube onStateChange
      if (this.videoState !== oldState) {
        // if it loaded = true
        if (loaded === true) {
          console.log('run');
          loaded = false;
        }

        // the condition remove the first unstart
        // resume for both manual resume and auto resume
        // playing or buffering state
        if (this.videoState == 1 || this.videoState == 3) {

          //careful here: the different usually are 0.1
          if (Math.abs(currentVideoProgress - previousTime) > 0.15) {
            if (this.currentClip) {
              this.currentClip.stop();
            }
            console.log('load location')
            console.log('run ')
          } 
        }

        // pause for only manual pause
        if (this.videoState == 2 && !extendedVideoPlaying) {
          // console.log('pause this: ', this.currentClip)

          if (this.currentClip) {
            this.currentClip.stop();
          }
        }
      }

      //tracking the current time and the previous time value of the last interval
      previousTime = currentVideoProgress;

      //look for the timedEvent in the this.nextAudioClip
      // let timedEvent;
      if (this.nextAudioClip) {
        nextTimedEvent = Number(this.nextAudioClip.start_time);
      } else {
        nextTimedEvent = Infinity;
      }

      let type;
      if (this.passedAudioClip) {
        passedTimedEvent = Number(this.passedAudioClip.start_time);
        type = this.passedAudioClip.playback_type;
      } else {
        passedTimedEvent = Infinity;
        type = 'None';
      }

    // load locations will take in: passedTimedEvent, duration, nextTimedEvent, 
      console.log('passed event: ', passedTimedEvent,'type: ',type, ' and the next event: ',nextTimedEvent)

      if (currentVideoProgress > nextTimedEvent) {
        const url = this.nextAudioClip.url
        if (this.nextAudioClip.playback_type === 'inline') {
          console.log('### INLINE ###', url);
          // pause the previous video, otherwise the playback gonna keep playing
          if (this.currentClip) {
            this.currentClip.pause();
          }
          this.currentClip = new Howl({
            src: [url],
            html5: true
          });
          this.currentClip.play();
          // let playing = this.currentClip.play();
          // this.currentClip.seek(2, playing)
        } else {
          console.log('### EXTENDED ###', url);
          // pause the previous video, otherwise the playback gonna keep playing
          if (this.currentClip) {
            this.currentClip.pause();
          }
          this.videoPlayer.pauseVideo();
          extendedVideoPlaying = true;
          this.currentClip = new Howl({
            src: [url],
            html5: true,
            onend: () => {
              extendedVideoPlaying = false
              this.videoPlayer.playVideo();
            },
          });
          this.currentClip.play();
        }
        this.getNextAudioClip(currentVideoProgress);
      }

      oldState = this.videoState;
    }, 50);
  }

  // playAudioClip(url, currentVideoProgress, callback = () => {}) {
  //   // console.log('PLAY', [url]);
  //   const audio = new Howl({
  //     src: [url],
  //     html5: true,
  //     onend: () => {
  //       callback();
  //     },
  //   });
  //   audio.play();
  // }

  componentDidMount() {
    this.fetchAudioClips();
  }

  componentWillUnmount() {
    console.log('leaving the page');
    clearInterval(this.watcher);
    if (this.currentClip) {
      this.currentClip.stop();
    }
    this.currentClip = null;
  }

  render() {
    return (<div id="playerPlay" />);
  }
}

export default VideoPlayerPlay;