import React, { Component } from 'react';

import VideoPlayerPlay from '../../components/video-player/VideoPlayerPlay.jsx';

class VideoPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentVideoTime: 0,
    };

    this.updateState = this.updateState.bind(this);
    this.getCurrentVideoTime = this.getCurrentVideoTime.bind(this);
  }

  getCurrentVideoTime(currentVideoTime) {
    if (this.state.currentVideoTime !== currentVideoTime) {
      this.setState({ currentVideoTime });
    }
  }

  updateState(newState) {
    this.setState(newState);
  }

  render() {
    return (
      <div id="video-player">
        <div id="video" className="w3-center">
          <VideoPlayerPlay
            videoId={this.props.params.videoId}
            updateState={this.updateState}
            getCurrentVideoTime={this.getCurrentVideoTime}
          />
        </div>
      </div>
    );
  }
}

export default VideoPage;
