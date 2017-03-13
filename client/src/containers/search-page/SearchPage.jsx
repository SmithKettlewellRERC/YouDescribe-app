import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import VideoCard from '../../components/video-card/VideoCard.jsx';
import Button from '../../components/button/Button.jsx';


// import seedData from './seedData.js';
// import seedDb from './seedDb.js';

class SearchPage extends Component {
  constructor(props) {
    super(props);

    // function bindings

    this.state = {
      videoAlreadyOnYD: [],
      videoNotOnYD: [],
    };
  }

  upVoteClick(e, i, id, description, thumbnailHigh, title, author, views, time) {
    console.log('CLASS', e.target.className);
    if (e.target.className === 'w3-btn w3-white w3-text-indigo w3-left' ||
      e.target.className === 'fa fa-heart') {
      if (e.target.className === 'fa fa-heart') e.target.parentElement.className = 'w3-btn w3-white w3-text-red w3-left';
      else e.target.className = 'w3-btn w3-white w3-text-red w3-left';
      console.log('heart activated and video request added to wishlist or incremented by 1');
    }

    let body = JSON.stringify({
      title: title,
      id: id,
    })

    fetch('http://webng.io:8080/v1/wishlist', {
      headers: {
      'Content-Type': 'application/json'
      },
      method: 'post',
      body: body,
    })
    .then(res => res.json())
    .then((res) => {
      console.log('posted id')
      console.log('response is: ', res.message)
    })
  }

  describeClick(id) {
    console.log('describe this video: ', id)
    browserHistory.push('/authoring-tool/' + id)
  }


  renderVideoFromYD(dbResponse, videoFromYDdatabase) {
      console.log('component fetching...');

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
    console.log('component did mount: ');
    const seedDb = this.props.getState().fetchJSONtoSearchPage[0];
    const seedData1 = this.props.getState().fetchJSONtoSearchPage[1];
    const seedData2 = this.props.getState().fetchJSONtoSearchPage[2];


    this.renderVideoFromYD(seedDb, seedData1);
    this.renderVideoNotOnYD(seedData2);
  }

  // component gonna update everytime app run fetch and SearchPage get props
  componentWillReceiveProps() {
    console.log('component will receive props: ');
    const seedDb = this.props.getState().fetchJSONtoSearchPage[0];
    const seedData1 = this.props.getState().fetchJSONtoSearchPage[1];
    const seedData2 = this.props.getState().fetchJSONtoSearchPage[2];

    // this.dataToRender(seedDb, seedData1, seedData2)

    if (seedData2.length == 0) {
      this.setState({
        videoAlreadyOnYD: [],
      }, () => {
        this.renderVideoFromYD(seedDb, seedData1);
        console.log('rendering videos on YD section');
      });
    }
    if (seedData2.length > 0) {
      this.setState({
        videoNotOnYD: [],
      }, () => {
        this.renderVideoNotOnYD(seedData2);
        console.log('rendering videos not on YD section');
      });
    }
  }

  render() {
    return (
      <div id="search-page">

        <div className="w3-container w3-indigo">
          <h1>Already on YD</h1>
        </div>

        <main>
          <div id="on-yd" className="w3-row">
            {this.state.videoAlreadyOnYD}
          </div>

          <div className="w3-margin-top w3-center">
            <button className="w3-btn w3-indigo w3-text-shadow w3-margin-bottom">Load More</button>
          </div>
        </main>

        <div className="w3-container w3-indigo">
          <h1>Not on YD</h1>
        </div>

        <main>
          <div className="w3-row">
            {this.state.videoNotOnYD}
          </div>
        </main>

        <div className="w3-margin-top w3-center">
          <Button title="Load more videos" color="w3-indigo" text="Load more" />
        </div>
      </div>
    );
  }
}

export default SearchPage;
