import React, { Component } from 'react';

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
    let dbResponse;

    fetch('http://webng.io:8080/videos')
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
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${ids}&part=snippet,statistics&key=AIzaSyCG7xsho1pmQavWYYglY9E2VILAnOGsZls`;
        fetch(url)
        .then(response => response.json())
        .then((data) => {
          const videos = this.state.videos.slice();

          console.log(dbResponse);
          console.log(data.items);
          for (let i = 0; i < data.items.length; i += 1) {


            const id = data.items[i].id;
            const thumbnailDefault = data.items[i].snippet.thumbnails.default;
            const thumbnailMedium = data.items[i].snippet.thumbnails.medium;
            const thumbnailHigh = data.items[i].snippet.thumbnails.high;
            let title = data.items[i].snippet.title;
            const description = data.items[i].snippet.description;
            const author = data.items[i].snippet.channelTitle;
            let describer;
            let views = data.items[i].statistics.viewCount;
            const publishedAt = new Date(data.items[i].snippet.publishedAt);

            dbResponse.forEach((elem) => {
              if (elem._id === id) describer = elem.audio_descriptions[0].legacy_author_name;
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

            // if (title.length > 50) title = `${title.slice(0, 50)}...`;
            if (views >= 1000000000) views = `${(views/1000000000).toFixed(1)}B views`;
            else if (views >= 1000000) views = `${(views/1000000).toFixed(1)}M views`;
            else if (views >= 1000) views = `${(views/1000).toFixed(0)}K views`;
            else if (views === 1) views = `${views} view`;
            else views = `${views} views`;

            videos.push(
              <div className="w3-col m4 l2 w3-margin-top">
                <div className="w3-card-2 w3-hover-shadow">
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
                      <a href="#">{describer}</a> (describer)
                    </h6>
                  </div>
                  <div className="w3-container w3-padding-8">
                    <h6><div className="w3-left">{views}</div><div className="w3-right"> {time}</div></h6>
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

        <main className="w3-row-padding">
          {this.state.videos}
        </main>

        <div className="w3-margin-top w3-center">
          <button className="w3-btn w3-indigo w3-text-shadow w3-margin-bottom">Load More</button>
        </div>

      </div>
    )
  }
}

export default Home;
