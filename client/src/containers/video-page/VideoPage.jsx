import React, { Component } from 'react';

import VideoPlayer from '../../components/video-player/VideoPlayer.jsx';

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
      <div id="video-player" title="YouDescribe video player page">
        <div id="video" className="w3-center">
          <VideoPlayer
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
