import React, { Component } from "react";
import VideoCard from '../../components/video-card/VideoCard.jsx';
import {
    ourFetch,
    convertTimeToCardFormat,
    convertViewsToCardFormat,
    convertISO8601ToSeconds,
    convertSecondsToCardFormat,
  } from '../../shared/helperFunctions';
import Spinner from '../../components/spinner/Spinner.jsx';
const conf = require('../../shared/config')();

class Waitlist extends Component {  
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      divisions: [],
    };
    this.fetchingVideosToWaitlist = this.fetchingVideosToWaitlist.bind(this);
    this.parseFetchedData = this.parseFetchedData.bind(this);
    this.closeSpinner = this.closeSpinner.bind(this);
  }
  
  componentDidMount() {
    document.getElementById('navbar').focus();
    document.title = this.props.translate('YouDescribe - Audio Description for YouTube Videos');
    this.fetchingVideosToWaitlist();
  }

  fetchingVideosToWaitlist() {
    const url = (`${conf.apiUrl}/wishlist/getbycategories`);
    ourFetch(url).then((response) => {
      const resultArray = response.result;
      resultArray.forEach(resultItem => {
        const category = resultItem._id;

        const youTubeVideosIds = [];
        const dataArray = resultItem.data;
        dataArray.forEach(dataItem => {
          youTubeVideosIds.push(dataItem.youtube_id);
        });
        const ids = youTubeVideosIds.join(',');

        const url = `${conf.youTubeApiUrl}/videos?id=${ids}&part=contentDetails,snippet,statistics&key=${conf.youTubeApiKey}`;
        ourFetch(url).then(data => {
          this.parseFetchedData(category, data);
        });
      });

      this.closeSpinner();
    });
  }

  parseFetchedData(category, data) {
    const videos = this.state.videos;
    for (let i = 0; i < data.items.length; i += 1) {
      const item = data.items[i];
      if (!item.statistics || !item.snippet) {
        continue;
      }
      const _id = item.id;
      const youTubeId = item.id;
      const thumbnailMedium = item.snippet.thumbnails.medium;
      const duration = convertSecondsToCardFormat(convertISO8601ToSeconds(item.contentDetails.duration));
      const title = item.snippet.title;
      const description = item.snippet.description;
      const author = item.snippet.channelTitle;
      const views = convertViewsToCardFormat(Number(item.statistics.viewCount));
      const publishedAt = new Date(item.snippet.publishedAt);
      const now = Date.now();
      const time = convertTimeToCardFormat(Number(now - publishedAt));
      if (!videos[category]) {
        videos[category] = [];
      }
      videos[category].push(
        <VideoCard
          translate={this.props.translate}
          key={_id}
          youTubeId={youTubeId}
          description={description}
          thumbnailMediumUrl={thumbnailMedium.url}
          duration={duration}
          title={title}
          author={author}
          views={views}
          time={time}
          buttons="none"
        />
      );
    }

    this.setState({
      videos: videos,
    });
  }

  closeSpinner() {
    const spinner = document.getElementsByClassName('spinner')[0];
    spinner.style.display = 'none';
  }

  render() {
    const divisions = [];
    for (var category in this.state.videos) {
      divisions.push(
        <div className="w3-row container" key={category}>
          <p>{category}</p>
          {this.state.videos[category]}
        </div>
      );
    }

    return (  
      <div id="unsupported-browser" tabIndex="-1">
        <header role="banner" className="w3-container w3-indigo">
          <h2 style={{display: "flex", justifyContent: "center"}}>Thank You for choosing the new version of YOUDESCRIBE. </h2>
        </header>
        <main>
          Thank you for checking out YouDescribeX. Because this is an AI assisted platform the algorithm needs some time to process your video before *you* can get to work! Right now, because this technology is still being trained, it takes around 30 minutes to process a video. YouDescribeX will send you an email when it is ready to describe. Leaving you free to work on something else.
          <br/><br/>
          If you had some time, the videos below have been requested from our viewers and are processed, ready for a human to expand, correct, and simplify. Less than xx % of wish list items get described, so if you have a few minutes while your video processes, I am sure a viewer would be thrilled if you could describe their request!
          <br/><br/>
          <p style={{display: "flex", justifyContent: "center", color : "#228B22"}}>Suggestions for you based on Categories:</p> 
        
          <Spinner translate={this.props.translate} />
          {divisions}
        </main>
      </div>
    );
  }
}

export default Waitlist;
