import React, { Component } from 'react';
import VideoCard from '../../components/video-card/VideoCard.jsx';
import Button from '../../components/button/Button.jsx';

const conf = require('../../shared/config')();

class Home extends Component {
  constructor(props) {
    super(props);

    // function bindings

    this.state = {
      searchQuery: '',
      videos: [],
    };
  }

  componentDidMount() {
    const serverVideoIds = [];
    let ids;
    let dbResponse;

    fetch('http://webng.io:8080/v1/videos')
    // fetch(`${conf.apiUrl}/v1/videos`)
      .then(response => response.json())
      .then((response) => {
        dbResponse = response.result;
        for (let i = 0; i < response.result.length; i += 1) {
          serverVideoIds.push(response.result[i]._id);
        }
        ids = serverVideoIds.join(',');
      })
      .then(() => {
        // ids = 'poq6AoHn4HM,poq6AoHn4HM,poq6AoHn4HM,poq6AoHn4HM,poq6AoHn4HM,poq6AoHn4HM';
        const url = `${conf.youTubeApiUrl}/videos?id=${ids}&part=snippet,statistics&key=${conf.youTubeApiKey}`;
        fetch(url)
        .then(response => response.json())
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
            let describer;
            let views = item.statistics.viewCount;
            const publishedAt = new Date(item.snippet.publishedAt);

            dbResponse.forEach((elem) => {
              if (elem._id === id) describer = elem.audio_descriptions[1].legacy_author_name;
            })

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
          this.setState({ videos });
        });
      });
  }

  // functions
  handleChange(event) {
    this.setState({ searchQuery: event.target.value });
  }

  // displayed on page
  render() {
    return (
      <div id="home">

        <div className="w3-container w3-indigo">
          <h1>Most popular</h1>
        </div>

        <main className="w3-row">
          {this.state.videos}
        </main>

        <div className="w3-margin-top w3-center">
          <Button title="Load more videos" color="w3-indigo" text="Load more" />
        </div>

      </div>
    );
  }
}

export default Home;
