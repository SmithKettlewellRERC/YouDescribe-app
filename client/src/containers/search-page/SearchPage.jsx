import React, { Component } from 'react';
import { browserHistory } from 'react-router';
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

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoAlreadyOnYD: [],
      videoNotOnYD: [],
    };

    // all the video Ids that we found in YD database
    this.videoIds = null;
    // the video database that we found in YD database
    this.videoDbResonseVideos = null;

    //binding function to this
    this.loadMoreVideosFromYD = this.loadMoreVideosFromYD.bind(this);
    this.loadMoreVideosFromYT = this.loadMoreVideosFromYT.bind(this);
    this.getSearchResultsFromYdAndYt = this.getSearchResultsFromYdAndYt.bind(this);

    this.currentPageNumber = 1;
  }

  componentDidMount() {
    this.getSearchResultsFromYdAndYt();
  }

  componentWillReceiveProps() {
    setTimeout(() => {
      this.currentPageNumber = 1;
      this.getSearchResultsFromYdAndYt();
    }, 0);
  }

  getSearchResultsFromYdAndYt(page = 1) {
    const value = this.props.location.query.q;
    const q = encodeURIComponent(value);
    const serverVideoIds = [];
    const url = `${conf.apiUrl}/videos/search?q=${q}&page=${page}`;
    ourFetch(url)
    .then((response) => {
      this.videoDbResonseVideos = response.result;
      for (let i = 0; i < this.videoDbResonseVideos.length; i += 1) {
        serverVideoIds.push(this.videoDbResonseVideos[i].youtube_id);
      }

      this.videoIds = serverVideoIds.join(',');
    })
    .then(() => {
      if (page === 1) {
        this.fetchAndRenderVideoFromYD(this.videoDbResonseVideos)
        .then(() => this.fetchAndRenderVideoFromYT(q, this.videoIds));
      } else {
        this.fetchAndRenderVideoFromYD(this.videoDbResonseVideos, page);
      }
    });
  }

  fetchAndRenderVideoFromYD(dbResponse, page = 1) {
    const urlfForYT = `${conf.youTubeApiUrl}/videos?id=${this.videoIds}&part=contentDetails,snippet,statistics&key=${conf.youTubeApiKey}`;
    return ourFetch(urlfForYT)
    .then((videoDataFromYDdatabase) => {
      const videoFromYDdatabase = videoDataFromYDdatabase.items;
      if (page === 1) {
        this.setState({
          videoAlreadyOnYD: [],
        }, () => {
          this.renderVideosFromYD(dbResponse, videoFromYDdatabase);
        });
      } else {
        this.renderVideosFromYD(dbResponse, videoFromYDdatabase);
      }
    });
  }

  fetchAndRenderVideoFromYT(q, ids) {
    let idsYTvideo;
    const urlForYD = `${conf.youTubeApiUrl}/search?part=snippet&q=${q}&maxResults=50&key=${conf.youTubeApiKey}`;
    ourFetch(urlForYD)
    .then((videos) => {
      const videoFoundOnYTIds = [];
      for (let i = 0; i < videos.items.length; i += 1) {
        const temp = videos.items[i].id.videoId;
        if (!(ids.indexOf(temp) > -1)) {
          videoFoundOnYTIds.push(videos.items[i].id.videoId);
        }
      }
      idsYTvideo = videoFoundOnYTIds.join(',');
    })
    .then(() => {
      const urlForYT = `${conf.youTubeApiUrl}/videos?id=${idsYTvideo}&part=contentDetails,snippet,statistics&key=${conf.youTubeApiKey}`;
      ourFetch(urlForYT)
        .then((videoFromYoutubes) => {
          const videoFromYoutube = videoFromYoutubes.items;
          this.setState({
            videoNotOnYD: [],
          }, () => {
            this.renderVideosFromYT(videoFromYoutube);
          });
        });
    });
  }

  loadMoreVideosFromYD() {
    this.currentPageNumber += 1;
    this.getSearchResultsFromYdAndYt(this.currentPageNumber);
  }

  loadMoreVideosFromYT() {
    alert('Working in progress...');
  }

  renderVideosFromYD(dbResponse, videoFromYDdatabase) {
    const videoAlreadyOnYD = this.state.videoAlreadyOnYD.slice();
    for (let i = 0; i < videoFromYDdatabase.length; i += 1) {
      const item = videoFromYDdatabase[i];
      const _id = dbResponse[i]._id;
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

      videoAlreadyOnYD.push(
        <VideoCard
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
          getAppState={this.props.getAppState}
        />);
    }
    this.setState({
      videoAlreadyOnYD,
    });
  }

  renderVideosFromYT(videoFromYoutube) {
    const videoNotOnYD = this.state.videoNotOnYD.slice();
    for (let i = 0; i < videoFromYoutube.length; i += 1) {
      const item = videoFromYoutube[i];
      const youTubeId = item.id;
      const thumbnailMedium = item.snippet.thumbnails.medium;
      const duration = convertSecondsToCardFormat(convertISO8601ToSeconds(item.contentDetails.duration));
      const title = item.snippet.title;
      const description = item.snippet.description;
      const author = item.snippet.channelTitle;
      const views = convertViewsToCardFormat(Number(item.statistics.viewCount));
      const publishedAt = new Date(item.snippet.publishedAt);
      // let describer;

      const now = Date.now();
      const time = convertTimeToCardFormat(Number(now - publishedAt));

      videoNotOnYD.push(
        <VideoCard
          key={i}
          youTubeId={youTubeId}
          description={description}
          thumbnailMediumUrl={thumbnailMedium.url}
          duration={duration}
          title={title}
          author={author}
          views={views}
          time={time}
          buttons="upvote-describe"
          getAppState={this.props.getAppState}
          votes={0}
        />);
    }

    this.setState({
      videoNotOnYD,
    });
  }

  render() {
    // const searchTerm = `"${this.props.location.query.q}"`;
    // <h2>Described videos matching {searchTerm}</h2>
    return (
      <div id="search-page" title="YouDescribe search results page">

        <div className="w3-container w3-indigo">
          <h2>Described videos</h2>
        </div>

        <main>
          <div id="on-yd" className="w3-row">
            {this.state.videoAlreadyOnYD}
          </div>
        </main>

          <div id="load-more" className="w3-margin-top w3-center">
            <Button title="Load more videos" color="w3-indigo" text="Load more" onClick={this.loadMoreVideosFromYD} />
          </div>

        <div className="w3-container w3-indigo">
          <h2>Non-described videos</h2>
        </div>

        <main>
          <div className="w3-row">
            {this.state.videoNotOnYD}
          </div>
        </main>

        <div id="load-more" className="w3-margin-top w3-center">
          {/*<Button title="Load more videos" color="w3-indigo" text="Load more" onClick={this.loadMoreVideosFromYT} />*/}
        </div>
      </div>
    );
  }
}

export default SearchPage;
