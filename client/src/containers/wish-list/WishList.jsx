import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import VideoCard from '../../components/video-card/VideoCard.jsx';
import Button from '../../components/button/Button.jsx';
const conf = require('../../shared/config')();
import { ourFetch } from '../../shared/helperFunctions';

class WishList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
    };
  }

  componentDidMount() {
    this.renderVideosInWishlist();
  }

  renderVideosInWishlist() {
    const serverVideoIds = [];
    let ids;
    let dbResponse;

    ourFetch(`${conf.apiUrl}/wishlist`)
    .then((response) => {
      dbResponse = response.result;
      for (let i = 0; i < response.result.length; i += 1) {
        serverVideoIds.push(response.result[i].youtube_id);
      }
      ids = serverVideoIds.join(',');
    })
    .then(() => {
      const url = `${conf.youTubeApiUrl}/videos?id=${ids}&part=snippet,statistics&key=${conf.youTubeApiKey}`;
      ourFetch(url)
      .then((data) => {
        const videos = this.state.videos.slice();
        for (let i = 0; i < data.items.length; i += 1) {
          const item = data.items[i];
          const id = item.id;
          // const thumbnailDefault = item.snippet.thumbnails.default;
          // const thumbnailMedium = item.snippet.thumbnails.medium;
          const thumbnailHigh = item.snippet.thumbnails.high;
          let title = item.snippet.title;
          const description = item.snippet.description;
          const author = item.snippet.channelTitle;
          let views = item.statistics.viewCount;
          const publishedAt = new Date(item.snippet.publishedAt);

          let votes;
          dbResponse.forEach((elem) => {
            if (elem._id === id) {
              votes = elem.votes;
            }
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

          if (title.length > 100) title = `${title.slice(0, 100)}...`;
          if (views >= 1000000000) views = `${(views / 1000000000).toFixed(1)}B views`;
          else if (views >= 1000000) views = `${(views / 1000000).toFixed(1)}M views`;
          else if (views >= 1000) views = `${(views / 1000).toFixed(0)}K views`;
          else if (views === 1) views = `${views} view`;
          else views = `${views} views`;

          videos.push(
            <VideoCard
              key={i}
              id={id}
              thumbnailHighUrl={thumbnailHigh.url}
              title={title}
              description={description}
              author={author}
              views={views}
              votes={votes}
              time={time}
              buttons="on"
              getAppState={this.props.getAppState}
            />,
          );
        }
        this.setState({ videos }, () => {
          browserHistory.push('/wishlist');
        });
      });
    });
  }

  render() {
    return (
      <div id="wish-list" title="YouDescribe wish list page">
        <div className="w3-container w3-indigo">
          <h2>Most requested</h2>
        </div>
        <main className="w3-row-padding">
          {this.state.videos}
        </main>
        <div id="load-more" className="w3-margin-top w3-center">
          <Button title="Load more videos" color="w3-indigo" text="Load more" />
        </div>
      </div>
    );
  }
}

export default WishList;
