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
    this.closeSpinnerAtTop = this.closeSpinnerAtTop.bind(this);
    this.openSpinnerAtTop = this.openSpinnerAtTop.bind(this);
    this.closeSpinnerAtBottom = this.closeSpinnerAtBottom.bind(this);
    this.openSpinnerAtBottom = this.openSpinnerAtBottom.bind(this);
    this.currentPageNumber = 1;
  }

  componentDidMount() {
    document.title = `YouDescribe - Search Page`;
    document.getElementById('search-page').focus();
    this.getSearchResultsFromYdAndYt();
  }

  componentWillReceiveProps() {
    setTimeout(() => {
      this.openSpinnerAtTop();
      this.openSpinnerAtBottom();
      this.currentPageNumber = 1;
      this.getSearchResultsFromYdAndYt();
    }, 0);
  }

  getSearchResultsFromYdAndYt(page = 1) {
    const value = this.props.location.query.q;
    let q = (value || "").trim();
    if (value.match(/^https:\/\/(?:www\.)?youtube.com\/watch\?(?=v=\w+)(?:\S+)?$/g)) {
      const url = new URL(value);
      q = url.searchParams.get("v");
    }
    const serverVideoIds = [];
    // const url = `${conf.apiUrl}/videos/search?q=${q}&page=${page}`;
    const url = `https://api.youdescribe.org/v1/videos/search?q=${q}&page=${page}`;
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
    alert('Under development');
  }

  renderVideosFromYD(dbResponse, videoFromYDdatabase) {
    const videoAlreadyOnYD = this.state.videoAlreadyOnYD.slice();
    for (let i = 0; i < videoFromYDdatabase.length; i += 1) {
      const item = videoFromYDdatabase[i];
      if (!item.statistics || !item.snippet) {
        continue;
      }
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
          getAppState={this.props.getAppState}
        />);
    }
    this.closeSpinnerAtTop();
    this.setState({
      videoAlreadyOnYD,
    });
  }

  renderVideosFromYT(videoFromYoutube) {
    const videoNotOnYD = this.state.videoNotOnYD.slice();
    for (let i = 0; i < videoFromYoutube.length; i += 1) {
      const item = videoFromYoutube[i];
      if (!item.statistics || !item.snippet) {
        continue;
      }
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
          translate={this.props.translate}
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

    this.closeSpinnerAtBottom();
    this.setState({
      videoNotOnYD,
    });
  }

  closeSpinnerAtTop() {
    const spinner = document.getElementsByClassName('spinner')[0];
    spinner.style.display = 'none';
  }

  openSpinnerAtTop() {
    const spinner = document.getElementsByClassName('spinner')[0];
    spinner.style.display = 'block';
  }

  closeSpinnerAtBottom() {
    const spinner = document.getElementsByClassName('spinner')[1];
    spinner.style.display = 'none';
  }

  openSpinnerAtBottom() {
    const spinner = document.getElementsByClassName('spinner')[1];
    spinner.style.display = 'block';
  }

  render() {
    // const searchTerm = `"${this.props.location.query.q}"`;
    // <h2>Described videos matching {searchTerm}</h2>
    let noVideos;
    let YDloadMoreButton = (
      <div className="w3-margin-top w3-center load-more w3-hide">
        <Button title={this.props.translate('Load more videos')} color="w3-indigo" text={this.props.translate('Load more')} onClick={this.loadMoreVideosFromYD} />
      </div>
    );
    let YTloadMoreButton = (
      <div className="w3-margin-top w3-center load-more w3-hide">
        <Button title={this.props.translate('Load more videos')} color="w3-indigo" text="{this.props.translate('Load more')}" onClick={this.loadMoreVideosFromYT} />
      </div>
    );

    if (!this.state.videoAlreadyOnYD.length) {
      noVideos = <div className="w3-center no-videos">{this.props.translate('There are no described videos that match your search')}</div>;
    }
    if (this.state.videoAlreadyOnYD.length > 20) {
      YDloadMoreButton = (
        <div className="w3-margin-top w3-center load-more">
          <Button title={this.props.translate('Load more videos')} color="w3-indigo" text={this.props.translate('Load more')} onClick={this.loadMoreVideosFromYD} />
        </div>
      );
    }
    if (this.state.videoNotOnYD.length > 20) {
      YTloadMoreButton = (
        <div className="w3-margin-top w3-center load-more">
          <Button title={this.props.translate('Load more videos')} color="w3-indigo" text={this.props.translate('Load more')} onClick={this.loadMoreVideosFromYT} />
        </div>
      );
    }

    return (
      <div id="search-page" title="{this.props.translate('Search results page')}">

        <main>

          <section>
            <header className="w3-container w3-indigo">
              <h2 id="search-page-heading" tabIndex="-1">{this.props.translate('DESCRIBED VIDEOS')}</h2>
            </header>

            <Spinner translate={this.props.translate}/>

            <div id="on-yd" className="w3-row container">
              {this.state.videoAlreadyOnYD}
              {noVideos}
            </div>

            {YDloadMoreButton}
          </section>

          <section>
            <header className="w3-container w3-indigo">
              <h2>{this.props.translate('NON-DESCRIBED VIDEOS')}</h2>
            </header>

            <Spinner translate={this.props.translate}/>

            <div className="w3-row container">
              {this.state.videoNotOnYD}
            </div>

            {YTloadMoreButton}
          </section>

        </main>

      </div>
    );
  }
}

export default SearchPage;
