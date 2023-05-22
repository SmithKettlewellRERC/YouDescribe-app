import React, { Component } from "react";
import { browserHistory, Router, useHistory } from "react-router";
import VideoCard from "../../components/video-card/VideoCard.jsx";
import Button from "../../components/button/Button.jsx";
import UserStudyModal from "../../components/user-study-modal/user-study-modal.jsx";
import Spinner from "../../components/spinner/Spinner.jsx";
import Announcement from "../../components/announcement/Announcement.jsx";
import {
  ourFetch,
  convertTimeToCardFormat,
  convertViewsToCardFormat,
  convertISO8601ToSeconds,
  convertSecondsToCardFormat,
} from "../../shared/helperFunctions";

const { detect } = require("detect-browser");
const conf = require("../../shared/config")();

class Home extends Component {
  constructor(props) {
    super(props);
    this.dbResultArray = [];
    this.state = {
      searchQuery: "",
      videos: [],
    };
    this.currentPage = 1;
    this.fetchingVideosToHome = this.fetchingVideosToHome.bind(this);
    this.loadMoreResults = this.loadMoreResults.bind(this);
    this.closeSpinner = this.closeSpinner.bind(this);
  }

  componentDidMount() {

    window.location.replace(`${conf.youDescribeRedirectUrl}`);
    return;
    document.getElementById("navbar").focus();
    document.title = this.props.translate("YouDescribe - Audio Description for YouTube Videos");
    this.fetchingVideosToHome();
  }

  fetchingVideosToHome() {
    const youDescribeVideosIds = [];
    const youTubeVideosIds = [];
    let ids;
    const url = `${conf.apiUrl}/videos?page=${this.currentPage}`;
    ourFetch(url)
      .then((response) => {
        this.dbResultArray = response.result;
        for (let i = 0; i < this.dbResultArray.length; i += 1) {
          youTubeVideosIds.push(this.dbResultArray[i].youtube_id);
          youDescribeVideosIds.push(this.dbResultArray[i]._id);
        }
        ids = youTubeVideosIds.join(",");
      })
      .then(() => {
        const url = `${conf.apiUrl}/videos/getyoutubedatafromcache?youtubeids=${ids}&key=home`;
        ourFetch(url).then((response) => {
          this.parseFetchedData(JSON.parse(response.result), youDescribeVideosIds);
        });
      });
  }

  parseFetchedData(data, youDescribeVideosIds) {
    const videos = this.state.videos.slice();
    if (data.items === undefined) {
      videos.push(
        <h1>
          Thank you for visiting YouDescribe. This video is not viewable at this time due to YouTube
          API key limits. Our key is reset by Google at midnight Pacific time
        </h1>
      );
    } else {

      for (let i = 0; i < data.items.length; i += 1) {
        const item = data.items[i];
        if (!item.statistics || !item.snippet) {
          continue;
        }
        const _id = youDescribeVideosIds[i];
        const youTubeId = item.id;
        const thumbnailMedium = item.snippet.thumbnails.medium;
        const duration = convertSecondsToCardFormat(
          convertISO8601ToSeconds(item.contentDetails.duration)
        );
        const title = item.snippet.title;
        const description = item.snippet.description;
        const author = item.snippet.channelTitle;
        const views = convertViewsToCardFormat(Number(item.statistics.viewCount));
        const publishedAt = new Date(item.snippet.publishedAt);

        const now = Date.now();
        const time = convertTimeToCardFormat(Number(now - publishedAt));

        videos.push(
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
    }
    this.closeSpinner();
    this.setState({ videos });
  }

  handleChange(event) {
    this.setState({ searchQuery: event.target.value });
  }

  loadMoreResults() {
    this.currentPage += 1;
    this.fetchingVideosToHome();
  }

  closeSpinner() {
    const spinner = document.getElementsByClassName("spinner")[0];
    spinner.style.display = "none";
  }

  // displayed on page
  render() {
    const isSignedIn = this.props.getAppState().isSignedIn;
    const userid = this.props.getAppState().userId;
    if (isSignedIn) {
      const url = `${conf.apiUrl}/users/${userid}`;
      ourFetch(url).then((response) => {
        const user = response.result;
        if (user.policy_review === "") {
          alert(
            "YouDescribe has been updated, please update your notification preferences in the next page."
          );
          browserHistory.push(`/profile/` + this.props.getAppState().userId);
        }
      });
    }
    let YDloadMoreButton = (
      <div className="w3-margin-top w3-center load-more w3-hide">
        <Button
          title={this.props.translate("Load more videos")}
          color="w3-indigo"
          text="Load more"
          onClick={this.loadMoreResults}
        />
      </div>
    );

    /**
     * TODO: Need to implement a better way to decide when the "Load More" button should be visible when implementing this in YouDescribeX
     * 
     * NOTE: All of the pages that show videos suffer from this same problem.
     * 
     * Current implementation is not good because if we do get to the very end and there are no more
     * "Recent Descriptions", then the "Load More" button will still be visible because
     * this.state.videos contains all of the videos being shown. For some reason, even though the
     * YouDescribe API has a return limit of 50 and there is much more than 50 recent
     * descriptions, it only returns 20.
     * 
     * Possible Solution: Create a count query endpoint. This returns the total number of recent
     * descriptions. Then we can just compare the number of videos in this.state.videos with
     * the total count to see if we should show the load more button.
     * 
     */
    if (this.state.videos.length >= 20) {
      YDloadMoreButton = (
        <div className="w3-margin-top w3-center load-more">
          <Button
            title={this.props.translate("Load more videos")}
            color="w3-indigo"
            text="Load more"
            onClick={this.loadMoreResults}
          />
        </div>
      );
    }

    return (
      <main id="home" title="YouDescribe home page">
        {/* <Announcement
          text={
            "Attention: YouDescribe will be down on for maintenance. We apologize for any inconvenience."
          }
        ></Announcement> */}
        <header role="banner" className="w3-container w3-indigo">
          <h2 id="home-heading" tabIndex="0">
            {this.props.translate("RECENT DESCRIPTIONS")}
          </h2>

          {/* <UserStudyModal></UserStudyModal> */}
        </header>

        <Spinner translate={this.props.translate} />

        <div className="w3-row container">{this.state.videos}</div>

        {YDloadMoreButton}
      </main>
    );
  }
}

export default Home;
