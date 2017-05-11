import React, { Component } from 'react';
import VideoPlayerAccessibleSeekbar from '../video-player-accessible-seekbar/VideoPlayerAccessibleSeekbar.jsx';
import VolumeBalancer from '../volume-balancer/VolumeBalancer.jsx';
import AudioDescriptionSelector from '../audio-description-selector/AudioDescriptionSelector.jsx';
import PlayPauseButton from '../play-pause-button/PlayPauseButton.jsx';
import VideoTimer from '../video-timer/VideoTimer.jsx';

const VideoPlayerControls = (props) => {
  return (
    <div id="video-player-controls">
      <VideoPlayerAccessibleSeekbar updateState={props.updateState} {...props} />

      <div className="w3-row">
        <div>
          <PlayPauseButton {...props} />
          <VolumeBalancer updateState={props.updateState} />
          <VideoTimer {...props} />
        </div>

        {/*<div className="w3-col l6 m6">
          <AudioDescriptionSelector
            audioDescriptionsIdsUsers={props.audioDescriptionsIdsUsers}
            selectedAudioDescriptionId={props.selectedAudioDescriptionId}
            setAudioDescriptionActive={props.setAudioDescriptionActive}
            changeAudioDescription={props.changeAudioDescription}
            videoId={props.videoId}
            getAppState={props.getAppState}
          />
        </div>*/}

      </div>

    </div>
  );
}

export default VideoPlayerControls;
