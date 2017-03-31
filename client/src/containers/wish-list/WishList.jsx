import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import VideoCard from '../../components/video-card/VideoCard.jsx';
import Button from '../../components/button/Button.jsx';
import Spinner2 from '../../components/spinner2/Spinner2.jsx';
import {
  ourFetch,
  convertTimeToCardFormat,
  convertViewsToCardFormat,
} from '../../shared/helperFunctions';

const conf = require('../../shared/config')();

class WishList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
    };
    this.wishlistDbResponseVideo = [];
    this.currentPageNumber = 1;
    this.fetchingVideosToWishlist = this.fetchingVideosToWishlist.bind(this);
    this.loadMoreResults = this.loadMoreResults.bind(this);
  }

  componentDidMount() {
    this.fetchingVideosToWishlist();
  }

  fetchingVideosToWishlist() {
    const serverVideo_Ids = [];
    const serverVideoIds = [];
    let ids;
    let dbResponse;

    const url = (`${conf.apiUrl}/wishlist?page=${this.currentPageNumber}`);
    ourFetch(url)
    .then((response) => {
      this.wishlistDbResponseVideo = response.result;
      for (let i = 0; i < this.wishlistDbResponseVideo.length; i += 1) {
        serverVideoIds.push(this.wishlistDbResponseVideo[i].youtube_id);
        serverVideo_Ids.push(this.wishlistDbResponseVideo[i]._id);
      }
      ids = serverVideoIds.join(',');
    })
    .then(() => {
      const url = `${conf.youTubeApiUrl}/videos?id=${ids}&part=snippet,statistics&key=${conf.youTubeApiKey}`;
      ourFetch(url)
      .then(data => this.parseFetchedData(data, serverVideo_Ids));
    });
  }

  parseFetchedData(data, serverVideo_Ids) {
    const videos = this.state.videos.slice();
    for (let i = 0; i < data.items.length; i += 1) {
      const item = data.items[i];
      const _id = serverVideo_Ids[i];
      const id = item.id;
      const thumbnailMedium = item.snippet.thumbnails.medium;
      const title = item.snippet.title;
      const description = item.snippet.description;
      const author = item.snippet.channelTitle;
      const views = convertViewsToCardFormat(Number(item.statistics.viewCount));
      const publishedAt = new Date(item.snippet.publishedAt);

      let votes;
      this.wishlistDbResponseVideo.forEach((elem) => {
        if (elem._id === id) {
          votes = elem.votes;
        }
      });

      const now = Date.now();
      const time = convertTimeToCardFormat(Number(now - publishedAt));

      videos.push(
        <VideoCard
          key={_id}
          id={id}
          thumbnailMediumUrl={thumbnailMedium.url}
          title={title}
          description={description}
          author={author}
          views={views}
          votes={votes}
          time={time}
          buttons="upvote-describe"
          getAppState={this.props.getAppState}
        />,
      );
    }

    this.closeSpinner();
    this.setState({ videos });
  }

  loadMoreResults() {
    this.currentPageNumber += 1;
    this.fetchingVideosToWishlist();
  }

  closeSpinner() {
    const spinner = document.getElementsByClassName('spinner2')[0];
    spinner.style.display = 'none';
  }

  render() {
    return (
      <div id="wish-list" title="YouDescribe wish list page">
        <div className="w3-container w3-indigo">
          <h2>Most requested</h2>
        </div>
        <Spinner2 />
        <main className="w3-row-padding">
          {this.state.videos}
        </main>
        <div id="load-more" className="w3-margin-top w3-center">
          <Button title="Load more videos" color="w3-indigo" text="Load more" onClick={this.loadMoreResults} />
        </div>
      </div>
    );
  }
}

export default WishList;
