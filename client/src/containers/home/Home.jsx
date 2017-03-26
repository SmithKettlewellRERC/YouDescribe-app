import React, { Component } from 'react';
import VideoCard from '../../components/video-card/VideoCard.jsx';
import Button from '../../components/button/Button.jsx';
import {
  ourFetch,
  convertTimeToCardFormat,
  convertViewsToCardFormat,
  convertISO8601ToSeconds,
  convertSecondsToCardFormat,
} from '../../shared/helperFunctions';

const conf = require('../../shared/config')();

class Home extends Component {
  constructor(props) {
    super(props);
    this.dbResponse = {};
    this.state = {
      searchQuery: '',
      videos: [],
    };
    this.currentPage = 1;
    this.fetchingVideosToHome = this.fetchingVideosToHome.bind(this);
    this.loadMoreResults = this.loadMoreResults.bind(this);
  }

  componentDidMount() {
    this.fetchingVideosToHome();
  }

  fetchingVideosToHome() {
    const serverVideo_Ids = [];
    const serverVideoIds = [];
    let ids;
    let dbResponse;
    const url = (`${conf.apiUrl}/videos?page=${this.currentPage}`);
    ourFetch(url)
      .then((response) => {
        this.dbResponse = response.result;
        for (let i = 0; i < response.result.length; i += 1) {
          serverVideoIds.push(response.result[i].youtube_id);
          serverVideo_Ids.push(response.result[i]._id);
        }
        ids = serverVideoIds.join(',');
      })
      .then(() => {
        const url = `${conf.youTubeApiUrl}/videos?id=${ids}&part=contentDetails,snippet,statistics&key=${conf.youTubeApiKey}`;
        ourFetch(url)

        .then(data => this.parseFetchedData(data, serverVideo_Ids));
      });
  }

  // functions
  parseFetchedData(data,serverVideo_Ids) {
    const videos = this.state.videos.slice();
    for (let i = 0; i < data.items.length; i += 1) {
      const item = data.items[i];
      const _id = serverVideo_Ids[i];
      const id = item.id;
      const thumbnailMedium = item.snippet.thumbnails.medium;
      const duration = convertSecondsToCardFormat(convertISO8601ToSeconds(item.contentDetails.duration));
      const title = item.snippet.title;
      const description = item.snippet.description;
      const author = item.snippet.channelTitle;
      let describer;
      const views = convertViewsToCardFormat(Number(item.statistics.viewCount));
      const publishedAt = new Date(item.snippet.publishedAt);

      this.dbResponse.forEach((elem) => {
        if (elem._id === id) describer = `${elem.audio_descriptions[1].legacy_author_name} (describer)`;
      });

      const now = Date.now();
      const time = convertTimeToCardFormat(Number(now - publishedAt));

      videos.push(
        <VideoCard
          key={_id}
          id={id}
          description={description}
          thumbnailMediumUrl={thumbnailMedium.url}
          duration={duration}
          title={title}
          author={author}
          describer={describer}
          views={views}
          time={time}
          buttons="off"
          isSignedIn={this.props.isSignedIn}
        />);
    }
    this.setState({ videos });
  }

  handleChange(event) {
    this.setState({ searchQuery: event.target.value });
  }

  loadMoreResults() {
    this.currentPage += 1;
    this.fetchingVideosToHome();
  }

  // displayed on page
  render() {
    return (
      <div id="home" title="YouDescribe home page">

        <header role="banner" title="" className="w3-container w3-indigo">
          <h2>Most popular</h2>
        </header>

        <main className="w3-row">
          {this.state.videos}
        </main>

        <div id="load-more" className="w3-margin-top w3-center w3-padding-32">
          <Button title="Load more videos" color="w3-indigo" text="Load more" onClick={this.loadMoreResults} />
        </div>

      </div>
    );
  }
}

export default Home;
