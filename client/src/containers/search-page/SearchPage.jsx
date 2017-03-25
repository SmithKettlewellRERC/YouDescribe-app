import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import VideoCard from '../../components/video-card/VideoCard.jsx';
import Button from '../../components/button/Button.jsx';
import {
  ourFetch,
  convertTimeToCardFormat,
  convertViewsToCardFormat,
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
    this.dbResponse = null;

    //binding function to this
    this.loadMoreVideosFromYD = this.loadMoreVideosFromYD.bind(this);
    this.loadMoreVideosFromYT = this.loadMoreVideosFromYT.bind(this);

    this.currentPage = 1;
  }

  componentDidMount() {
    this.getSearchResultsFromYdAndYt();
  }

  componentWillReceiveProps() {
    setTimeout(() => {
      this.getSearchResultsFromYdAndYt();
    }, 0);
  }

  getSearchResultsFromYdAndYt() {
    const value = this.props.location.query.q;
    const q = encodeURIComponent(value);
    const serverVideoIds = [];

    ourFetch(`${conf.apiUrl}/videos/search?q=${q}`)
    .then((response) => {
      this.dbResponse = response.result;
      for (let i = 0; i < this.dbResponse.length; i += 1) {
        serverVideoIds.push(this.dbResponse[i].youtube_id);
      }

      this.videoIds = serverVideoIds.join(',');
    })
    .then(() => {
      this.fetchAndRenderVideoFromYD(this.dbResponse)
      .then(() => this.fetchAndRenderVideoFromYT(q, this.videoIds));
    });
  }

  fetchAndRenderVideoFromYD(dbResponse, page = 1) {
    const urlfForYT = `${conf.youTubeApiUrl}/videos?id=${this.videoIds}&part=snippet,statistics&key=${conf.youTubeApiKey}`;
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
      const urlForYT = `${conf.youTubeApiUrl}/videos?id=${idsYTvideo}&part=snippet,statistics&key=${conf.youTubeApiKey}`;
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

  upVoteClick(e, i, id, description, thumbnailMediumUrl, title, author, views, time) {
    if (e.target.className === 'w3-btn w3-white w3-text-indigo w3-left' ||
      e.target.className === 'fa fa-heart') {
      if (e.target.className === 'fa fa-heart') e.target.parentElement.className = 'w3-btn w3-white w3-text-red w3-left';
      else e.target.className = 'w3-btn w3-white w3-text-red w3-left';
    }
    const body = JSON.stringify({
        title: title,
        id: id,
    });
    ourFetch(`${conf.apiUrl}/wishlist`, true, {
      method: 'post',
      body: body,
    })
    .then((res) => {
      let new_count = res.votes;
      let newState = this.state.videoNotOnYD.slice();
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
            vote_count={new_count}
            upVoteClick={() => this.upVoteClick(i, id, description, thumbnailMediumUrl, title, author, views, time, new_count)}
            describeClick={()=> this.describeClick(id)}
          />
      )
      this.setState({
        videoNotOnYD: newState,
      })
    })
  }

  loadMoreVideosFromYD() {
    alert('Working in progress...');
  }

  loadMoreVideosFromYT() {
    alert('Working in progress...');
  }

  renderVideosFromYD(dbResponse, videoFromYDdatabase) {
    const videoAlreadyOnYD = this.state.videoAlreadyOnYD.slice();
    for (let i = 0; i < videoFromYDdatabase.length; i += 1) {
      const item = videoFromYDdatabase[i];
      const _id = dbResponse[i]._id;
      const id = item.id;
      const thumbnailMedium = item.snippet.thumbnails.medium;
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
          key={_id}
          id={id}
          description={description}
          thumbnailMediumUrl={thumbnailMedium.url}
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
          title={title}
          author={author}
          views={views}
          time={time}
          buttons="on"
          getAppState={this.props.getAppState}

          votes={0}
        />
      );
    }

    this.setState({
      videoNotOnYD,
    });
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
            <Button title="Load more videos" color="w3-indigo" text="Load more" onClick={this.loadMoreVideosFromYD} />
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
          <Button title="Load more videos" color="w3-indigo" text="Load more" onClick={this.loadMoreVideosFromYT} />
        </div>
      </div>
    );
  }
}

export default SearchPage;
