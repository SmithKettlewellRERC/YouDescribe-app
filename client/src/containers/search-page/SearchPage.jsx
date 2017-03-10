import React, { Component } from 'react';
import VideoCard from '../../components/video-card/VideoCard.jsx';

import seedData from './seedData.js';
import seedDb from './seedDb.js';

class SearchPage extends Component {
  constructor(props) {
    super(props);

    // function bindings

    this.state = {
      videoAlreadyOnYD: [],
      videoNotOnYD: [],
    };
  }

  requestUpVote(obj) {
    console.log('up vote this video: ', obj.id)
  }

  requestDescribe(obj) {
    console.log('describe this video: ', obj.id)
  }


  dataToRender(dbResponse, videoFromYDdatabase, videoFromYoutube) {
      console.log('component fetching...');

          const videoAlreadyOnYD = this.state.videoAlreadyOnYD.slice();

          for (let i = 0; i < videoFromYDdatabase.items.length; i += 1) {


            const id = videoFromYDdatabase.items[i].id;
            const thumbnailDefault = videoFromYDdatabase.items[i].snippet.thumbnails.default;
            const thumbnailMedium = videoFromYDdatabase.items[i].snippet.thumbnails.medium;
            const thumbnailHigh = videoFromYDdatabase.items[i].snippet.thumbnails.high;
            let title = videoFromYDdatabase.items[i].snippet.title;
            const description = videoFromYDdatabase.items[i].snippet.description;
            const author = videoFromYDdatabase.items[i].snippet.channelTitle;
            let describer = null;
            let views = videoFromYDdatabase.items[i].statistics.viewCount;
            const publishedAt = new Date(videoFromYDdatabase.items[i].snippet.publishedAt);

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

            // if (title.length > 50) title = `${title.slice(0, 50)}...`;
            if (views >= 1000000000) views = `${(views/1000000000).toFixed(1)}B views`;
            else if (views >= 1000000) views = `${(views/1000000).toFixed(1)}M views`;
            else if (views >= 1000) views = `${(views/1000).toFixed(0)}K views`;
            else if (views === 1) views = `${views} view`;
            else views = `${views} views`;

            let authorSection;

            if (describer) {
              authorSection =
              (
                <h6>
                  <a href="#">{author}</a><br />
                  <a href="#">{describer}</a> (describer)
                </h6>
              );
            } else {
              authorSection =
              (
                <h6>
                  <a href="#">{author}</a><br />
                </h6>
              );
            }

            videoAlreadyOnYD.push(
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
                    {/*<h6>
                      <a href="#">{author}</a><br />
                      <a href="#">{describer}</a> (describer)
                    </h6>*/}
                    {authorSection}
                  </div>
                  <div className="w3-container w3-padding-8">
                    <h6><div className="w3-left">{views}</div><div className="w3-right"> {time}</div></h6>
                    <button className="w3-btn w3-indigo" onClick={() => this.requestUpVote({ id })} >Up vote</button>
                    <button className="w3-btn w3-indigo" onClick={() => this.requestDescribe({ id })} >Describe</button>
                  </div>
                </div>
              </div>,
            );
          }

      const videoNotOnYD = this.state.videoNotOnYD.slice();

          for (let i = 0; i < videoFromYoutube.items.length; i += 1) {


            const id = videoFromYoutube.items[i].id;
            const thumbnailDefault = videoFromYoutube.items[i].snippet.thumbnails.default;
            const thumbnailMedium = videoFromYoutube.items[i].snippet.thumbnails.medium;
            const thumbnailHigh = videoFromYoutube.items[i].snippet.thumbnails.high;
            let title = videoFromYoutube.items[i].snippet.title;
            const description = videoFromYoutube.items[i].snippet.description;
            const author = videoFromYoutube.items[i].snippet.channelTitle;
            let views = videoFromYoutube.items[i].statistics.viewCount;
            const publishedAt = new Date(videoFromYoutube.items[i].snippet.publishedAt);

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
            if (views >= 1000000000) views = `${(views / 1000000000).toFixed(1)}B views`;
            else if (views >= 1000000) views = `${(views / 1000000).toFixed(1)}M views`;
            else if (views >= 1000) views = `${(views / 1000).toFixed(0)}K views`;
            else if (views === 1) views = `${views} view`;
            else views = `${views} views`;

            videoNotOnYD.push(
              <div className="w3-col m4 l2 w3-margin-top">
                <div className="w3-card-2">
                  <img alt={description} src={thumbnailHigh.url} width="100%" />
                  <div className="w3-container vid-title">
                    <h5><a href="#">{title}</a></h5>
                    <h6>
                      <a href="#">{author}</a><br />
                    </h6>
                  </div>
                  <div className="w3-container w3-padding-8">
                    <h6><div className="w3-left">{views}</div><div className="w3-right"> {time}</div></h6>
                    <button className="w3-btn w3-indigo" onClick={() => this.requestUpVote({ id })} >Up vote</button>
                    <button className="w3-btn w3-indigo" onClick={() => this.requestDescribe({ id })} >Describe</button>
                  </div>
                </div>
              </div>,
            );
          }

      this.setState({ videoAlreadyOnYD, videoNotOnYD });

      console.log('video already on YD ',this.state.videoAlreadyOnYD)
      console.log('video not on YD ',this.state.videoNotOnYD)

  }

  componentDidMount() {
    console.log('component did mount: ')
    // let seedDb = this.props.state.data[0];
    // let seedData = this.props.state.data[1];


    this.dataToRender(seedDb, seedData, seedData);
  }

  //component gonna update everytime app run fetch and SearchPage get props
  componentWillReceiveProps() {

    console.log('component will receive props: ')
    // let seedDb = this.props.state.data[0];
    // let seedData = this.props.state.data[1];

    this.setState({
      videoAlreadyOnYD: [],
      videoNotOnYD: [],
    }, () => this.dataToRender(seedDb, seedData, seedData))
  }

  render() {
    return (
      <div id="search-page">

        <div className="w3-container w3-indigo">
          <h1>Already on YD</h1>
        </div>

        <div className="w3-row-padding">
          {this.state.videoAlreadyOnYD}
        </div>

        <div className="w3-margin-top w3-center">
          <button className="w3-btn w3-indigo w3-text-shadow w3-margin-bottom">Load More</button>
        </div>

        <div className="w3-container w3-indigo">
          <h1>Not on YD</h1>
        </div>

        <div className="w3-row-padding">
          {this.state.videoNotOnYD}
        </div>

        <div className="w3-margin-top w3-center">
          <button
           className="w3-btn w3-indigo w3-text-shadow w3-margin-bottom">Load More</button>
        </div>
      </div>
    );
  }
}

export default SearchPage;
