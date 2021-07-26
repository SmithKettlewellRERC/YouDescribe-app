import React, { Component } from "react";
import { browserHistory } from "react-router";
import PropTypes from "prop-types";
import { Howl } from "howler";
import Spinner from "../../components/spinner/Spinner.jsx";
import VideoPlayerControls from "../../components/video-player-controls/VideoPlayerControls.jsx";

import {
  ourFetch,
  convertISO8601ToSeconds,
  convertISO8601ToDate,
  convertSecondsToEditorFormat,
  convertViewsToCardFormat,
  convertLikesToCardFormat,
} from "../../shared/helperFunctions";
import { Container, Col, Row } from "react-bootstrap";

const conf = require("../../shared/config")();

class VideoEmbed extends Component {
  constructor(props) {
    super(props);

    this.watcher = null;
    this.previousVideoVolume = 0;
    this.audioClipsPlayed = {};
    this.rating = 0;

    this.state = {
      videoId: props.params.videoId,

      // Audio descriptions
      inlineClipsCurrentlyPlaying: [],
      audioDescriptionsIds: [],
      audioDescriptionsIdsUsers: {},
      audioDescriptionsIdsAudioClips: {},
      selectedAudioDescriptionId: props.location.query.ad || null,
      previousSelectedAudioDescriptionId: null,
      showDescribersList: true,

      // Video controls and data
      videoTitle: "",
      videoDescription: "",
      videoData: {},
      videoPlayer: null,
      videoState: -1,
      videoPlayerAccessibilitySeekbarValue: 0,
      videoVolume: 0,
      balancerValue: 50,
      currentVideoProgress: "00:00:00:00",
      videoDurationToDisplay: "00:00:00:00",
    };

    this.updateState = this.updateState.bind(this);
    this.setAudioDescriptionActive = this.setAudioDescriptionActive.bind(this);
    this.closeSpinner = this.closeSpinner.bind(this);
    this.resetPlayedAudioClips = this.resetPlayedAudioClips.bind(this);
    this.changeAudioDescription = this.changeAudioDescription.bind(this);
    this.pauseAudioClips = this.pauseAudioClips.bind(this);

    this.handleFeedbackPopup = this.handleFeedbackPopup.bind(this);
    this.handleFeedbackPopupClose = this.handleFeedbackPopupClose.bind(this);
    this.playFullscreen = this.playFullscreen.bind(this);

    this.handleTurnOffDescriptions = this.handleTurnOffDescriptions.bind(this);
    this.handleTurnOnDescriptions = this.handleTurnOnDescriptions.bind(this);
    this.goToErrorPage = this.goToErrorPage.bind(this);

    this.getHighestRatingADId = this.getHighestRatingADId.bind(this);

    /* start of email */
    this.sendOptInEmail = this.sendOptInEmail.bind(this);
    /* end of email */
  }

  componentDidMount() {
    SocialShareKit.init();

    this.fetchVideoData();
  }

  goToErrorPage() {
    browserHistory.push("/not-found");
  }

  getAudioClips() {
    if (
      this.state.audioDescriptionsIdsAudioClips &&
      this.state.selectedAudioDescriptionId
    ) {
      if (
        this.state.audioDescriptionsIdsAudioClips[
          this.state.selectedAudioDescriptionId
        ]
      ) {
        return this.state.audioDescriptionsIdsAudioClips[
          this.state.selectedAudioDescriptionId
        ];
      }
    }
    return [];
  }

  // 2
  fetchVideoData() {
    // console.log('2 -> fetchingVideoData');
    const self = this;
    const url = `${conf.apiUrl}/videos/${this.props.params.videoId}`;

    ourFetch(url)
      .then((response) => {
        if (response.result) {
          self.setState(
            {
              videoData: response.result,
            },
            () => {
              self.parseVideoData();
            }
          );
        } else {
          self.parseVideoData();
        }
      })
      .catch((err) => {
        return this.goToErrorPage();
      });
  }

  // 3
  parseVideoData() {
    // console.log('3 -> parseVideoData');
    const videoData = Object.assign({}, this.state.videoData);
    // if (Object.keys(videoData).length === 0) {
    //   console.log('invalid video');
    // }
    const audioDescriptionsIds = [];
    const audioDescriptionsIdsUsers = {};
    const audioDescriptionsIdsAudioClips = {};

    if (
      videoData &&
      videoData.audio_descriptions &&
      videoData.audio_descriptions.length > 0
    ) {
      videoData.audio_descriptions.forEach((ad) => {
        if (ad.status === "published") {
          audioDescriptionsIds.push(ad._id);
          audioDescriptionsIdsUsers[ad._id] = ad.user;
          audioDescriptionsIdsUsers[ad._id].overall_rating_votes_counter =
            ad.overall_rating_votes_counter;
          audioDescriptionsIdsUsers[ad._id].overall_rating_average =
            ad.overall_rating_average;
          audioDescriptionsIdsUsers[ad._id].overall_rating_votes_sum =
            ad.overall_rating_votes_sum;
          audioDescriptionsIdsUsers[ad._id].feedbacks = ad.feedbacks;
          audioDescriptionsIdsAudioClips[ad._id] = [];
          if (ad.audio_clips.length > 0) {
            ad.audio_clips.forEach((audioClip) => {
              audioClip.url = `${conf.audioClipsUploadsPath}${audioClip.file_path}/${audioClip.file_name}`;
              audioDescriptionsIdsAudioClips[ad._id].push(audioClip);
            });
          }
        }
      });
    }
    console.log("audioDescriptionsIdsUsers", audioDescriptionsIdsUsers);
    this.setState(
      {
        videoData,
        audioDescriptionsIds,
        audioDescriptionsIdsUsers,
        audioDescriptionsIdsAudioClips,
      },
      () => {
        this.setAudioDescriptionActive();
      }
    );
  }

  getHighestRatingADId() {
    let maxAvarage = 0;
    let selectedId = null;
    Object.keys(this.state.audioDescriptionsIdsUsers).forEach((adId, idx) => {
      const current = this.state.audioDescriptionsIdsUsers[adId];
      if (idx === 0) {
        selectedId = adId;
        if (current.overall_rating_average) {
          maxAvarage = current.overall_rating_average;
        }
      } else if (current.overall_rating_average > maxAvarage) {
        selectedId = adId;
        maxAvarage = current.overall_rating_average;
      }
    });
    return selectedId;
  }

  // 4
  setAudioDescriptionActive() {
    // console.log('4 -> setAudioDescriptionActive');
    let selectedAudioDescriptionId = null;
    if (this.state.selectedAudioDescriptionId !== null) {
      selectedAudioDescriptionId = this.state.selectedAudioDescriptionId;
    } else {
      console.log("SELECTED", this.getHighestRatingADId());
      // selectedAudioDescriptionId = this.state.audioDescriptionsIds[0];
      selectedAudioDescriptionId = this.getHighestRatingADId();
    }

    // Invalid audio description id passed.
    if (
      this.state.audioDescriptionsIds.length &&
      this.state.audioDescriptionsIds.indexOf(selectedAudioDescriptionId) === -1
    ) {
      return this.goToErrorPage();
    }

    const location = Object.assign({}, browserHistory.getCurrentLocation());
    Object.assign(location.query, { ad: selectedAudioDescriptionId });
    browserHistory.push(location);
    this.setState(
      {
        selectedAudioDescriptionId,
      },
      () => {
        this.preLoadAudioClips();
      }
    );
  }

  // 5
  preLoadAudioClips() {
    // console.log('5 -> preLoadAudioClips');
    const self = this;
    const audioClips = this.getAudioClips();

    if (audioClips.length > 0) {
      const promises = [];

      audioClips.forEach((audioObj, idx) => {
        promises.push(ourFetch(audioObj.url, false));
      });
      Promise.all(promises)
        .then(() => {
          self.getYTVideoInfo();
        })
        .catch((errorAllAudios) => {
          console.log("ERROR LOADING AUDIOS -> ", errorAllAudios);
        });
    } else {
      self.getYTVideoInfo();
    }
  }

  // 6
  getYTVideoInfo() {
    // console.log('6 -> getYTVideoInfo');
    const self = this;
    const url = `${conf.youTubeApiUrl}/videos?id=${this.state.videoId}&part=contentDetails,snippet,statistics&forUsername=iamOTHER&key=${conf.youTubeApiKey}`;

    // Use custom fetch for cross-browser compatability
    ourFetch(url)
      .then((data) => {
        this.videoDurationInSeconds = convertISO8601ToSeconds(
          data.items[0].contentDetails.duration
        );
        this.setState(
          {
            videoTitle: data.items[0].snippet.title,
            videoAuthor: data.items[0].snippet.channelTitle,
            videoPublishedAt: convertISO8601ToDate(
              data.items[0].snippet.publishedAt
            ),
            videoDescription: data.items[0].snippet.description,
            videoViews: convertViewsToCardFormat(
              data.items[0].statistics.viewCount
            ),
            videoLikes: convertLikesToCardFormat(
              data.items[0].statistics.likeCount
            ),
            videoDislikes: convertLikesToCardFormat(
              data.items[0].statistics.dislikeCount
            ),
            videoDurationInSeconds: this.videoDurationInSeconds,
            videoDurationToDisplay: convertSecondsToEditorFormat(
              this.videoDurationInSeconds
            ),
          },
          () => {
            document.title = `YouDescribe - ${this.state.videoTitle}`;
            self.initVideoPlayer();
          }
        );
      })
      .catch((err) => {
        console.log("Unable to load the video you are trying to edit.", err);
        alert(
          "Thank you for visiting YouDescribe. This video is not viewable at this time due to YouTube API key limits. Our key is reset by Google at midnight Pacific time."
        );
        //this.goToErrorPage();
      });
  }

  // 7
  initVideoPlayer() {
    // console.log('7 -> initVideoPlayer');
    const self = this;

    // 8
    function startVideo() {
      // console.log('8 -> startVideo');
      if (self.state.videoPlayer === null) {
        self.setState({
          videoPlayer: new YT.Player("playerVP", {
            width: "100%",
            videoId: self.state.videoId,
            playerVars: {
              cc_load_policy: 1,
              rel: 0,
              controls: 1,
              disablekb: 0,
              fs: 0,
              iv_load_policy: 3,
              modestbranding: 1,
              showinfo: 0,
              autoplay: 0,
            },
            events: {
              onReady: onVideoPlayerReady,
              onStateChange: onPlayerStateChange,
            },
          }),
        });
      }
    }

    if (YT.loaded) {
      startVideo();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        startVideo();
      };
    }

    // 9
    function onVideoPlayerReady() {
      // console.log('9 -> onVideoPlayerReady');
      self.closeSpinner();
    }

    function onPlayerStateChange(event) {
      self.setState({ videoState: event.data }, () => {
        switch (event.data) {
          case 0: // ended
            self.stopProgressWatcher();
            break;
          case 1: // playing
            self.startProgressWatcher();
            break;
          case 2: // paused
            // stops all inline clip instances
            for (const clip in self.audioClipsPlayed) {
              if (self.audioClipsPlayed[clip].playbackType === "inline") {
                self.audioClipsPlayed[clip].stop();
              }
            }

            // clears out the inline clips array so audio no longer ducked
            self.setState({ inlineClipsCurrentlyPlaying: [] });

            self.stopProgressWatcher();
            break;
          case 3: // buffering
            break;
          case 5: // video cued
            self.state.videoPlayer.playVideo();
            self.startProgressWatcher();
            break;
          default:
            self.stopProgressWatcher();
        }
      });
    }
  }

  // 10
  startProgressWatcher() {
    // console.log('10 -> startProgressWatcher');
    const self = this;
    const audioClips = this.getAudioClips();

    // Interval specification. Can modifiy as necessary
    const interval = 250;

    if (this.watcher) {
      this.stopProgressWatcher();
    }

    this.watcher = setInterval(() => {
      const currentVideoProgress = self.state.videoPlayer.getCurrentTime();

      // audio ducking
      self.state.inlineClipsCurrentlyPlaying.length
        ? self.state.videoPlayer.setVolume(
            (100 - self.state.balancerValue) * 0.4
          )
        : self.state.videoPlayer.setVolume(100 - self.state.balancerValue);

      for (const clip in this.audioClipsPlayed) {
        this.audioClipsPlayed[clip].volume(self.state.balancerValue / 100);
      }

      this.setState({
        videoPlayerAccessibilitySeekbarValue:
          currentVideoProgress / this.state.videoDurationInSeconds,
        currentVideoProgress: convertSecondsToEditorFormat(
          Math.floor(currentVideoProgress)
        ),
      });

      const currentVideoProgressFloor = Math.floor(currentVideoProgress);

      for (let i = 0; i < audioClips.length; i += 1) {
        const audioClip = audioClips[i];

        // Always try to play the clip
        if (Math.floor(audioClip.start_time) === currentVideoProgressFloor) {
          self.playAudioClip(audioClip);
        }
      }
    }, interval);

    /* start of email */
    this.sendOptInEmail(1);
    /* end of email */
  }

  stopProgressWatcher() {
    // console.log('stopProgressWatcher');
    if (this.watcher) {
      clearInterval(this.watcher);
      this.watcher = null;
    }
  }

  playAudioClip(audioClip) {
    const self = this;
    const audioClipId = audioClip._id;
    const playbackType = audioClip.playback_type;

    if (!this.audioClipsPlayed.hasOwnProperty(audioClipId)) {
      this.audioClipsPlayed[audioClipId] = new Howl({
        src: [audioClip.url],
        html5: false,
        volume: self.state.balancerValue / 100,
        onplay: () => {
          if (playbackType === "extended") {
            self.state.videoPlayer.pauseVideo();
          }
          if (playbackType === "inline") {
            const inlineClipsCurrentlyPlaying =
              self.state.inlineClipsCurrentlyPlaying;

            inlineClipsCurrentlyPlaying.push(audioClipId);
            self.setState({ inlineClipsCurrentlyPlaying });
          }
        },
        onend: () => {
          if (playbackType === "extended") {
            self.state.videoPlayer.playVideo();
          }
          if (playbackType === "inline") {
            const inlineClipsCurrentlyPlaying =
              self.state.inlineClipsCurrentlyPlaying;

            inlineClipsCurrentlyPlaying.pop();
            if (!inlineClipsCurrentlyPlaying.length) {
              self.state.videoPlayer.setVolume(100 - self.state.balancerValue);
            }
            self.setState({ inlineClipsCurrentlyPlaying });
          }
        },
      });

      console.log(
        "Audio clip playback started",
        playbackType,
        audioClip.start_time
      );
      this.audioClipsPlayed[audioClipId].playbackType = playbackType;
      this.audioClipsPlayed[audioClipId].play();
    }
  }

  resetPlayedAudioClips() {
    const audioClipsIds = Object.keys(this.audioClipsPlayed);
    audioClipsIds.forEach((id) => this.audioClipsPlayed[id].stop());
    this.audioClipsPlayed = {};
  }

  pauseAudioClips() {
    const audioClipsObjs = Object.values(this.audioClipsPlayed);
    audioClipsObjs.forEach((howler) => howler.stop());
  }

  changeAudioDescription(selectedAudioDescriptionId) {
    this.state.videoPlayer.stopVideo();
    this.resetPlayedAudioClips();
    this.setState(
      {
        selectedAudioDescriptionId,
      },
      () => {
        this.setAudioDescriptionActive();
      }
    );
  }

  handleDescriberChange(id) {
    this.changeAudioDescription(id);
    document.getElementById("play-pause-button").style.outline = "none";
    document.getElementById("play-pause-button").focus();
  }

  componentWillUnmount() {
    if (this.state.videoPlayer) {
      this.state.videoPlayer.stopVideo();
    }
    this.resetPlayedAudioClips();
    this.stopProgressWatcher();
  }

  updateState(newState, callback) {
    this.setState(newState, callback);
  }

  closeSpinner() {
    const spinner = document.getElementsByClassName("spinner")[0];
    spinner.style.display = "none";
  }

  /* start of email */
  sendOptInEmail(optIn, rating = 0, feedback = []) {
    let emailBody = "";
    if (optIn == 1) {
      emailBody = `Your audio description ${window.location.href} has been viewed.`;
    } else if (optIn == 2) {
      emailBody = `Your audio description ${window.location.href} has been rated as ${rating}`;
      emailBody +=
        feedback.length > 0 ? ", with the following comment(s):" : ".";
      feedback.forEach((index) => {
        emailBody += `\n${conf.audioDescriptionFeedbacks[index]}`;
      });
    }
    const url = `${conf.apiUrl}/users/sendoptinemail`;
    const optionObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: this.state.selectedAudioDescriptionId,
        optin: optIn,
        emailbody: emailBody,
      }),
    };
    ourFetch(url, true, optionObj).then((response) => {});
  }
  /* end of email */

  handleRatingPopup() {
    if (!this.props.getAppState().isSignedIn) {
      alert(this.props.translate("You have to be logged in in order to vote"));
    } else {
      document.getElementById("rating-popup").style.display = "block";
      document.getElementById("rating-popup").focus();
    }
  }

  handleRatingPopupClose() {
    document.getElementById("rating-popup").style.display = "none";
  }

  handleFeedbackPopup() {
    document.getElementById("feedback-popup").style.display = "block";
    document.getElementById("feedback-popup").focus();
  }

  handleFeedbackPopupClose() {
    document.getElementById("feedback-popup").style.display = "none";
  }

  playFullscreen() {
    const $ = document.querySelector.bind(document);
    const iframe = $("#playerVP");
    const requestFullScreen =
      iframe.requestFullScreen ||
      iframe.mozRequestFullScreen ||
      iframe.webkitRequestFullScreen;

    if (requestFullScreen) {
      requestFullScreen.bind(iframe)();
    }
  }

  handleTurnOffDescriptions() {
    this.setState({ showDescribersList: false }, () => {
      document.getElementById("describers").style.display = "none";
      document.getElementById("descriptions-off").style.display = "block";
      const currentSelected = this.state.selectedAudioDescriptionId;
      this.state.videoPlayer.stopVideo();
      this.resetPlayedAudioClips();
      this.setState(
        {
          previousSelectedAudioDescriptionId: currentSelected,
          selectedAudioDescriptionId: null,
        },
        () => {
          this.initVideoPlayer();
        }
      );
    });
  }

  handleTurnOnDescriptions(selectedAudioDescriptionId) {
    this.setState({ showDescribersList: true }, () => {
      document.getElementById("describers").style.display = "block";
      document.getElementById("descriptions-off").style.display = "none";
      const previousSelected = this.state.previousSelectedAudioDescriptionId;
      this.state.videoPlayer.stopVideo();
      this.resetPlayedAudioClips();
      this.setState(
        {
          previousSelectedAudioDescriptionId: null,
          selectedAudioDescriptionId: previousSelected,
        },
        () => {
          this.setAudioDescriptionActive();
        }
      );
    });
  }

  // 1
  render() {
    return (
      <div>
        <div id="video-embed">
          <div id="playerVP" />
        </div>
        <div id="youDescribeFeatures">
          <VideoPlayerControls
            className={"video-player-controls-embed"}
            getAppState={this.props.getAppState}
            updateState={this.updateState}
            changeAudioDescription={this.changeAudioDescription}
            resetPlaionyedAudioClips={this.resetPlayedAudioClips}
            playFullscreen={this.playFullscreen}
            audioDescriptionsIdsUsers={this.state.audioDescriptionsIdsUsers}
            selectedAudioDescriptionId={this.state.selectedAudioDescriptionId}
            videoId={this.state.videoId}
            pauseAudioClips={this.pauseAudioClips}
            {...this.state}
          ></VideoPlayerControls>
          <a
            id="imageLink"
            href={`http://youdescribe.org/video/${this.state.videoId}`}
            target="_blank"
            onClick={() => {
              this.pauseAudioClips();
              this.state.videoPlayer.pauseVideo();
            }}
          >
            <img
              id="youDescribeImage"
              alt="Watch this video on YouDescribe"
              src="/assets/img/youdescribe_logo_full_(indigo_and_grey).png"
            />
          </a>
        </div>
      </div>
    );
  }
}

VideoEmbed.PropTypes = {
  params: PropTypes.object.isRequired,
  trnaslate: PropTypes.object.isRequired,
  videoId: PropTypes.string.isRequired,
  getAppState: PropTypes.func.isRequired,
};

export default VideoEmbed;
