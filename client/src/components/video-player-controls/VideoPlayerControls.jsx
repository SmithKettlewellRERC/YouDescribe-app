import React, { Component } from "react";
import VideoPlayerAccessibleSeekbar from "../video-player-accessible-seekbar/VideoPlayerAccessibleSeekbar.jsx";
import VolumeBalancer from "../volume-balancer/VolumeBalancer.jsx";
import AudioDescriptionSelector from "../audio-description-selector/AudioDescriptionSelector.jsx";
import PlayPauseButton from "../play-pause-button/PlayPauseButton.jsx";
import VideoTimer from "../video-timer/VideoTimer.jsx";
import FullscreenButton from "../fullscreen-button/FullscreenButton.jsx";

const VideoPlayerControls = (props) => {
  return (
    <div id={props.className || "video-player-controls"}>
      <div className="">
        <div>
          <VolumeBalancer updateState={props.updateState} />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerControls;
