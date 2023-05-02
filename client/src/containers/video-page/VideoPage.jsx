import React, { Component } from "react";
import { browserHistory } from "react-router";
import PropTypes from "prop-types";
import { Howl } from "howler";
import Spinner from "../../components/spinner/Spinner.jsx";
import VideoPlayerControls from "../../components/video-player-controls/VideoPlayerControls.jsx";
import DescriberCard from "../../components/describer-card/DescriberCard.jsx";
import YTInfoCard from "../../components/yt-info-card/YTInfoCard.jsx";
import RatingsInfoCard from "../../components/ratings-info-card/RatingsInfoCard.jsx";
import Button from "../../components/button/Button.jsx";
import RatingPopup from "../../components/rating-popup/RatingPopup.jsx";
import FeedbackPopup from "../../components/feedback-popup/FeedbackPopup.jsx";
import { ToastContainer } from "react-toastify";
import {
  ourFetch,
  convertISO8601ToSeconds,
  convertISO8601ToDate,
  convertSecondsToEditorFormat,
  convertViewsToCardFormat,
  convertLikesToCardFormat,
} from "../../shared/helperFunctions";
import ShareBar from "../../components/share-bar/ShareBar.jsx";
import { CloudSnowFill } from "react-bootstrap-icons";

const conf = require("../../shared/config")();

class VideoPage extends Component {
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
      currentClip: null,

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
      oldvolume: 0,
    };

    this.updateState = this.updateState.bind(this);
    this.setAudioDescriptionActive = this.setAudioDescriptionActive.bind(this);
    this.closeSpinner = this.closeSpinner.bind(this);
    this.resetPlayedAudioClips = this.resetPlayedAudioClips.bind(this);
    this.changeAudioDescription = this.changeAudioDescription.bind(this);
    this.pauseAudioClips = this.pauseAudioClips.bind(this);
    this.handleRatingSubmit = this.handleRatingSubmit.bind(this);
    this.handleDescriberChange = this.handleDescriberChange.bind(this);
    this.handleAddDescription = this.handleAddDescription.bind(this);
    this.handleRatingPopup = this.handleRatingPopup.bind(this);
    this.handleRatingPopupClose = this.handleRatingPopupClose.bind(this);
    this.handleFeedbackPopup = this.handleFeedbackPopup.bind(this);
    this.handleFeedbackPopupClose = this.handleFeedbackPopupClose.bind(this);
    this.playFullscreen = this.playFullscreen.bind(this);
    this.handleFeedbackSubmit = this.handleFeedbackSubmit.bind(this);
    this.handleTurnOffDescriptions = this.handleTurnOffDescriptions.bind(this);
    this.handleTurnOnDescriptions = this.handleTurnOnDescriptions.bind(this);
    this.goToErrorPage = this.goToErrorPage.bind(this);
    this.upVote = this.upVote.bind(this);
    this.getHighestRatingADId = this.getHighestRatingADId.bind(this);
    this.checkSeek = this.checkSeek.bind(this);
    /* start of email */
    this.sendOptInEmail = this.sendOptInEmail.bind(this);
    /* end of email */
  }

  componentDidMount() {
    SocialShareKit.init();
    document.getElementById("video-page").focus();
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
      console.log("playerStateChange", event.data);
      self.setState({ videoState: event.data }, () => {
        switch (event.data) {
          case -1: // unstarted
            // self.stopProgressWatcher();
            break;
          case 0: // ended
            // self.stopProgressWatcher();
            break;
          case 1: // playing
            if (
              self.state.currentClip &&
              self.state.currentClip.playbackType === "extended"
            ) {
              self.state.videoPlayer.pauseVideo();
              if (self.state.currentClip.audio.playing()) {
                self.pauseAudioClips();
              } else {
                self.state.currentClip.audio.play();
              }
            } else {
              self.checkSeek();
              self.startProgressWatcher();
            }
            break;
          case 2: // paused
            //self.stopProgressWatcher();
            if (
              self.state.currentClip &&
              self.state.currentClip.playbackType !== "extended"
            ) {
              self.pauseAudioClips();
            }

            break;
          case 3: // buffering
            if (
              self.state.currentClip &&
              self.state.currentClip.playbackType !== "extended"
            ) {
              self.state.currentClip.audio.stop();
              self.state.currentClip = null;
            }

            break;
          case 5: // video cued
            // Starting the watcher.
            self.state.videoPlayer.playVideo();
            // self.startProgressWatcher();
            break;
          default:
        }
      });
    }
  }

  checkSeek() {
    if (this.state.selectedAudioDescriptionId) {
      if (this.state.currentClip) {
        this.state.currentClip.audio.stop();
        this.state.currentClip = null;
      }

      const audioClips =
        this.state.audioDescriptionsIdsAudioClips[
          this.state.selectedAudioDescriptionId
        ];

      let videoTimestamp = this.state.videoPlayer.getCurrentTime();

      //check nearest video. If video is inline, check the start time + duration of clip. If the video timestamp
      //falls in between, seek to the time (video timestamp - clip duration) of that clip. Then, play clip.

      //round to 2 nearest dec
      videoTimestamp = Math.round(videoTimestamp * 100) / 100;

      for (let i = 0; i < audioClips.length; i += 1) {
        const clip = audioClips[i];
        console.log(clip);
        if (clip.playback_type === "inline") {
          let startTime = Math.round(clip.start_time * 100) / 100;
          let duration = Math.round(clip.duration * 100) / 100;
          console.log(startTime);
          console.log(duration);
          //clip and video are overlapping, seek through audio clip and exit loop
          if (startTime > videoTimestamp) {
            break;
          }
          if (
            startTime < videoTimestamp &&
            videoTimestamp < startTime + duration
          ) {
            const diff = videoTimestamp - startTime;
            this.playAudioClip(clip, diff);
            break;
          }
        }
      }
    }
  }

  // 10
  startProgressWatcher() {
    if (this.state.selectedAudioDescriptionId) {
      const self = this;
      console.log("10 -> startProgressWatcher");

      const audioClips =
        this.state.audioDescriptionsIdsAudioClips[
          this.state.selectedAudioDescriptionId
        ];
      const interval = 50;

      if (this.watcher) {
        this.stopProgressWatcher();
      }

      this.watcher = setInterval(() => {
        const currentVideoProgress = this.state.videoPlayer.getCurrentTime();
        const videoVolume = this.state.videoPlayer.getVolume();
        const playheadPosition =
          756 * (currentVideoProgress / this.videoDurationInSeconds);

        //Audio ducking.
        if (this.state.currentClip) {
          this.state.currentClip.audio.volume(self.state.balancerValue / 100);
          this.state.videoPlayer.setVolume(
            (100 - self.state.balancerValue) * 0.4
          );
        }

        this.setState({
          currentVideoProgress,
          currentVideoProgressToDisplay:
            convertSecondsToEditorFormat(currentVideoProgress),
          playheadPosition,
          videoVolume,
        });

        const currentVideoProgressFloor =
          Math.round(currentVideoProgress * 100) / 100;

        for (let i = 0; i < audioClips.length; i += 1) {
          const audioClip = audioClips[i];
          if (
            currentVideoProgressFloor >= parseFloat(parseFloat(audioClip.start_time) - 0.07) &&
            currentVideoProgressFloor <= parseFloat(parseFloat(audioClip.start_time) + 0.07)
          ) {
            if (!this.state.currentClip) {
              this.state.oldvolume = this.state.videoPlayer.getVolume();
              self.playAudioClip(audioClip);
            }
          }
        }
      }, interval);
    }
  }

  stopProgressWatcher() {
    console.log("stopProgressWatcher");
    if (this.watcher) {
      clearInterval(this.watcher);
      this.watcher = null;
    }
  }
  playAudioClip(audioClip, timestamp = null) {
    if (this.state.currentClip === null) {
      const self = this;
      const playbackType = audioClip.playback_type;
      const url = audioClip.url;
      const clip = new Howl({
        src: [url],
        html5: false,

        onplay: () => {
          if (playbackType === "extended") {
            //self.stopProgressWatcher();
            self.state.videoPlayer.pauseVideo();
          }
        },
        onend: () => {
          this.state.currentClip = null;
          if (playbackType === "extended") {
            self.state.videoPlayer.playVideo();
          } else {
            setInterval(() => {
              if (this.state.videoPlayer.getVolume() <= this.state.oldvolume) {
                this.state.videoPlayer.setVolume(
                  this.state.videoPlayer.getVolume() + 1
                );
              }
            }, 10);
          }

          self.startProgressWatcher();
        },

        onstop: () => {
          this.state.currentClip = null;
        },
      });

      this.state.currentClip = {
        audio: clip,
        playbackType: playbackType,
        duration: audioClip.duration,
        start_time: audioClip.start_time,
      };

      if (timestamp) {
        clip.seek(timestamp);
      }
      clip.play();
    }
  }
  resetPlayedAudioClips() {
    // const audioClipsIds = Object.keys(this.audioClipsPlayed);
    // audioClipsIds.forEach((id) => this.audioClipsPlayed[id].stop());
    // this.audioClipsPlayed = {};
  }

  pauseAudioClips() {
    if (this.state.currentClip) {
      if (this.state.currentClip.playbackType === "inline") {
        this.state.currentClip.audio.stop();
        this.state.currentClip = null;
      } else {
        this.state.currentClip.audio.pause();
      }
    }
  }

  changeAudioDescription(selectedAudioDescriptionId) {
    console.log(selectedAudioDescriptionId);
    if (this.state.currentClip) {
      this.state.currentClip.audio.stop();
    }
    this.state.videoPlayer.stopVideo();

    this.setState(
      {
        selectedAudioDescriptionId: selectedAudioDescriptionId,
        currentClip: null,
      },
      () => {
        this.setAudioDescriptionActive();
      }
    );
  }

  handleDescriberChange(id) {
    if (this.state.currentClip) {
      this.state.currentClip.audio.stop();
    }
    this.stopProgressWatcher();
    this.changeAudioDescription(id);
    // document.getElementById("play-pause-button").style.outline = "none";
    // document.getElementById("play-pause-button").focus();
  }

  handleAddDescription() {
    if (this.props.getAppState().isSignedIn) {
      // alert('We are upgrading our systems! This feature is currently unavailable')
      browserHistory.push("/authoring-tool/" + this.state.videoId);
    } else {
      alert(this.props.translate("You must sign in to perform this action"));
    }
  }

  componentWillUnmount() {
    if (this.state.currentClip) {
      this.state.currentClip.audio.stop();
    }
    if (this.state.videoPlayer) {
      this.state.videoPlayer.stopVideo();
    }

    this.stopProgressWatcher();
  }

  updateState(newState, callback) {
    this.setState(newState, callback);
  }

  closeSpinner() {
    const spinner = document.getElementsByClassName("spinner")[0];
    spinner.style.display = "none";
  }

  handleRatingSubmit(rating) {
    if (rating === 0) alert("You must select a rating");
    else if (!this.props.getAppState().isSignedIn) {
      alert(this.props.translate("You have to be logged in in order to vote"));
    } else {
      this.rating = rating;
      const url = `${conf.apiUrl}/audiodescriptionsrating/${this.state.selectedAudioDescriptionId}`;

      ourFetch(url, true, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: this.props.getAppState().userId,
          userToken: this.props.getAppState().userToken,
          rating,
        }),
      })
        .then((res) => {
          if (rating === 5) {
            // alert(`You have successfully given this description a rating of ${rating}`);
            document.getElementById("rating-popup").style.display = "none";
            document.getElementById("rating-success").style.display = "block";
            document.getElementById("rating-success").focus();
            setTimeout(
              () =>
                (document.getElementById("rating-success").style.display =
                  "none"),
              1000
            );

            /* start of email */
            this.sendOptInEmail(2, this.rating, []);
            /* end of email */
          } else {
            this.handleFeedbackPopup();
          }
          const describers = { ...this.state.audioDescriptionsIdsUsers };
          const selectedId = this.state.selectedAudioDescriptionId;

          if (!describers[selectedId].overall_rating_votes_sum) {
            describers[selectedId].overall_rating_votes_sum = 0;
          }
          if (!describers[selectedId].overall_rating_votes_counter) {
            describers[selectedId].overall_rating_votes_counter = 0;
          }
          if (!describers[selectedId].overall_rating_average) {
            describers[selectedId].overall_rating_average = 0;
          }

          describers[selectedId].overall_rating_votes_sum += rating;
          describers[selectedId].overall_rating_votes_counter += 1;
          describers[selectedId].overall_rating_average =
            describers[selectedId].overall_rating_votes_sum /
            describers[selectedId].overall_rating_votes_counter;

          this.setState({
            audioDescriptionsIdsUsers: describers,
          });

          // close rating popup
          document.getElementById("rating-popup").style.display = "none";
        })
        .catch((err) => {
          console.log(err);
          alert(
            this.props.translate(
              "It was impossible to vote. Maybe your session has expired. Try to logout and login again."
            )
          );
        });
    }
  }

  handleFeedbackSubmit(feedback) {
    const url = `${conf.apiUrl}/audiodescriptionsrating/${this.state.selectedAudioDescriptionId}`;

    ourFetch(url, true, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: this.props.getAppState().userId,
        userToken: this.props.getAppState().userToken,
        rating: this.rating,
        feedback,
      }),
    })
      .then((res) => {
        document.getElementById("feedback-popup").style.display = "none";
        document.getElementById("feedback-success").style.display = "block";
        document.getElementById("feedback-success").focus();
        setTimeout(
          () =>
            (document.getElementById("feedback-success").style.display =
              "none"),
          1000
        );
        // alert('Thanks for your feedback!');

        /* start of email */
        this.sendOptInEmail(2, this.rating, feedback);
        /* end of email */
      })
      .catch((err) => {
        console.log(err);
        alert(
          this.props.translate(
            "It was impossible to vote. Maybe your session has expired. Try to logout and login again."
          )
        );
      });
  }

  /* start of email */
  sendOptInEmail(optIn, rating = 0, feedback = []) {
    let emailBody = "";
    if (optIn == 1) {
      emailBody = `Your audio description for ${this.state.videoTitle} has been viewed. 
      View it here:  ${window.location.href}`;
    } else if (optIn == 2) {
      emailBody = `Your audio description for  ${this.state.videoTitle} has been rated as ${rating}.
      View it here: ${window.location.href}`;
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
    if (this.state.currentClip) {
      this.state.currentClip.audio.stop();
      this.stopProgressWatcher();
    }
    this.setState({ showDescribersList: false }, () => {
      document.getElementById("describers").style.display = "none";
      document.getElementById("descriptions-off").style.display = "block";
      const currentSelected = this.state.selectedAudioDescriptionId;
      this.state.videoPlayer.stopVideo();

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

  upVote(e) {
    if (!this.props.getAppState().isSignedIn) {
      alert(this.props.translate("You have to be logged in in order to vote"));
    } else {
      const url = `${conf.apiUrl}/wishlist`;
      ourFetch(url, true, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          youTubeId: this.state.videoId,
          userId: this.props.getAppState().userId,
          userToken: this.props.getAppState().userToken,
        }),
      })
        .then((res) => {
          console.log("Success upVote");
        })
        .catch((err) => {
          switch (err.code) {
            case 67:
              alert(
                this.props.translate(
                  "It is not possible to vote again for this video."
                )
              );
              break;
            default:
              alert(
                this.props.translate(
                  "It was impossible to vote. Maybe your session has expired. Try to logout and login again."
                )
              );
          }
        });
    }
  }

  // 1
  render() {
    // console.log('1 -> Render');
    const selectedId = this.state.selectedAudioDescriptionId;
    const describers = this.state.audioDescriptionsIdsUsers;
    const describerCards = [];
    let describerIds = Object.keys(describers);

    if (describerIds.length) {
      document.getElementById("no-descriptions").style.display = "none";
      if (this.state.showDescribersList) {
        document.getElementById("describers").style.display = "block";
      }
    }

    if (describerIds.length && describerIds[0] !== selectedId) {
      const selectedIdIndex = describerIds.indexOf(selectedId);
      describerIds = describerIds
        .splice(selectedIdIndex, 1)
        .concat(describerIds);
    }

    describerIds.forEach((describerId, i) => {
      describerCards.push(
        <DescriberCard
          key={i}
          translate={this.props.translate}
          handleDescriberChange={this.handleDescriberChange}
          handleRatingPopup={this.handleRatingPopup}
          describerId={describerId}
          selectedDescriberId={selectedId}
          {...describers[describerId]}
        />
      );
    });

    return (
      <div id="video-page">
        <main role="main" title="Video page">
          <section id="video-area">
            <ToastContainer />
            <ShareBar videoTitle={this.state.videoTitle} />
            <div id="video">
              <Spinner translate={this.props.translate} />
              <div id="playerVP" />
            </div>
            <VideoPlayerControls
              getAppState={this.props.getAppState}
              updateState={this.updateState}
              changeAudioDescription={this.changeAudioDescription}
              resetPlayedAudioClips={this.resetPlayedAudioClips}
              playFullscreen={this.playFullscreen}
              audioDescriptionsIdsUsers={this.state.audioDescriptionsIdsUsers}
              selectedAudioDescriptionId={this.state.selectedAudioDescriptionId}
              videoId={this.state.videoId}
              pauseAudioClips={this.pauseAudioClips}
              {...this.state}
            />
          </section>
          <section id="video-info" className="container w3-row">
            <RatingPopup
              translate={this.props.translate}
              handleRatingSubmit={this.handleRatingSubmit}
              handleRatingPopupClose={this.handleRatingPopupClose}
            />
            <div id="rating-success" tabIndex="-1">
              {this.props.translate("Thanks for rating this description!")}
            </div>
            <FeedbackPopup
              translate={this.props.translate}
              handleFeedbackSubmit={this.handleFeedbackSubmit}
              handleFeedbackPopupClose={this.handleFeedbackPopupClose}
            />
            <div id="feedback-success" tabIndex="-1">
              {this.props.translate("Thank you for your feedback!")}
            </div>
            <div className="w3-col l8 m8">
              <YTInfoCard translate={this.props.translate} {...this.state} />
              {this.props.location.query.show && (
                <RatingsInfoCard
                  translate={this.props.translate}
                  selectedAudioDescriptionId={
                    this.state.selectedAudioDescriptionId
                  }
                  audioDescriptionsIdsUsers={
                    this.state.audioDescriptionsIdsUsers
                  }
                />
              )}
            </div>
            <div id="describers" className="w3-col l4 m4">
              <div className="w3-card-2">
                <h3>{this.props.translate("Selected description")}</h3>
                {describerCards[0]}
                <hr aria-hidden="true" />
                <h3>{this.props.translate("Other description options")}</h3>
                {describerCards.slice(1)}
                <Button
                  title={this.props.translate(
                    "Turn off descriptions for this video"
                  )}
                  text={this.props.translate("Turn off descriptions")}
                  color="w3-indigo w3-block w3-margin-top"
                  onClick={() => this.handleTurnOffDescriptions()}
                />
                <Button
                  title={this.props.translate(
                    "Add a new description for this video"
                  )}
                  text={this.props.translate("Add description")}
                  color="w3-indigo w3-block w3-margin-top"
                  onClick={() => this.handleAddDescription()}
                />
              </div>
            </div>
            <div id="descriptions-off" className="w3-col l4 m4">
              <div className="w3-card-2">
                <h3>{this.props.translate("Descriptions off")}</h3>
                <Button
                  title={this.props.translate(
                    "Turn on descriptions for this video"
                  )}
                  text={this.props.translate("Turn on descriptions")}
                  color="w3-indigo w3-block w3-margin-top"
                  onClick={() => this.handleTurnOnDescriptions()}
                />
              </div>
            </div>
            <div id="no-descriptions" className="w3-col l4 m4">
              <div className="w3-card-2">
                <h3>No descriptions available</h3>
                <Button
                  title={this.props.translate(
                    "Request an audio description for this video"
                  )}
                  text={this.props.translate("Add to wish list")}
                  color="w3-indigo w3-block w3-margin-top"
                  onClick={() => this.upVote()}
                />
                <Button
                  title={this.props.translate(
                    "Add a new description for this video"
                  )}
                  text={this.props.translate("Add description")}
                  color="w3-indigo w3-block w3-margin-top"
                  onClick={() => this.handleAddDescription()}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

VideoPage.PropTypes = {
  params: PropTypes.object.isRequired,
  trnaslate: PropTypes.object.isRequired,
  videoId: PropTypes.string.isRequired,
  getAppState: PropTypes.func.isRequired,
};

export default VideoPage;
