import React, { Component } from 'react';
import { Link } from 'react-router';
import path from 'path';

// import seedData from './seedData.js';

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
    console.log('componentDidMount and fetching...');

    const serverVideoIds = [];
    let ids;

    fetch('http://webng.io:8080/videos')
      .then(response => response.json())
      .then((response) => {
        for (let i = 0; i < response.result.length; i += 1) {
          serverVideoIds.push(response.result[i]._id);
        }
        ids = serverVideoIds.join(',');
      })
      .then(() => {
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${ids}&part=snippet,statistics&key=AIzaSyCG7xsho1pmQavWYYglY9E2VILAnOGsZls`;
        fetch(url)
        .then(response => response.json())
        .then((seedData) => {
          const videos = this.state.videos.slice();

          for (let i = 0; i < seedData.items.length; i += 1) {
            const thumbnailDefault = seedData.items[i].snippet.thumbnails.default;
            const thumbnailMedium = seedData.items[i].snippet.thumbnails.medium;
            const thumbnailHigh = seedData.items[i].snippet.thumbnails.high;
            let title = seedData.items[i].snippet.title;
            const description = seedData.items[i].snippet.description;
            const author = seedData.items[i].snippet.channelTitle;
            let views = seedData.items[i].statistics.viewCount;
            const publishedAt = new Date(seedData.items[i].snippet.publishedAt);

            const now = Date.now();
            let time = now - publishedAt;
            const year = 31536000000;
            const month = 2629740000;
            const day = 86400000;
            const hour = 3600000;
            const min = 60000;

            if (time >= year) time = `${(time / year).toFixed(0)} Year`;
            else if (time >= month) time = `${(time / month).toFixed(0)} Month`;
            else if (time >= day) time = `${(time / day).toFixed(0)} Day`;
            else if (time >= hour) time = `${(time / hour).toFixed(0)} Hour`;
            else time = `${(time / min).toFixed(0)} Min`;

            // if (title.length > 50) title = `${title.slice(0, 50)}...`;
            if (views >= 1000000000) views = `${(views/1000000000).toFixed(1)}B`;
            else if (views >= 1000000) views = `${(views/1000000).toFixed(1)}M`;
            else if (views >= 1000) views = `${(views/1000).toFixed(0)}K`;

            videos.push(
              <div className="w3-col m4 l2 w3-margin-top">
                <div className="w3-card-2">
                  <img alt={description} src={thumbnailHigh.url} width="100%" />
                  {/*
                    <div style={{
                    backgroundImage: `url(${thumbnailHigh.url})`,
                    backgroundSize: '100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    height: '150px',
                    }}>
                    test
                    </div>
                  */}
                  <div className="w3-container vid-title">
                    <h5><a href="#">{title}</a></h5>
                    <h6>
                      <a href="#">{author}</a><br />
                      ctoppel (describer)
                    </h6>
                  </div>
                  <div className="w3-container w3-padding-8">
                    <h6><div className="w3-left">{views} views</div><div className="w3-right"> {time}</div></h6>
                  </div>
                </div>
              </div>,
            );

            this.setState({ videos });
          }
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

        <div className="w3-row-padding">
          {this.state.videos}
        </div>

        <div className="w3-margin-top">
          <center><button className="w3-btn w3-indigo w3-text-shadow w3-margin-bottom">Load More</button></center>
        </div>

      </div>
    )
  }
}

export default Home;
