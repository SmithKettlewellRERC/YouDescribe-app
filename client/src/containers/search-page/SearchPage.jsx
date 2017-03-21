import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import VideoCard from '../../components/video-card/VideoCard.jsx';
import Button from '../../components/button/Button.jsx';

const conf = require('../../shared/config')();

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoAlreadyOnYD: [],
      videoNotOnYD: [],
    };
  }

  getSearchResultsFromYdAndYt(searchValue) {
    if (typeof(searchValue) !== 'string') {
      searchValue = '';
    }
    const q = encodeURIComponent(searchValue);
    const serverVideoIds = [];
    let ids;
    let dbResponse;
    let videoFromYDdatabase = [];
    const videoFoundOnYTIds = [];
    let videoFromYoutube = [];
    let idsYTvideo;

    fetch(`${conf.apiUrl}/videos/search?q=${q}`)
    .then(response => response.json())
    .then((response) => {
      dbResponse = response.result;
      for (let i = 0; i < dbResponse.length; i += 1) {
        serverVideoIds.push(dbResponse[i].youtube_id);
      }
      ids = serverVideoIds.join(',');
    })
    .then(() => {
      const urlfForYT = `${conf.youTubeApiUrl}/videos?id=${ids}&part=snippet,statistics&key=${conf.youTubeApiKey}`;
      fetch(urlfForYT)
      .then(response => response.json())
      .then((videoDataFromYDdatabase) => {
        videoFromYDdatabase = videoDataFromYDdatabase.items;
        this.setState({
          videoAlreadyOnYD: [],
        }, () => {
          this.renderVideoFromYD(dbResponse, videoFromYDdatabase);
        });
      })
      .then(() => {
          const urlForYD = `${conf.youTubeApiUrl}/search?part=snippet&q=${q}&maxResults=50&key=${conf.youTubeApiKey}`;
          fetch(urlForYD)
          .then(response => response.json())
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
            const urlForYT = `${conf.youTubeApiUrl}/videos?id=${idsYTvideo}&part=snippet,statistics&key=${conf.youTubeApiKey}`;
            fetch(urlForYT)
              .then(response => response.json())
              .then((videoFromYoutubes) => {
                videoFromYoutube = videoFromYoutubes.items;
                this.setState({
                  videoNotOnYD: [],
                }, () => {
                  this.renderVideoNotOnYD(videoFromYoutube);
                });
              });
          });
        });
    });
  }

  upVoteClick(e, i, id, description, thumbnailHigh, title, author, views, time) {
    if (e.target.className === 'w3-btn w3-white w3-text-indigo w3-left' ||
      e.target.className === 'fa fa-heart') {
      if (e.target.className === 'fa fa-heart') e.target.parentElement.className = 'w3-btn w3-white w3-text-red w3-left';
      else e.target.className = 'w3-btn w3-white w3-text-red w3-left';
    }
    const body = JSON.stringify({
        title: title,
        id: id,
    });
    fetch(`${conf.apiUrl}/wishlist`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'post',
      body: body,
    })
    .then(res => res.json())
    .then((res) => {
      let new_count = res.result.votes;
      let newState = this.state.videoNotOnYD.slice();
      newState[i] = (
          <VideoCard
            key={i}
            id={id}
            description={description}
            thumbnailHighUrl={thumbnailHigh.url}
            title={title}
            author={author}
            views={views}
            time={time}
            buttons='on'
            vote_count={new_count}
            upVoteClick={() => this.upVoteClick(i, id, description, thumbnailHigh, title, author, views, time, new_count)}
            describeClick={()=> this.describeClick(id)}
          />
      )
      this.setState({
        videoNotOnYD: newState,
      })
    })
  }

  describeClick(id) {
    browserHistory.push('/authoring-tool/' + id)
  }

  renderVideoFromYD(dbResponse, videoFromYDdatabase) {
    const videoAlreadyOnYD = this.state.videoAlreadyOnYD.slice();
    for (let i = 0; i < videoFromYDdatabase.length; i += 1) {
      const item = videoFromYDdatabase[i];
      const id = item.id;
      // const thumbnailDefault = item.snippet.thumbnails.default;
      // const thumbnailMedium = item.snippet.thumbnails.medium;
      const thumbnailHigh = item.snippet.thumbnails.high;
      let title = item.snippet.title;
      const description = item.snippet.description;
      const author = item.snippet.channelTitle;
      let describer;
      let views = item.statistics.viewCount;
      const publishedAt = new Date(item.snippet.publishedAt);

      dbResponse.forEach((elem) => {
        if (elem._id === id) describer = elem.audio_descriptions[1].legacy_author_name;
      });

      const now = Date.now();
      let time = now - publishedAt;
      const year = 31536000000;
      const month = 2629740000;
      const day = 86400000;
      const hour = 3600000;
      const min = 60000;

      if (time >= year) {
        const years = (time / year).toFixed(0);
        years === 1 ? time = `${years} year ago` : time = `${years} years ago`;
      } else if (time >= month) {
        const months = (time / month).toFixed(0);
        months === 1 ? time = `${months} month ago` : time = `${months} months ago`;
      } else if (time >= day) {
        const days = (time / day).toFixed(0);
        days === 1 ? time = `${days} day ago` : time = `${days} days ago`;
      } else if (time >= hour) {
        const hours = (time / hour).toFixed(0);
        hours === 1 ? time = `${hours} hour ago` : time = `${hours} hours ago`;
      } else {
        const minutes = (time / min).toFixed(0);
        minutes === 1 ? time = `${minutes} minutes ago` : time = `${minutes} minutes ago`;
      }

      // if (title.length > 50) title = `${title.slice(0, 50)}...`;
      if (views >= 1000000000) views = `${(views/1000000000).toFixed(1)}B views`;
      else if (views >= 1000000) views = `${(views/1000000).toFixed(1)}M views`;
      else if (views >= 1000) views = `${(views/1000).toFixed(0)}K views`;
      else if (views === 1) views = `${views} view`;
      else views = `${views} views`;
      videoAlreadyOnYD.push(
        <VideoCard
          key={i}
          id={id}
          description={description}
          thumbnailHighUrl={thumbnailHigh.url}
          title={title}
          author={author}
          describer={describer}
          views={views}
          time={time}
          buttons='off'
        />);
    }
    this.setState({
      videoAlreadyOnYD: videoAlreadyOnYD,
    });
  }

  renderVideoNotOnYD(videoFromYoutube) {
    const videoNotOnYD = this.state.videoNotOnYD.slice();
    for (let i = 0; i < videoFromYoutube.length; i += 1) {
      const item = videoFromYoutube[i];
      const id = item.id;
      // const thumbnailDefault = item.snippet.thumbnails.default;
      // const thumbnailMedium = item.snippet.thumbnails.medium;
      const thumbnailHigh = item.snippet.thumbnails.high;
      let title = item.snippet.title;
      const description = item.snippet.description;
      const author = item.snippet.channelTitle;
      let describer;
      let views = item.statistics.viewCount;
      const publishedAt = new Date(item.snippet.publishedAt);

      const now = Date.now();
      let time = now - publishedAt;
      const year = 31536000000;
      const month = 2629740000;
      const day = 86400000;
      const hour = 3600000;
      const min = 60000;

      if (time >= year) {
        const years = (time / year).toFixed(0);
        years === 1 ? time = `${years} year ago` : time = `${years} years ago`;
      } else if (time >= month) {
        const months = (time / month).toFixed(0);
        months === 1 ? time = `${months} month ago` : time = `${months} months ago`;
      } else if (time >= day) {
        const days = (time / day).toFixed(0);
        days === 1 ? time = `${days} day ago` : time = `${days} days ago`;
      } else if (time >= hour) {
        const hours = (time / hour).toFixed(0);
        hours === 1 ? time = `${hours} hour ago` : time = `${hours} hours ago`;
      } else {
        const minutes = (time / min).toFixed(0);
        minutes === 1 ? time = `${minutes} minutes ago` : time = `${minutes} minutes ago`;
      }

      if (title.length > 100) title = `${title.slice(0, 100)}...`;
      if (views >= 1000000000) views = `${(views / 1000000000).toFixed(1)}B views`;
      else if (views >= 1000000) views = `${(views / 1000000).toFixed(1)}M views`;
      else if (views >= 1000) views = `${(views / 1000).toFixed(0)}K views`;
      else if (views === 1) views = `${views} view`;
      else views = `${views} views`;

      videoNotOnYD.push(
        <VideoCard
          key={i}
          id={id}
          description={description}
          thumbnailHighUrl={thumbnailHigh.url}
          title={title}
          author={author}
          views={views}
          time={time}
          vote_count={0}
          buttons='on'
          upVoteClick={(e) => this.upVoteClick(e, i, id, description, thumbnailHigh, title, author, views, time)}
          describeClick={()=> this.describeClick(id)}
        />
      );
    }

    this.setState({
      videoNotOnYD: videoNotOnYD,
    });
  }

  componentDidMount() {
    let currentSearchValue = this.props.getState().searchValue;
    if (currentSearchValue !== '') {
      this.getSearchResultsFromYdAndYt(currentSearchValue);
    }
  }

  // ????????????????????????????????????????????????????????????????????????????????
  componentWillReceiveProps() {
    setTimeout( () => {
      this.getSearchResultsFromYdAndYt(this.props.getState().searchValue);
    }, 0);
  }

  loadMoreResults() {
    alert('Working in progress...');
  }

  render() {
    const searchTerm = `"${this.props.getState().searchValue}"`;
    return (
      <div id="search-page" title="YouDescribe search results page">

        <div className="w3-container w3-indigo">
          <h2>Videos with audio descriptions matching {searchTerm}</h2>
        </div>

        <main>
          <div id="on-yd" className="w3-row">
            {this.state.videoAlreadyOnYD}
          </div>

          <div className="w3-margin-top w3-center">
            <button className="w3-btn w3-indigo w3-text-shadow w3-margin-bottom" onClick={this.loadMoreResults}>Load More</button>
          </div>
        </main>

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
