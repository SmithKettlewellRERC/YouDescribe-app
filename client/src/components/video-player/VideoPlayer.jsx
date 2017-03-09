import React, { Component } from 'react';
import { Howl } from 'howler';

const conf = require('./../../shared/config')();

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.watcher = null;
    this.videoPlayer = null;
    this.videoId = props.id;
    this.baseUrl = 'http://localhost:8080/uploads/';
    this.audioClips = [];
    this.audioClipsLength = 0;
    this.nextAudioClip = null;
    this.initVideoPlayer = this.initVideoPlayer.bind(this);
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
          this.parseVideoData(json.result);
        } else {
          console.log('Invalid data');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  parseVideoData(videoData) {
    const clips = videoData.audio_descriptions['1'].clips;
    const clipsIds = Object.keys(clips);
    clipsIds.forEach((id) => {
      const obj = clips[id];
      obj.url = `${conf.audioClipsUploadsPath}${obj.path}/${obj.filename}`;
      this.audioClips.push(obj);
    });
    this.audioClipsLength = this.audioClips.length;
    this.preLoadAudioClips();
  }

  preLoadAudioClips() {
    let totalAudioClipsLoaded = 0;
    const audioClipLoaded = () => {
      totalAudioClipsLoaded += 1;
      console.log('total', this.audioClipsLength, totalAudioClipsLoaded);
      if (this.audioClipsLength <= totalAudioClipsLoaded) {
        console.log('All audios loaded, let\'s start the video player');
        this.initVideoPlayer();
      }
    };

    // Caching all audio clips???
    this.audioClips.forEach((audioObj) => {
      console.log('CREATE', audioObj.url);
      const sound = new Howl({
        src: [audioObj.url],
        buffer: false,
        loop: false,
        volume: 1.0, // 0.0 -> 1.0
        onload: audioClipLoaded,
      });
    });
  }

  initVideoPlayer() {
    console.log('initVideoPlayer');
    const self = this;
    this.videoPlayer = new YT.Player('player', {
      height: '315px',
      width: '560px',
      videoId: this.videoId,
      events: {
        onReady: onVideoPlayerReady,
      },
    });
    function onVideoPlayerReady() {
      console.log('YouTube video player ready. Lets call the watcher');
      self.videoProgressWatcher();
    }
  }

  getNextAudioClip(currentVideoProgress) {
    const audioClipsCuePoints = this.audioClips.map((clip) => clip.start_time).sort((a, b) => a - b);
    for (let i = 0; i < audioClipsCuePoints.length; i += 1) {
      if (currentVideoProgress < this.audioClips[i].start_time) {
        this.nextAudioClip = this.audioClips[i];
        return this.nextAudioClip;
      }
    }
    this.nextAudioClip = null;
    return null;
  }

  videoProgressWatcher() {
    console.log('Video progress watcher running...');
    let previousTime = 0;
    let currentVideoProgress = 0;
    let currentAudioClip = null;

    this.watcher = setInterval(() => {
      currentVideoProgress = this.videoPlayer.getCurrentTime();
      // console.log('currentVideoProgress', currentVideoProgress);

      // Whe the user back the video.
      if (Math.abs(currentVideoProgress - previousTime) > 0.015) {
        currentAudioClip = this.getNextAudioClip(currentVideoProgress);
      }
      previousTime = currentVideoProgress;

      let timedEvent;
      if (this.nextAudioClip) {
        timedEvent = Number(this.nextAudioClip.start_time);
      } else {
        timedEvent = Infinity;
      }

      if (currentVideoProgress > timedEvent) {
        console.log(this.nextAudioClip);
        const url = this.nextAudioClip.url
        if (this.nextAudioClip.type === 'inline') {
          console.log('### PLAY INLINE ###');
          // console.log('URL', url);
          this.playAudioClip(url, currentVideoProgress);
        } else {
          console.log('### PLAY EXTENDED ###');
          // console.log('URL', url);
          this.videoPlayer.pauseVideo();
          this.playAudioClip(url, currentVideoProgress, () => {
            this.videoPlayer.playVideo();
          });
        }
        this.getNextAudioClip(currentVideoProgress);
      }
    }, 10);
  }

  playAudioClip(url, currentVideoProgress, callback = () => {}) {
    // console.log('PLAY', [url]);
    const audio = new Howl({
      src: [url],
      html5: true,
      onend: () => {
        callback();
      },
    });
    audio.play();
    // console.log('Playing audio clip at: ', arr[0]);
    console.log('The audio clip was played at: ', currentVideoProgress);
  }

  componentDidMount() {
    // this.preLoadAudioClips();
    this.fetchAudioClips();
    // console.log(conf.apiUrl);

  }

  render() {
    return <div id="player"></div>;
  }
}

export default VideoPlayer;
