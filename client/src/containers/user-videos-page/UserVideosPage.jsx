import React, { Component } from 'react';
import VideoCard from '../../components/video-card/VideoCard.jsx';
import Button from '../../components/button/Button.jsx';
import Spinner from '../../components/spinner/Spinner.jsx';

import {
  ourFetch,
  convertTimeToCardFormat,
  convertViewsToCardFormat,
  convertISO8601ToSeconds,
  convertSecondsToCardFormat,
} from '../../shared/helperFunctions';

const conf = require('../../shared/config')();

class UserVideosPage extends Component {
  constructor(props) {
    super(props);
    this.userId = this.props.params.userId;
    this.userVideosArray = [];
    this.youTubeVideosIds = [];
    this.youDescribeVideosIds = [];
    this.youTubeVideosArray = [];
    this.state = {
      videoComponents: [],
      userName: '',
    };
    this.closeSpinner = this.closeSpinner.bind(this);
  }

  componentDidMount() {
    this.getUserInfo();
    this.getVideos();
  }

  getUserInfo() {
    const url = (`${conf.apiUrl}/users/${this.userId}`);
    ourFetch(url)
    .then((response) => {
      if (response.result) {
        const user = response.result;
        this.setState({ userName: user.name });
      }
    })
  }

  getVideos() {
    let youTubeIds;
    const url = (`${conf.apiUrl}/videos/user/${this.userId}`);
    ourFetch(url)
    .then((response) => {
      this.userVideosArray = response.result;
      for (let i = 0; i < this.userVideosArray.length; i += 1) {
        this.youTubeVideosIds.push(this.userVideosArray[i].youtube_id);
        this.youDescribeVideosIds.push(this.userVideosArray[i]._id);
      }
      youTubeIds = this.youTubeVideosIds.join(',');
    })
    .then(() => {
      const url = `${conf.youTubeApiUrl}/videos?id=${youTubeIds}&part=contentDetails,snippet,statistics&key=${conf.youTubeApiKey}`;
      ourFetch(url)
      .then(data => {
        this.youTubeVideosArray = data;
        this.parseResponseData();
      });
    });
  }

  parseResponseData() {
    const videoComponents = [];
    for (let i = 0; i < this.youTubeVideosArray.items.length; i += 1) {
      const item = this.youTubeVideosArray.items[i];
      const youDescribeVideoId = this.youDescribeVideosIds[i];
      const youTubeId = item.id;
      const thumbnail = item.snippet.thumbnails.medium;
      const duration = convertSecondsToCardFormat(convertISO8601ToSeconds(item.contentDetails.duration));
      const title = item.snippet.title;
      const author = item.snippet.channelTitle;
      const views = convertViewsToCardFormat(Number(item.statistics.viewCount));
      const publishedAt = new Date(item.snippet.publishedAt);
      const now = Date.now();
      const time = convertTimeToCardFormat(Number(now - publishedAt));

      videoComponents.push(
        <VideoCard
          key={youTubeId}
          youTubeId={youTubeId}
          thumbnailMediumUrl={thumbnail.url}
          duration={duration}
          title={title}
          author={author}
          views={views}
          time={time}
          buttons="edit"
          getAppState={this.props.getAppState}
        />
      );
    }
    this.closeSpinner();
    this.setState({ videoComponents });
  }

  closeSpinner() {
    const spinner = document.getElementsByClassName('spinner')[0];
    spinner.style.display = 'none';
  }

  render() {
    return (
      <div id="user-videos-page" title="User described videos page">

        <header role="banner" className="w3-container w3-indigo">
          <h2>Described videos by {this.state.userName}</h2>
        </header>

        <Spinner />

        <main role="main" className="w3-row">
          {this.state.videoComponents}
        </main>

        <div id="load-more" className="w3-margin-top w3-center w3-padding-32">
          {/*<Button title="Load more videos" color="w3-indigo" text="Load more" onClick={this.loadMoreResults} />*/}
        </div>

      </div>
    );
  }
}

export default UserVideosPage;
