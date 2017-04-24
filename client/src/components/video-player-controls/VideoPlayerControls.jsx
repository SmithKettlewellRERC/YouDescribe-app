import React from 'react';
import VideoPlayerAccessibleSeekbar from '../video-player-accessible-seekbar/VideoPlayerAccessibleSeekbar.jsx';
import VolumeBalancer from '../volume-balancer/VolumeBalancer.jsx';
import AudioDescriptionSelector from '../audio-description-selector/AudioDescriptionSelector.jsx';

const VideoPlayerControls = (props) => {
  function playVideo() {
    props.videoPlayer.playVideo();
    props.pauseAudioClips();
  }

  function pauseVideo() {
    props.videoPlayer.pauseVideo();
    props.pauseAudioClips();
  }

  const PlayPauseButton = () => {
    const id = props.videoState === 1 ? 'pause-button' : 'play-button';
    const onClick = props.videoState === 1 ? pauseVideo : playVideo;
    const title = props.videoState === 1 ? 'pause button' : 'play button';
    const action = props.videoState === 1 ? 'pause' : 'play';

    return (
      <button id={id} onClick={onClick} title={title} accessKey="p">
        <i className={`fa fa-${action}`} aria-hidden="true"></i>
      </button>
    );
  };

  return (
    <div id="video-player-controls">
      <VideoPlayerAccessibleSeekbar updateState={props.updateState} {...props} />

      <div className="w3-row">
        <div className="w3-col l6 m6">
          <PlayPauseButton />
          <VolumeBalancer updateState={props.updateState} />
        </div>
        <div className="w3-col l6 m6">
          <AudioDescriptionSelector
            audioDescriptionsIdsUsers={props.audioDescriptionsIdsUsers}
            selectedAudioDescriptionId={props.selectedAudioDescriptionId}
            setAudioDescriptionActive={props.setAudioDescriptionActive}
            changeAudioDescription={props.changeAudioDescription}
            videoId={props.videoId}
            getAppState={props.getAppState}
          />
        </div>
      </div>

    </div>
  );
};

export default VideoPlayerControls;
