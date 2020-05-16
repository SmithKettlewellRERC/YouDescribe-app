import React, { Component } from "react";
import AdminNav from "../../components/admin-nav/AdminNav.jsx";
import DescriptionRatingComponent from "./DescriptionRatingComponent.jsx";
import { Container, Row, Col, Button, FormControl, Form, Table } from "react-bootstrap";
import { Link } from "react-router";
import {
  ourFetch,
  ourFetchWithToken,
  convertISO8601ToSeconds,
  convertISO8601ToDate,
  convertSecondsToEditorFormat,
  convertViewsToCardFormat,
  convertLikesToCardFormat,
  convertTimeToCardFormat,
} from "../../shared/helperFunctions";
import PropTypes from "prop-types";
import { Howl } from "howler";
import Spinner from "../../components/spinner/Spinner.jsx";
import VideoPlayerControls from "../../components/video-player-controls/VideoPlayerControls.jsx";

const conf = require("../../shared/config")();

class DescriptionDetail extends Component {
  constructor(props) {
    super(props);

    this.watcher = null;
    this.previousVideoVolume = 0;
    this.audioClipsPlayed = {};

    this.state = {
      audioDescription: {},
      audioClips: [],
      ratings: [],
      videoId: "",          // video object id
      youtubeId: "",        // youtube id
      id: props.params.id,  // description object id
      order: props.location.query.order,
      sortBy: props.location.query.sortby,
      keyword: props.location.query.keyword,

      // Audio descriptions
      inlineClipsCurrentlyPlaying: [],
      audioDescriptionTitle: "",
      audioDescriptionUser: "",
      audioDescriptionOverallRating: 0,
      audioDescriptionStatus: "",

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
    }
    
    this.publish = this.publish.bind(this);
    this.unpublish = this.unpublish.bind(this);
    this.sendOptInEmail = this.sendOptInEmail.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.getNext = this.getNext.bind(this);

    this.updateState = this.updateState.bind(this);
    this.setAudioDescriptionActive = this.setAudioDescriptionActive.bind(this);
    this.closeSpinner = this.closeSpinner.bind(this);
    this.resetPlayedAudioClips = this.resetPlayedAudioClips.bind(this);
    this.pauseAudioClips = this.pauseAudioClips.bind(this);
    this.playFullscreen = this.playFullscreen.bind(this);
  }

  componentWillUnmount() {
    if (this.state.videoPlayer) {
      this.state.videoPlayer.stopVideo();
    }
    this.resetPlayedAudioClips();
    this.stopProgressWatcher();
  }

  componentDidMount() {
    SocialShareKit.init();
    document.title = this.props.translate("Description Detail");
    this.loadDescriptionDetail();
  }

  loadDescriptionDetail() {
    const url = `${conf.apiUrl}/audiodescriptions/getbyid?id=${this.state.id}`;
    ourFetchWithToken(url).then((response) => {
      const ratings = [];
      const item = response.result;
      const audioDescription = item.audioDescription;
      audioDescription.audio_clips.forEach(audioClip => {
        audioClip.url = `${conf.audioClipsUploadsPath}${audioClip.file_path}/${audioClip.file_name}`;
      });
      item.ratings.forEach(rating => {
        ratings.push(
          <DescriptionRatingComponent
            key={rating._id}
            _id={rating._id}
            user={rating.user_id.name}
            rating={rating.rating}
          />
        );
      });
      this.setState({
        audioDescription: audioDescription,
        audioClips: audioDescription.audio_clips,
        audioDescriptionTitle: audioDescription.video.title,
        audioDescriptionUser: audioDescription.user.name,
        audioDescriptionOverallRating: audioDescription.overall_rating_average,
        audioDescriptionStatus: audioDescription.status,
        ratings: ratings,
        videoId: audioDescription.video._id,
        youtubeId: audioDescription.video.youtube_id,
        videoData: audioDescription.video,
      });
      this.fetchVideoData();
    });
  }

  // 2
  fetchVideoData() {
    console.log("2 -> fetchingVideoData");
    this.parseVideoData();
  }

  // 3
  parseVideoData() {
    console.log("3 -> parseVideoData");
    this.setAudioDescriptionActive();
  }

  // 4
  setAudioDescriptionActive() {
    console.log("4 -> setAudioDescriptionActive");
    this.preLoadAudioClips();
  }

  getAudioClips() {
    console.log(this.state.audioClips);
    return this.state.audioClips;
  }

  // 5
  preLoadAudioClips() {
    console.log("5 -> preLoadAudioClips");
    const self = this;
    const audioClips = this.getAudioClips();

    if (audioClips.length > 0) {
      const promises = [];

      audioClips.forEach((audioObj, idx) => {
        promises.push(ourFetch(audioObj.url, false));
      });
      Promise.all(promises).then(() => {
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
    console.log("6 -> getYTVideoInfo");
    const self = this;
    const url = `${conf.youTubeApiUrl}/videos?id=${this.state.youtubeId}&part=contentDetails,snippet,statistics&forUsername=iamOTHER&key=${conf.youTubeApiKey}`;

    // Use custom fetch for cross-browser compatability
    ourFetch(url).then((data) => {
      this.videoDurationInSeconds = convertISO8601ToSeconds(data.items[0].contentDetails.duration);
      this.setState({
        videoTitle: data.items[0].snippet.title,
        videoAuthor: data.items[0].snippet.channelTitle,
        videoPublishedAt: convertISO8601ToDate(data.items[0].snippet.publishedAt),
        videoDescription: data.items[0].snippet.description,
        videoViews: convertViewsToCardFormat(data.items[0].statistics.viewCount),
        videoLikes: convertLikesToCardFormat(data.items[0].statistics.likeCount),
        videoDislikes: convertLikesToCardFormat(data.items[0].statistics.dislikeCount),
        videoDurationInSeconds: this.videoDurationInSeconds,
        videoDurationToDisplay: convertSecondsToEditorFormat(this.videoDurationInSeconds),
      }, () => {
        document.title = `YouDescribe - ${this.state.videoTitle}`;
        self.initVideoPlayer();
      });
    }).catch((err) => {
      console.log("need to check getYTVideoInfo()");
    });
  }

  // 7
  initVideoPlayer() {
    console.log("7 -> initVideoPlayer");
    const self = this;

    // 8
    function startVideo() {
      console.log("8 -> startVideo");
      if (self.state.videoPlayer === null) {
        self.setState({
          videoPlayer: new YT.Player("playerVP", {
            width: "100%",
            videoId: self.state.youtubeId,
            playerVars: {
              cc_load_policy: 1,
              rel: 0,
              controls: 0,
              disablekb: 1,
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
      console.log("9 -> onVideoPlayerReady");
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
    console.log("10 -> startProgressWatcher");
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
      self.state.inlineClipsCurrentlyPlaying.length ?
        self.state.videoPlayer.setVolume((100 - self.state.balancerValue) * 0.4) :
        self.state.videoPlayer.setVolume(100 - self.state.balancerValue);

      for (const clip in this.audioClipsPlayed) {
        this.audioClipsPlayed[clip].volume(self.state.balancerValue / 100);
      }

      this.setState({
        videoPlayerAccessibilitySeekbarValue: currentVideoProgress / this.state.videoDurationInSeconds,
        currentVideoProgress: convertSecondsToEditorFormat(Math.floor(currentVideoProgress)),
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
  }

  stopProgressWatcher() {
    console.log("stopProgressWatcher");
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
            const inlineClipsCurrentlyPlaying = self.state.inlineClipsCurrentlyPlaying;

            inlineClipsCurrentlyPlaying.push(audioClipId);
            self.setState({ inlineClipsCurrentlyPlaying });
          }
        },
        onend: () => {
          if (playbackType === "extended") {
            self.state.videoPlayer.playVideo();
          }
          if (playbackType === "inline") {
            const inlineClipsCurrentlyPlaying = self.state.inlineClipsCurrentlyPlaying;

            inlineClipsCurrentlyPlaying.pop();
            if (!inlineClipsCurrentlyPlaying.length) {
              self.state.videoPlayer.setVolume(100 - self.state.balancerValue);
            }
            self.setState({ inlineClipsCurrentlyPlaying });
          }
        },
      });

      console.log("Audio clip playback started", playbackType, audioClip.start_time);
      this.audioClipsPlayed[audioClipId].playbackType = playbackType;
      this.audioClipsPlayed[audioClipId].play();
    }
  }

  resetPlayedAudioClips() {
    const audioClipsIds = Object.keys(this.audioClipsPlayed);
    audioClipsIds.forEach(id => this.audioClipsPlayed[id].stop());
    this.audioClipsPlayed = {};
  }

  pauseAudioClips() {
    const audioClipsObjs = Object.values(this.audioClipsPlayed);
    audioClipsObjs.forEach(howler => howler.stop());
  }

  updateState(newState, callback) {
    this.setState(newState, callback);
  }

  closeSpinner() {
    const spinner = document.getElementsByClassName("spinner")[0];
    spinner.style.display = "none";
  }

  playFullscreen() {
    const $ = document.querySelector.bind(document);
    const iframe = $("#playerVP");
    const requestFullScreen = iframe.requestFullScreen ||
      iframe.mozRequestFullScreen ||
      iframe.webkitRequestFullScreen;

    if (requestFullScreen) {
      requestFullScreen.bind(iframe)();
    }
  }

  publish() {
    this.updateStatus("published");
    this.sendOptInEmail(0);
  }

  unpublish() {
    this.updateStatus("draft");
  }

  updateStatus(status) {
    const url = `${conf.apiUrl}/audiodescriptions/updatestatus`;
    const optionObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("adminToken"),
      },
      body: JSON.stringify({
        id: this.state.id,
        status: status,
      }),
    };
    ourFetchWithToken(url, true, optionObj).then((response) => {
      location.reload(true);
    });
  }

  sendOptInEmail(optIn) {
    let emailBody = "";
    let id = "";
    if (optIn == 0) {
      const ref = `${window.location.protocol}//${window.location.host}/video/${this.state.youtubeId}?ad=${this.state.id}.`;
      id = this.state.youtubeId;
      emailBody = `Your wishlist selection has been described and published:\n${ref}.`;
    } else if (optIn == 2) {
      id = this.state.id;
      emailBody = document.getElementById("emailbody").value.trim();
    }
    if (emailBody == "") {
      alert("Sorry, your feedback is empty!");
      return;
    }

    const url = `${conf.apiUrl}/users/sendoptinemail`;
    const optionObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        optin: optIn,
        emailbody: emailBody,
      })
    };
    ourFetchWithToken(url, true, optionObj).then((response) => {
      alert(response.info);
    });
  }

  getNext(isNext) {
    const url = `${conf.apiUrl}/audiodescriptions/getnext?id=${this.state.id}&isnext=${isNext}&keyword=${this.state.keyword}&sortby=${this.state.sortBy}&order=${this.state.order}`;
    ourFetchWithToken(url).then((response) => {
      if (response.result) {
        window.location.href = `/admin/description/detail/${response.result._id}?keyword=${this.state.keyword}&sortby=${this.state.sortBy}&order=${this.state.order}`;
      }
    });
  }

  render() {
    return (
      <div className="admin-responsive">
        <AdminNav/>
        <main className="w3-row">
          <div style={{textAlign: "center", fontSize: 20}}><b>Detail of Description</b></div>
          <div>
            {/* <Button variant="outline-info" type="submit" onClick={() => this.getNext(-1)}>Prev</Button> */}
            {/* <Button variant="outline-info" className="pull-right" type="submit" onClick={() => this.getNext(1)}>Next</Button> */}
            <Link onClick={() => this.getNext(-1)} style={{color: "#17a2b8", fontSize: 20}}>
              <i className="fa fa-arrow-left"/>Previous
            </Link>
            <Link onClick={() => this.getNext(1)} style={{color: "#17a2b8", fontSize: 20}} className="pull-right">
              Next<i className="fa fa-arrow-right"/>
            </Link>
          </div>
          <div style={{marginTop: 20, marginBottom: 30}}>
            <Row>
              <Col xs="auto">
                <p><b>Title:</b> {this.state.audioDescriptionTitle}</p>
                <p><b>Describer:</b> {this.state.audioDescriptionUser}</p>
                <p><b>Overall Rating:</b> {this.state.audioDescriptionOverallRating || "N/A"}</p>
                <p><b>Status:</b> {this.state.audioDescriptionStatus}</p>
                <div id="video" style={{color: "white", backgroundColor: "black"}}>
                  <Spinner translate={this.props.translate}/>
                  <div id="playerVP" />
                  <VideoPlayerControls
                    getAppState={this.props.getAppState}
                    updateState={this.updateState}
                    resetPlayedAudioClips={this.resetPlayedAudioClips}
                    playFullscreen={this.playFullscreen}
                    selectedAudioDescriptionId={this.state.id}
                    videoId={this.state.youtubeId}
                    pauseAudioClips={this.pauseAudioClips}
                    {...this.state}
                  />
                </div>
              </Col>
              <Col>
                <p><b>Actions For Admin User</b></p>
                <Button type="submit" style={{marginBottom: 10}} className="pull-left" variant="outline-success" onClick={this.publish}>Publish Description</Button>
                <Button type="submit" style={{marginBottom: 10}} className="pull-right" variant="outline-danger" onClick={this.unpublish}>Unpublish Description</Button>
                <br/>
                <FormControl as="textarea" style={{marginBottom: 10}} rows="8" placeholder="Input feedback here..." id="emailbody" className="mr-sm-2"/>
                <Button type="submit" style={{marginBottom: 60}} variant="outline-primary" onClick={() => this.sendOptInEmail(2)}>Send Feedback</Button>
                {/* <div style={{border: "0.5px solid", marginBottom: 20}}></div> */}
                <p><b>Rating Details (No Action Required)</b></p>
                <Table striped hover style={{color: "black", justifyContent: "center"}}>
                  <thead>
                    <tr><th>Viewer</th><th>Rating</th></tr>
                  </thead>
                  <tbody>
                    {this.state.ratings}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </div>
        </main>
      </div>
    );
  };
};

export default DescriptionDetail;
