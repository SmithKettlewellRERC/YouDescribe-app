import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import VideoCard from '../../components/video-card/VideoCard.jsx';
import Button from '../../components/button/Button.jsx';
import Spinner from '../../components/spinner/Spinner.jsx';
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
      videoCardsComponents: [],
    };
    this.wishListItems = [];
    this.youTubeIds = [];
    this.youDescribeIds = [];

    this.currentPageNumber = 1;
    this.loadMoreResults = this.loadMoreResults.bind(this);
  }

  componentDidMount() {
    this.loadWishListVideos();
  }

  loadWishListVideos() {
    const url = (`${conf.apiUrl}/wishlist?page=${this.currentPageNumber}`);
    ourFetch(url)
    .then((response) => {
      this.wishListItems = response.result;
      for (let i = 0; i < this.wishListItems.length; i += 1) {
        this.youTubeIds.push(this.wishListItems[i].youtube_id);
        this.youDescribeIds.push(this.wishListItems[i]._id);
      }
    })
    .then(() => {
      const url = `${conf.youTubeApiUrl}/videos?id=${this.youTubeIds.join(',')}&part=snippet,statistics&key=${conf.youTubeApiKey}`;
      ourFetch(url)
      .then(youTubeResponse => this.parseFetchedData(youTubeResponse));
    });
  }

  parseFetchedData(youTubeResponse) {
    const videoCardsComponents = this.state.videoCardsComponents.slice();
    for (let i = 0; i < youTubeResponse.items.length; i += 1) {
      const item = youTubeResponse.items[i];
      if (!item.statistics || !item.snippet) {
        continue;
      }
      const _id = this.youDescribeIds[i];
      const youTubeId = item.id;
      const thumbnailMedium = item.snippet.thumbnails.medium;
      const title = item.snippet.title;
      const description = item.snippet.description;
      const author = item.snippet.channelTitle;
      const views = convertViewsToCardFormat(Number(item.statistics.viewCount));
      const publishedAt = new Date(item.snippet.publishedAt);
      const now = Date.now();
      const time = convertTimeToCardFormat(Number(now - publishedAt));

      videoCardsComponents.push(
        <VideoCard
          key={_id}
          youTubeId={youTubeId}
          thumbnailMediumUrl={thumbnailMedium.url}
          title={title}
          description={description}
          author={author}
          views={views}
          time={time}
          buttons="upvote-describe"
          getAppState={this.props.getAppState}
        />,
      );
    }

    this.setState({ videoCardsComponents });
    this.closeSpinner();
  }

  loadMoreResults() {
    this.currentPageNumber += 1;
    this.loadWishListVideos();
  }

  closeSpinner() {
    const spinner = document.getElementsByClassName('spinner')[0];
    spinner.style.display = 'none';
  }

  render() {
    let loadMoreButton = (
      <div className="w3-margin-top w3-center load-more w3-hide">
        <Button title="Load more videos" color="w3-indigo" text="Load more" onClick={this.loadMoreResults} />
      </div>
    );

    if (this.state.videoCardsComponents.length > 20) {
      loadMoreButton = (
        <div className="w3-margin-top w3-center load-more">
          <Button title="Load more videos" color="w3-indigo" text="Load more" onClick={this.loadMoreResults} />
        </div>
      );
    }

    return (
      <main id="wish-list" title="YouDescribe wish list page">
        <div className="w3-container w3-indigo">
          <h2>WISH LIST</h2>
        </div>
        <Spinner />
        <div className="w3-row-padding container">
          {this.state.videoCardsComponents}
        </div>
        {loadMoreButton}
      </main>
    );
  }
}

export default WishList;
