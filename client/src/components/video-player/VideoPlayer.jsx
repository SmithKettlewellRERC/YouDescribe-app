import React, { Component } from 'react';
import { Howl } from 'howler';

const conf = require('./../../shared/config')();

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.watcher = null;
    this.videoPlayer = null;
    this.videoId = props.videoId;
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
      obj.url = `${conf.audioClipsUploadsPath}${obj.file_path}/${obj.file_name}`;
      this.audioClips.push(obj);
    });
    this.audioClipsLength = this.audioClips.length;
    this.preLoadAudioClips();
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

    // Caching all audio clips???
    this.audioClips.forEach((audioObj) => {
      console.log('CREATE', audioObj.url);
      const sound = new Howl({
        src: [audioObj.url],
        buffer: false,
        loop: false,
        preload: true,
        volume: 1.0, // 0.0 -> 1.0
        onload: audioClipLoaded,
        onloaderror: (id, errToLoad) => {
          console.log(id, errToLoad);
        },
      });
    });
  }

  initVideoPlayer() {
    // console.log('initVideoPlayer');
    const self = this;
    this.videoPlayer = new YT.Player('player', {
      height: '100%',
      // width: '100%',
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
      this.props.getVideoProgress(currentVideoProgress);

      // When the user back the video.
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
        const url = this.nextAudioClip.url
        if (this.nextAudioClip.type === 'inline') {
          console.log('### INLINE ###', url);
          this.playAudioClip(url, currentVideoProgress);
        } else {
          console.log('### EXTENDED', url);
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
  }

  componentDidMount() {
    this.fetchAudioClips();
  }

  render() {
    return (<div id="player" />);
  }
}

export default VideoPlayer;
