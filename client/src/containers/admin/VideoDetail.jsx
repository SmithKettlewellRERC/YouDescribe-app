import React, { Component } from "react";
import AdminNav from "../../components/admin-nav/AdminNav.jsx";
import VideoRemapping from "./VideoRemapping.jsx";
import { Navbar, Nav, NavDropdown, Button, FormControl, Form, Table } from "react-bootstrap";
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
import { browserHistory } from "react-router";
import PropTypes from "prop-types";
import { Howl } from "howler";
import Spinner from "../../components/spinner/Spinner.jsx";
import VideoPlayerControls from "../../components/video-player-controls/VideoPlayerControls.jsx";
import DescriberCard from "../../components/describer-card/DescriberCard.jsx";

const conf = require("../../shared/config")();

class VideoDetail extends Component {
  constructor(props) {
    super(props);

    this.watcher = null;
    this.previousVideoVolume = 0;
    this.audioClipsPlayed = {};
    this.rating = 0;
    
    this.state = {
      similarYoutubeVideos: [],
      blackScreenYoutubeId: "XmVIRg0Xpxk",
      youtubeId: props.location.query.youtube_id || "", // youtube id
      id: props.params.id,                              // video object id
      order: props.location.query.order,
      sortBy: props.location.query.sortby,
      keyword: props.location.query.keyword,

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
    }

    this.handleSave = this.handleSave.bind(this);
    this.handleReload = this.handleReload.bind(this);
    this.getNext = this.getNext.bind(this);

    this.updateState = this.updateState.bind(this);
    this.setAudioDescriptionActive = this.setAudioDescriptionActive.bind(this);
    this.closeSpinner = this.closeSpinner.bind(this);
    this.resetPlayedAudioClips = this.resetPlayedAudioClips.bind(this);
    this.changeAudioDescription = this.changeAudioDescription.bind(this);
    this.pauseAudioClips = this.pauseAudioClips.bind(this);
    this.handleDescriberChange = this.handleDescriberChange.bind(this);
    this.playFullscreen = this.playFullscreen.bind(this);
    this.getHighestRatingADId = this.getHighestRatingADId.bind(this);
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
    document.title = "Video Remapping";
    this.loadVideoDetail();
  }

  loadVideoDetail() {
    const url = `${conf.apiUrl}/videos/getbyid?id=${this.state.id}`;
    ourFetchWithToken(url).then((response) => {
      const similarYoutubeVideos = [];
      const item = response.result;
      const youtubeId = (this.props.location.query.youtube_id || item.youtube_id);
      similarYoutubeVideos.push(
        <VideoRemapping
          key={item._id}
          originalVideo={item}
          selectedYoutubeId={youtubeId}
          keyword={this.state.keyword}
          sortBy={this.state.sortBy}
          order={this.state.order}
        />
      );
      this.setState({
        similarYoutubeVideos: similarYoutubeVideos,
        youtubeId: youtubeId,
        videoData: item,
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
    const videoData = this.state.videoData;
    const audioDescriptionsIds = [];
    const audioDescriptionsIdsUsers = {};
    const audioDescriptionsIdsAudioClips = {};

    if (videoData && videoData.audio_descriptions && videoData.audio_descriptions.length > 0) {
      videoData.audio_descriptions.forEach((ad) => {
        if (ad.status === "published") {
          audioDescriptionsIds.push(ad._id);
          audioDescriptionsIdsUsers[ad._id] = ad.user;
          audioDescriptionsIdsUsers[ad._id].overall_rating_votes_counter = ad.overall_rating_votes_counter;
          audioDescriptionsIdsUsers[ad._id].overall_rating_average = ad.overall_rating_average;
          audioDescriptionsIdsUsers[ad._id].overall_rating_votes_sum = ad.overall_rating_votes_sum;
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
    console.log("audioDescriptionsIdsUsers", audioDescriptionsIdsUsers)
    this.setState({
      videoData,
      audioDescriptionsIds,
      audioDescriptionsIdsUsers,
      audioDescriptionsIdsAudioClips,
    }, () => {
      this.setAudioDescriptionActive();
    });
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
    console.log("4 -> setAudioDescriptionActive");
    let selectedAudioDescriptionId = null;
    if (this.state.selectedAudioDescriptionId !== null) {
      selectedAudioDescriptionId = this.state.selectedAudioDescriptionId;
    } else {
      console.log("SELECTED", this.getHighestRatingADId())
      // selectedAudioDescriptionId = this.state.audioDescriptionsIds[0];
      selectedAudioDescriptionId = this.getHighestRatingADId();
    }

    // Invalid audio description id passed.
    if (this.state.audioDescriptionsIds.length && this.state.audioDescriptionsIds.indexOf(selectedAudioDescriptionId) === -1) {
      console.log("need to check setAudioDescriptionActive()");
    }

    const location = Object.assign({}, browserHistory.getCurrentLocation());
    Object.assign(location.query, { ad: selectedAudioDescriptionId });
    browserHistory.push(location);
    this.setState({
      selectedAudioDescriptionId,
    }, () => {
      this.preLoadAudioClips();
    });
  }

  getAudioClips() {
    if (this.state.audioDescriptionsIdsAudioClips && this.state.selectedAudioDescriptionId) {
      if (this.state.audioDescriptionsIdsAudioClips[this.state.selectedAudioDescriptionId]) {
        return this.state.audioDescriptionsIdsAudioClips[this.state.selectedAudioDescriptionId];
      }
    }
    return [];
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
    const url = `${conf.youTubeApiUrl}/videos?id=${this.state.youtubeId},${this.state.blackScreenYoutubeId}&part=contentDetails,snippet,statistics&forUsername=iamOTHER&key=${conf.youTubeApiKey}`;

    // Use custom fetch for cross-browser compatability
    ourFetch(url).then((data) => {
      this.videoDurationInSeconds = convertISO8601ToSeconds(data.items[0].contentDetails.duration);
      this.setState({
        youtubeId: data.items.length > 1 ? this.state.youtubeId : this.state.blackScreenYoutubeId,
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

  changeAudioDescription(selectedAudioDescriptionId) {
    this.state.videoPlayer.stopVideo();
    this.resetPlayedAudioClips();
    this.setState({
      selectedAudioDescriptionId,
    }, () => {
      this.setAudioDescriptionActive();
    });
  }

  handleDescriberChange(id) {
    this.changeAudioDescription(id);
    document.getElementById("play-pause-button").style.outline = "none";
    document.getElementById("play-pause-button").focus();
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

  handleSave() {
    // let youtubeId = this.state.youtubeId;
    // const youtubeLink = document.getElementById("youtubelink").value.trim();
    // if (youtubeLink) {
    //   if (youtubeLink.match(/^https:\/\/(?:www\.)?youtube.com\/watch\?(?=v=\w+)(?:\S+)?$/g)) {
    //     const url = new URL(youtubeLink);
    //     youtubeId = url.searchParams.get("v");
    //   } else {
    //     alert("Sorry, this is not a valid YouTube Link.");
    //     return;
    //   }
    // } else {
    //   if (youtubeId == this.state.blackScreenYoutubeId) {
    //     alert("Sorry, you need to select from the list of similar videos before remapping.");
    //     return;
    //   }
    // }
    const youtubeId = this.state.youtubeId;
    if (youtubeId == this.state.blackScreenYoutubeId) {
      alert("Sorry, you have not remapped to any video yet.");
      return;
    }
    if (confirm("Are you sure about remapping to this NEW YouTube video?")) {
      const url = `${conf.apiUrl}/videos/updateyoutubeid`;
      const optionObj = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: this.state.id,
          youtube_id: youtubeId,
        }),
      };
      ourFetch(url, true, optionObj).then((response) => {
        alert("The old video has been successfully remapped!");
      });
    }
  }

  handleReload() {
    let youtubeId = this.state.youtubeId;
    const youtubeLink = document.getElementById("youtubelink").value.trim();
    if (youtubeLink.match(/^https:\/\/(?:www\.)?youtube.com\/watch\?(?=v=\w+)(?:\S+)?$/g)) {
        const url = new URL(youtubeLink);
        youtubeId = url.searchParams.get("v");
    } else {
      alert("Sorry, this is not a valid YouTube Link.");
      return;
    }
    const location = browserHistory.getCurrentLocation();
    window.location.href = `${location.pathname}?youtube_id=${youtubeId}&keyword=${this.state.keyword}&sortby=${this.state.sortBy}&order=${this.state.order}`;
  }

  getNext(isNext) {
    const url = `${conf.apiUrl}/videos/getnext?id=${this.state.id}&isnext=${isNext}&keyword=${this.state.keyword}&sortby=${this.state.sortBy}&order=${this.state.order}`;
    ourFetchWithToken(url).then((response) => {
      if (response.result) {
        window.location.href = `/admin/video/detail/${response.result._id}?keyword=${this.state.keyword}&sortby=${this.state.sortBy}&order=${this.state.order}`;
      }
    });
  }

  // 1
  render() {
    console.log("1 -> Render");
    return (
      <div className="admin-responsive">
        <AdminNav/>
        <main className="w3-row">
          <div style={{textAlign: "center", fontSize: 20}}><b>Detail of Video Remapping</b></div>
          <div>
            <Link onClick={() => this.getNext(-1)} style={{color: "#17a2b8", fontSize: 20}}>
              <i className="fa fa-arrow-left"/>Previous
            </Link>
            <Link onClick={() => this.getNext(1)} style={{color: "#17a2b8", fontSize: 20}} className="pull-right">
              Next<i className="fa fa-arrow-right"/>
            </Link>
          </div>
          <div style={{marginTop: 20, marginBottom: 30}}>
            <b>Video Remapping Instructions:</b>
            <br/><br/>
            Under the <b>"Video To Be Remapped"</b>, if you see a <b>black screen video</b> with the length of <b>00:10:00</b>, 
            it means that the original YouTube video is gone.
            <br/><br/>
            If you know the YouTube video to be remapped, you can copy/paste its <b>https://</b> link into the <b>"YouTube 
            Link"</b> text box, and click the <b>"Reload"</b> button. Then jump to <b>"Step 2"</b> directly.
            <br/>
            If you do not know, please start from <b>"Step 1"</b> to remap.
            <br/><br/>
            <b>Step 1:</b>
            <br/>
            Scroll down to the <b>"List of Similar Videos"</b>, and select one of them. You will see that the black screen video 
            is replaced by your selection.
            <br/><br/>
            <b>Step 2:</b>
            <br/>
            Play the video under the <b>"Video To Be Remapped"</b>, and listen to the audio description. If you find the 
            description matches the video that you have selected, click the <b>"Save"</b> button to save this remapping. If not, 
            you can try with a different <b>"YouTube Link"</b>, or select another one from the <b>"List of Similar Videos"</b>.
          </div>
          <h4>Video To Be Remapped</h4>
          <p>
            <b>YouTube Link: </b> 
            <FormControl
              type="text"
              id="youtubelink"
              style={{display: "inline-block", width: "50%"}}
            />&nbsp;
            <Button type="submit" variant="outline-info" style={{fontSize: "0.8rem"}} onClick={this.handleReload}>Reload</Button>
          </p>
          <p>
            <b>Title: </b>
            {this.state.videoData.title}
          </p>
          <div id="video" style={{color: "white", backgroundColor: "black"}}>
            <Spinner translate={this.props.translate}/>
            <div id="playerVP" />
            <VideoPlayerControls
              getAppState={this.props.getAppState}
              updateState={this.updateState}
              changeAudioDescription={this.changeAudioDescription}
              resetPlayedAudioClips={this.resetPlayedAudioClips}
              playFullscreen={this.playFullscreen}
              audioDescriptionsIdsUsers={this.state.audioDescriptionsIdsUsers}
              selectedAudioDescriptionId={this.state.selectedAudioDescriptionId}
              videoId={this.state.youtubeId}
              pauseAudioClips={this.pauseAudioClips}
              {...this.state}
            />
          </div>
          <br/>
          <div style={{marginTop: 10, marginBottom: 10, textAlign: "center"}}>
            <Button type="submit" variant="outline-success" onClick={this.handleSave}>Save</Button>
          </div>
          <br/>
          {this.state.similarYoutubeVideos}
        </main>
      </div>
    );
  };
};

export default VideoDetail;