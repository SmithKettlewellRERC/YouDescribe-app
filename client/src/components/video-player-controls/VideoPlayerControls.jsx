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

  let playPauseButton = (
    <button id="play-button" onClick={playVideo} accessKey="p">
      <i className="fa fa-play" aria-hidden="true"></i>
    </button>
  );

  if (props.videoState === 1) {
    playPauseButton = (
      <button id="pause-button" onClick={pauseVideo} accessKey="s">
        <i className="fa fa-pause" aria-hidden="true"></i>
      </button>
    );
  }
  return (
    <div id="video-player-controls">
      <VideoPlayerAccessibleSeekbar updateState={props.updateState} {...props} />

      <div className="w3-row">
        <div className="w3-col l6 m6">
          {playPauseButton}
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
