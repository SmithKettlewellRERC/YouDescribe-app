import React, { Component } from "react";
import VideoCard from "../../components/video-card/VideoCard.jsx";
import Button from "../../components/button/Button.jsx";
import Spinner from "../../components/spinner/Spinner.jsx";

import {
  ourFetch,
  convertTimeToCardFormat,
  convertViewsToCardFormat,
  convertISO8601ToSeconds,
  convertSecondsToCardFormat,
} from "../../shared/helperFunctions";

const conf = require("../../shared/config")();

class UserVideosPage extends Component {
  constructor(props) {
    super(props);
    this.userId = this.props.params.userId;
    this.user = {
      id: this.props.getAppState().userId,
      isSignedIn: this.props.getAppState().isSignedIn,
    };
    this.userVideosArray = [];
    this.youTubeVideosIds = [];
    this.youDescribeVideosIds = [];
    this.youTubeVideosArray = [];
    this.state = {
      videoComponents: [],
      userName: "",
    };
    this.closeSpinner = this.closeSpinner.bind(this);
  }

  componentDidMount() {
    document.getElementById("user-videos-page").focus();
    this.getUserInfo();
    this.getVideos();
  }

  getUserInfo() {
    const url = `${conf.apiUrl}/users/${this.userId}`;
    ourFetch(url).then((response) => {
      if (response.result) {
        const user = response.result;
        this.setState({ userName: user.name });
      }
    });
  }

  getVideos() {
    let youTubeIds;
    let sortedIds;
    const url = `${conf.apiUrl}/videos/user/${this.userId}`;
    ourFetch(url)
      .then((response) => {
        this.userVideosArray = response.result;
        for (let i = 0; i < this.userVideosArray.length; i += 1) {
          this.youTubeVideosIds.push(this.userVideosArray[i].youtube_id);
          this.youDescribeVideosIds.push(this.userVideosArray[i]._id);
        }
        youTubeIds = this.youTubeVideosIds.join(",");
      })
      .then(() => {
        sortedIds = this.youTubeVideosIds.sort();
        if (sortedIds == window.localStorage.getItem("userVideosSortedIds")) {
          console.log("loading user videos page from local storage");
          this.youTubeVideosArray = JSON.parse(
            window.localStorage.getItem("userVideosYoutubeData")
          );
          this.parseResponseData();
        } else {
          window.localStorage.setItem("userVideosSortedIds", sortedIds);
          const url = `${conf.youTubeApiUrl}/videos?id=${youTubeIds}&part=contentDetails,snippet,statistics&key=${conf.youTubeApiKey}`;
          ourFetch(url).then((data) => {
            window.localStorage.setItem(
              "userVideosYoutubeData",
              JSON.stringify(data)
            );
            this.youTubeVideosArray = data;
            this.parseResponseData();
          });
        }
      });
  }

  parseResponseData() {
    const videoComponents = [];
    for (let i = 0; i < this.youTubeVideosArray.items.length; i += 1) {
      const item = this.youTubeVideosArray.items[i];
      const youDescribeVideoId = this.youDescribeVideosIds[i];
      const youTubeId = item.id;
      const thumbnail = item.snippet.thumbnails.medium;
      const duration = convertSecondsToCardFormat(
        convertISO8601ToSeconds(item.contentDetails.duration)
      );
      const title = item.snippet.title;
      const author = item.snippet.channelTitle;
      const views = convertViewsToCardFormat(Number(item.statistics.viewCount));
      const publishedAt = new Date(item.snippet.publishedAt);
      const now = Date.now();
      const time = convertTimeToCardFormat(Number(now - publishedAt));

      videoComponents.push(
        <VideoCard
          translate={this.props.translate}
          key={youTubeId}
          youTubeId={youTubeId}
          thumbnailMediumUrl={thumbnail.url}
          duration={duration}
          title={title}
          author={author}
          views={views}
          time={time}
          buttons="edit"
          getAppState={this.props.getAppState}
        />
      );
    }
    this.closeSpinner();
    this.setState({ videoComponents });
  }

  closeSpinner() {
    const spinner = document.getElementsByClassName("spinner")[0];
    spinner.style.display = "none";
  }

  render() {
    if (!this.user.isSignedIn || this.userId !== this.user.id) {
      return (
        <div id="user-videos-page">
          <h2>Sign In Required</h2>
          <p>
            Sorry! The link you followed points to a YouDescribe page that
            requires you to sign in to your account
          </p>
          <p>Please Sign In using your google account to access this page.</p>
        </div>
      );
    }
    let loadMoreButton = (
      <div className="w3-margin-top w3-center load-more w3-hide">
        <Button
          title={this.props.translate("Load more videos")}
          color="w3-indigo"
          text={this.props.translate("Load more")}
          onClick={this.loadMoreResults}
        />
      </div>
    );

    if (this.state.videoComponents.length > 20) {
      loadMoreButton = (
        <div className="w3-margin-top w3-center load-more">
          <Button
            title={this.props.translate("Load more videos")}
            color="w3-indigo"
            text={this.props.translate("Load more")}
            onClick={this.loadMoreResults}
          />
        </div>
      );
    }

    return (
      <div id="user-videos-page" title="User described videos page">
        <main>
          <section>
            <header className="w3-container w3-indigo">
              <h2>{this.props.translate("MY DESCRIBED VIDEOS")}</h2>
            </header>

            <Spinner translate={this.props.translate} />

            <div className="w3-row container">{this.state.videoComponents}</div>

            {loadMoreButton}
          </section>
        </main>
      </div>
    );
  }
}

export default UserVideosPage;
