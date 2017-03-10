import React, { Component } from 'react';
import VideoCard from '../../components/video-card/VideoCard.jsx';

// import seedData from './seedData.js';
// import seedDb from './seedDb.js';

class SearchPage extends Component {
  constructor(props) {
    super(props);

    // function bindings

    this.state = {
      videos: [],
    };
  }

  requestHandler(obj) {
    console.log('add this to wish list: ', obj.id)
  }

  dataToRender(dbResponse, data) {
      console.log('component fetching...');
    const videos = this.state.videos.slice();

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
      if (views >= 1000000000) views = `${(views/1000000000).toFixed(1)}B views`;
      else if (views >= 1000000) views = `${(views/1000000).toFixed(1)}M views`;
      else if (views >= 1000) views = `${(views/1000).toFixed(0)}K views`;
      else if (views === 1) views = `${views} view`;
      else views = `${views} views`;

      videos.push(
        <VideoCard
          id={id}
          description={description}
          thumbnailHighUrl={thumbnailHigh.url}
          title={title}
          author={author}
          describer={describer}
          views={views}
          time={time}
        />);

      this.setState({ videos });
    }
  }

  componentWillMount() {
    console.log('component will mount: ')
    let seedDb = this.props.state.data[0];
    let seedData = this.props.state.data[1];


    this.dataToRender(seedDb, seedData);
  }

  //component gonna update everytime app run fetch and SearchPage get props
  componentWillReceiveProps() {
    // console.log('component will receive props: ')
    // let seedDb = this.props.state.data[0];
    // let seedData = this.props.state.data[1];
    this.setState({
      videos: [],
    }, () => this.dataToRender(seedDb, seedData));
  }

  render() {
    return (
      <div id="search-page">

        <div className="w3-container w3-indigo">
          <h1>Search results</h1>
        </div>

        <main className="w3-row">
          {this.state.videos}
        </main>

        <div className="w3-margin-top w3-center">
          <button className="w3-btn w3-indigo w3-text-shadow w3-margin-bottom">Load More</button>
        </div>

      </div>
    );
  }
}

export default SearchPage;
