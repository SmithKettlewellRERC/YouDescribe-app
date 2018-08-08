import React, { Component } from 'react';
import { browserHistory } from 'react-router';
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

const { detect } = require('detect-browser');
const conf = require('../../shared/config')();

class Home extends Component {
  constructor(props) {
    super(props);
    this.dbResultArray = [];
    this.state = {
      searchQuery: '',
      videos: [],
    };
    this.currentPage = 1;
    this.fetchingVideosToHome = this.fetchingVideosToHome.bind(this);
    this.loadMoreResults = this.loadMoreResults.bind(this);
    this.closeSpinner = this.closeSpinner.bind(this);
  }

  componentDidMount() {
    const browser = detect();
    console.log('Browser:', browser.name);
    if (browser.name !== 'chrome' && browser.name !== 'firefox') {
      browserHistory.push(`/unsupported-browser`);
    } else {
      document.getElementById('navbar').focus();
      document.title = this.props.translate('YouDescribe - Audio Description for YouTube Videos');
      this.fetchingVideosToHome();
    }
  }

  fetchingVideosToHome() {
    const youDescribeVideosIds = [];
    const youTubeVideosIds = [];
    let ids;
    const url = (`${conf.apiUrl}/videos?page=${this.currentPage}`);
    ourFetch(url)
      .then((response) => {
        this.dbResultArray = response.result;
        for (let i = 0; i < this.dbResultArray.length; i += 1) {
          youTubeVideosIds.push(this.dbResultArray[i].youtube_id);
          youDescribeVideosIds.push(this.dbResultArray[i]._id);
        }
        ids = youTubeVideosIds.join(',');
      })
      .then(() => {
        const url = `${conf.youTubeApiUrl}/videos?id=${ids}&part=contentDetails,snippet,statistics&key=${conf.youTubeApiKey}`;
        ourFetch(url)
        .then(data => {
          this.parseFetchedData(data, youDescribeVideosIds)
        });
      });
  }

  parseFetchedData(data, youDescribeVideosIds) {
    const videos = this.state.videos.slice();
    for (let i = 0; i < data.items.length; i += 1) {
      const item = data.items[i];
      if (!item.statistics || !item.snippet) {
        continue;
      }
      const _id = youDescribeVideosIds[i];
      const youTubeId = item.id;
      const thumbnailMedium = item.snippet.thumbnails.medium;
      const duration = convertSecondsToCardFormat(convertISO8601ToSeconds(item.contentDetails.duration));
      const title = item.snippet.title;
      const description = item.snippet.description;
      const author = item.snippet.channelTitle;
      const views = convertViewsToCardFormat(Number(item.statistics.viewCount));
      const publishedAt = new Date(item.snippet.publishedAt);

      const now = Date.now();
      const time = convertTimeToCardFormat(Number(now - publishedAt));

      videos.push(
        <VideoCard
          translate={this.props.translate}
          key={_id}
          youTubeId={youTubeId}
          description={description}
          thumbnailMediumUrl={thumbnailMedium.url}
          duration={duration}
          title={title}
          author={author}
          views={views}
          time={time}
          buttons="none"
        />);
    }

    this.closeSpinner();
    this.setState({ videos });
  }

  handleChange(event) {
    this.setState({ searchQuery: event.target.value });
  }

  loadMoreResults() {
    this.currentPage += 1;
    this.fetchingVideosToHome();
  }

  closeSpinner() {
    const spinner = document.getElementsByClassName('spinner')[0];
    spinner.style.display = 'none';
  }

  // displayed on page
  render() {
    let YDloadMoreButton = (
      <div className="w3-margin-top w3-center load-more w3-hide">
        <Button title={this.props.translate('Load more videos')} color="w3-indigo" text="Load more" onClick={this.loadMoreResults} />
      </div>
    );

    if (this.state.videos.length > 20) {
      YDloadMoreButton = (
        <div className="w3-margin-top w3-center load-more">
          <Button title={this.props.translate('Load more videos')} color="w3-indigo" text="Load more" onClick={this.loadMoreResults} />
        </div>
      );
    }

    return (
      <main id="home" title="YouDescribe home page">

        <header role="banner" className="w3-container w3-indigo">
          <h2 id="home-heading" tabIndex="-1">{this.props.translate('RECENT DESCRIPTIONS')}</h2>
        </header>

        <Spinner translate={this.props.translate} />

        <div className="w3-row container">
          {this.state.videos}
        </div>

        {YDloadMoreButton}

      </main>
    );
  }
}

export default Home;
