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
  }

  getSearchResultsFromYdAndYt() {
    const value = this.props.location.query.q;
    const q = encodeURIComponent(value);
    const serverVideoIds = [];
    let ids;
    let dbResponse;
    let videoFromYDdatabase = [];
    const videoFoundOnYTIds = [];
    let videoFromYoutube = [];
    let idsYTvideo;

    ourFetch(`${conf.apiUrl}/videos/search?q=${q}`)
    .then((response) => {
      dbResponse = response.result;
      for (let i = 0; i < dbResponse.length; i += 1) {
        serverVideoIds.push(dbResponse[i].youtube_id);
      }
      ids = serverVideoIds.join(',');
    })
    .then(() => {
      const urlfForYT = `${conf.youTubeApiUrl}/videos?id=${ids}&part=contentDetails,snippet,statistics&key=${conf.youTubeApiKey}`;
      ourFetch(urlfForYT)
      .then((videoDataFromYDdatabase) => {
        videoFromYDdatabase = videoDataFromYDdatabase.items;
        this.setState({
          videoAlreadyOnYD: [],
        }, () => {
          this.renderVideosFromYD(dbResponse, videoFromYDdatabase);
        });
      })
      .then(() => {
        const urlForYD = `${conf.youTubeApiUrl}/search?part=snippet&q=${q}&maxResults=50&key=${conf.youTubeApiKey}`;
        ourFetch(urlForYD)
          .then((videos) => {
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
                videoFromYoutube = videoFromYoutubes.items;
                this.setState({
                  videoNotOnYD: [],
                }, () => {
                  this.renderVideosFromYT(videoFromYoutube);
                });
              });
          });
      });
    });
  }

  upVoteClick(e, i, id, description, thumbnailMediumUrl, title, author, views, time) {
    if (e.target.className === 'w3-btn w3-white w3-text-indigo w3-left' ||
      e.target.className === 'fa fa-heart') {
      if (e.target.className === 'fa fa-heart') e.target.parentElement.className = 'w3-btn w3-white w3-text-red w3-left';
      else e.target.className = 'w3-btn w3-white w3-text-red w3-left';
    }
    const body = JSON.stringify({
      title,
      id,
    });
    ourFetch(`${conf.apiUrl}/wishlist`, true, {
      method: 'post',
      body,
    })
    .then((res) => {
      const newCount = res.votes;
      const newState = this.state.videoNotOnYD.slice();
      newState[i] = (
        <VideoCard
          key={i}
          id={id}
          description={description}
          thumbnailMediumUrlUrl={thumbnailMediumUrl.url}
          title={title}
          author={author}
          views={views}
          time={time}
          buttons='on'
          vote_count={newCount}
          upVoteClick={() => this.upVoteClick(i, id, description, thumbnailMediumUrl, title, author, views, time, newCount)}
          describeClick={() => this.describeClick(id)}
        />
    );
      this.setState({
        videoNotOnYD: newState,
      });
    });
  }

  renderVideosFromYD(dbResponse, videoFromYDdatabase) {
    const videoAlreadyOnYD = this.state.videoAlreadyOnYD.slice();
    for (let i = 0; i < videoFromYDdatabase.length; i += 1) {
      const item = videoFromYDdatabase[i];
      const id = item.id;
      const thumbnailMedium = item.snippet.thumbnails.medium;
      const duration = convertSecondsToCardFormat(convertISO8601ToSeconds(item.contentDetails.duration));
      const title = item.snippet.title;
      const description = item.snippet.description;
      const author = item.snippet.channelTitle;
      const views = convertViewsToCardFormat(Number(item.statistics.viewCount));
      const publishedAt = new Date(item.snippet.publishedAt);

      // let describer;
      // dbResponse.forEach((elem) => {
      //   console.log(elem);
      //   console.log(elem._id);
      //   console.log(id);
      //   if (elem.youtube_id === id) describer = `${elem.audio_descriptions[1].legacy_author_name} (describer)`;
      // });

      const now = Date.now();
      const time = convertTimeToCardFormat(Number(now - publishedAt));

      videoAlreadyOnYD.push(
        <VideoCard
          key={i}
          id={id}
          description={description}
          thumbnailMediumUrl={thumbnailMedium.url}
          duration={duration}
          title={title}
          author={author}
          views={views}
          time={time}
          buttons="off"
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
      const id = item.id;
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
          id={id}
          description={description}
          thumbnailMediumUrl={thumbnailMedium.url}
          duration={duration}
          title={title}
          author={author}
          views={views}
          time={time}
          buttons="on"
          getAppState={this.props.getAppState}

          votes={0}
        />);
    }

    this.setState({
      videoNotOnYD,
    });
  }

  componentDidMount() {
    this.getSearchResultsFromYdAndYt();
  }

  componentWillReceiveProps() {
    setTimeout( () => {
      this.getSearchResultsFromYdAndYt();
    }, 0);
  }

  loadMoreResults() {
    alert('Working in progress...');
  }

  render() {
    const searchTerm = `"${this.props.location.query.q}"`;
    return (
      <div id="search-page" title="YouDescribe search results page">

        <div className="w3-container w3-indigo">
          <h2>Videos with audio descriptions matching {searchTerm}</h2>
        </div>

        <main>
          <div id="on-yd" className="w3-row">
            {this.state.videoAlreadyOnYD}
          </div>
        </main>

          <div id="load-more" className="w3-margin-top w3-center">
            <Button title="Load more videos" color="w3-indigo" text="Load more" onClick={this.loadMoreResults} />
          </div>

        <div className="w3-container w3-indigo">
          <h2>Videos without audio descriptions matching {searchTerm}</h2>
        </div>

        <main>
          <div className="w3-row">
            {this.state.videoNotOnYD}
          </div>
        </main>

        <div id="load-more" className="w3-margin-top w3-center">
          <Button title="Load more videos" color="w3-indigo" text="Load more" onClick={this.loadMoreResults} />
        </div>
      </div>
    );
  }
}

export default SearchPage;
