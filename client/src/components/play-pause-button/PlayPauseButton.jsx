import React from 'react';

const PlayPauseButton = (props) => {
  function playVideo() {
    props.videoPlayer.playVideo();
    props.pauseAudioClips();
  }

  function pauseVideo() {
    props.videoPlayer.pauseVideo();
    props.pauseAudioClips();
  }

  const id = props.videoState === 1 ? 'pause-button' : 'play-button';
  const onClick = props.videoState === 1 ? pauseVideo : playVideo;
  const label = props.videoState === 1 ? 'pause' : 'play';
  const action = props.videoState === 1 ? 'pause' : 'play';


  return (
    <div id="play-pause-button">
      <button aria-label={label} autoFocus id={id} onClick={onClick} accessKey="p">
        <i className={`fa fa-${action}`} aria-hidden="true" />
      </button>
    </div>
  );
};

export default PlayPauseButton;
