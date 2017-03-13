import React, { Component } from 'react';
import { Howl } from 'howler';
import {
  convertISO8601ToSeconds,
  convertSecondsToEditorFormat,
} from '../../shared/helperFunctions';

const conf = require('./../../shared/config')();

class VideoPlayerAT extends Component {
  constructor(props) {
    super(props);
    this.watcher = null;
    this.videoPlayer = null;
    this.videoId = props.videoId;
    this.audioClips = [];
    this.audioClipsLength = 0;
    this.nextAudioClip = null;
    this.initVideoPlayer = this.initVideoPlayer.bind(this);
    this.videoDurationInSeconds = -1;
  }

  getVideoDuration() {
    const url = `${conf.youTubeApiUrl}/videos?id=${this.videoId}&part=contentDetails&key=${conf.youTubeApiKey}`;
    fetch(url)
    .then(response => response.json())
    .then((data) => {
      this.videoDurationInSeconds = convertISO8601ToSeconds(data.items[0].contentDetails.duration);
      this.props.updateState({
        videoDurationInSeconds: this.videoDurationInSeconds,
        videoDurationInEditorFormat: convertSecondsToEditorFormat(convertISO8601ToSeconds(data.items[0].contentDetails.duration)),
      });
    });
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
    if (videoData.audio_descriptions) {
      const clips = videoData.audio_descriptions['1'].clips;
      const clipsIds = Object.keys(clips);
      clipsIds.forEach((id) => {
        const obj = clips[id];
        console.log(obj)
        obj.url = `${conf.audioClipsUploadsPath}${obj.file_path}/${obj.file_name}`;
        this.audioClips.push(obj);
      });
      this.audioClipsLength = this.audioClips.length;
      this.preLoadAudioClips();
    } else {
      this.initVideoPlayer();
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

    // console.log(this.audioClips);
    // Caching all audio clips???
    this.audioClips.forEach((audioObj) => {
      console.log('CREATE', audioObj.url);
      const sound = new Howl({
        src: [audioObj.url],
        buffer: false,
        loop: false,
        // preload: false,
        volume: 1.0, // 0.0 -> 1.0
        onload: audioClipLoaded,
        // onloaderror: (id, errToLoad) => {
        //   console.log('Error loading audio', id, errToLoad);
        // },
      });
    });
  }

  initVideoPlayer() {
    // console.log('initVideoPlayer');
    const self = this;
    this.props.updateState({
      videoPlayer: new YT.Player('playerAT', {
        height: '100%',
        // width: '100%',
        videoId: this.videoId,
        events: {
          onReady: onVideoPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      })
    });
        // player.playVideo():Void
        // player.pauseVideo():Void
        // player.stopVideo():Void
        // player.seekTo(seconds:Number, allowSeekAhead:Boolean):Void

    function onPlayerStateChange(newState) {
      const videoState = {
        '-1': 'unstarted',
        '0': 'ended',
        '1': 'playing',
        '2': 'paused',
        '3': 'buffering',
        '5': 'video cued',
      }
      // console.log('Video player new state', videoState[newState.data.toString()])
    }

    function onVideoPlayerReady() {
      console.log('YouTube video player ready. Lets call the watcher');
      self.getVideoDuration();
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
      currentVideoProgress = this.props.getState().videoPlayer.getCurrentTime();
      this.props.updateState({
        playheadPosition: 731 * (currentVideoProgress / this.videoDurationInSeconds),
      })

      this.props.setCurrentVideoTime(currentVideoProgress);

      // When the user back the video.
      if (Math.abs(currentVideoProgress - previousTime) > 0.055) {
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
        if (this.nextAudioClip.playback_type === 'inline') {
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
    }, 50);
  }

  playAudioClip(url, currentVideoProgress, callback = () => {}) {
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

  componentWillUnmount() {
    clearInterval(this.watcher);
  }

  render() {
    return (<div id="playerAT" />);
  }
}

export default VideoPlayerAT;
