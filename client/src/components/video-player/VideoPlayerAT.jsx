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
    this.videoId = props.videoId;
    this.audioClipsLength = 0;
    this.nextAudioClip = null;
    this.initVideoPlayer = this.initVideoPlayer.bind(this);
    this.videoDurationInSeconds = -1;
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
          this.props.getState().videoPlayer.pauseVideo();
          this.playAudioClip(url, () => {
            this.props.getState().videoPlayer.playVideo();
          });
        }
        this.getNextAudioClip(currentVideoProgress);
      }
    }, 50);
  }

  playAudioClip(url, callback = () => {}) {
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
    // this.fetchAudioClips();
    // this.parseVideoData();
  }

  componentWillUnmount() {
    clearInterval(this.watcher);
  }

  render() {
    return ();
  }
}

export default VideoPlayerAT;
