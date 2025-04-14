import React, { Component } from "react";
import { Howl } from "howler";
import SpinnerGlobal from "../../components/spinner-global/SpinnerGlobal.jsx";
import Notes from "../../components/notes/Notes.jsx";
import LanguageSelector from "../../components/language-selector/LanguageSelector.jsx";
import Editor from "../../components/editor/Editor.jsx";
import Track from "../../components/track/Track.jsx";
import {
  convertISO8601ToSeconds,
  convertSecondsToEditorFormat,
} from "../../shared/helperFunctions";
import { ourFetch, getLang } from "../../shared/helperFunctions";
import { browserHistory } from "react-router";

/* start of custom tags */
import Select from "react-select";
import Button from "../../components/button/Button.jsx";
import { ChevronCompactLeft, TrophyFill } from "react-bootstrap-icons";
/* end of custom tags */

const conf = require("../../shared/config")();

class AuthoringTool extends Component {
  constructor(props) {
    super(props);
    this.watcher = null;
    this.autoSaveTimer = null;
    this.videoDurationInSeconds = -1;
    this.audioClipsPlayed = {};

    this.state = {
      // Video main info.
      videoId: props.params.videoId,

      // Video controls and data.
      videoData: {},
      videoPlayer: null,
      videoTitle: "",
      videoDescription: "",
      videoState: -1,
      currentVideoProgress: 0,
      currentVideoProgressToDisplay: "00:00:00:00",
      videoDurationToDisplay: "",
      playheadPosition: 0,
      playheadTailHeight: 0,
      currentTimeInVideo: 0,

      // Audio descriptions.
      audioDescriptionId: null,
      audioDescriptionStatus: null,
      audioDescriptionNotes: "",
      audioDescriptionSelectedLanguage: "",
      audioDescriptionAudioClips: {},
      currentClip: null,

      // Tracks controls.
      tracksComponents: [],
      selectedTrackComponentId: null,
      selectedTrackComponentPlaybackType: null,
      selectedTrackComponentStatus: null,
      selectedTrackComponentAudioClipStartTime: 0,
      selectedTrackComponentAudioClipSEndTime: -1,
      selectedTrackComponentAudioClipDuration: -1,
      selectedTrackComponentLabel: "",
      selectedTrackComponentUrl: null,

      audioClipsPlayed: "",

      /* start of custom tags */
      tags: [],
      suggestions: [],
      delimiters: [188, 13],
      /* end of custom tags */
    };

    this.handleClick = this.handleClick.bind(this);
    this.getATState = this.getATState.bind(this);
    this.touchAD = this.touchAD.bind(this);
    this.sendAudio = this.sendAudio.bind(this);
    this.updateState = this.updateState.bind(this);
    this.publishAudioDescription = this.publishAudioDescription.bind(this);
    this.unpublishAudioDescription = this.unpublishAudioDescription.bind(this);
    this.updateTrackLabel = this.updateTrackLabel.bind(this);
    this.addAudioClipTrack = this.addAudioClipTrack.bind(this);
    this.recordAudioClip = this.recordAudioClip.bind(this);
    this.uploadAudioRecorded = this.uploadAudioRecorded.bind(this);
    this.setSelectedTrack = this.setSelectedTrack.bind(this);
    this.updateNotes = this.updateNotes.bind(this);
    this.deleteTrack = this.deleteTrack.bind(this);
    this.deleteAudioDescription = this.deleteAudioDescription.bind(this);
    this.switchTrackType = this.switchTrackType.bind(this);
    this.saveLabelsAndNotes = this.saveLabelsAndNotes.bind(this);
    this.preLoadAudioClips = this.preLoadAudioClips.bind(this);
    this.getYTVideoInfo = this.getYTVideoInfo.bind(this);
    this.nudgeTrackLeft = this.nudgeTrackLeft.bind(this);
    this.nudgeTrackRight = this.nudgeTrackRight.bind(this);
    this.autoSave = this.autoSave.bind(this);
    this.playFromStart = this.playFromStart.bind(this);
    this.checkSeek = this.checkSeek.bind(this);
    this.generateTags = this.generateTags.bind(this);
    /* start of custom tags */
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this);
    this.handleSave = this.handleSave.bind(this);
    /* end of custom tags */
    /* start of email */
    this.sendOptInEmail = this.sendOptInEmail.bind(this);
    /* end of email */
  }

  componentDidMount() {
    this.refs.spinner.on();
    document.title = this.props.translate("YouDescribe - Authoring Tool");
    console.log(
      "############## DID",
      this.state.audioDescriptionSelectedLanguage,
      "getLang",
      getLang()
    );

    /* start of custom tags */
    this.loadYTVideoTags();
    /* end of custom tags */

    // if (!this.props.getAppState().isSignedIn) {
    //   location.href = '/';
    // }
    this.getYDVideoData();
  }

  // 2
  getYDVideoData() {
    console.log("2 -> getYDVideoData");
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
              self.parseYDVideoData();
            }
          );
        } else {
          self.parseYDVideoData();
        }
      })
      .catch(() => {
        self.parseYDVideoData();
      });
  }

  // 3
  parseYDVideoData() {
    console.log("3 -> parseYDVideoData");
    const videoData = Object.assign({}, this.state.videoData);

    let audioDescriptionId = null;
    let audioDescriptionStatus = null;
    let audioDescriptionNotes = "";
    let audioDescriptionSelectedLanguage = "";
    const audioDescriptionAudioClips = {};

    if (
      videoData &&
      videoData.audio_descriptions &&
      videoData.audio_descriptions.length > 0
    ) {
      // This looping won't be necessary when the API just delivery the owned AD for the current user.
      for (let i = 0; i < videoData.audio_descriptions.length; i += 1) {
        const ad = videoData.audio_descriptions[i];

        if (ad.user._id === this.props.getUserInfo().userId) {
          audioDescriptionId = ad["_id"];
          audioDescriptionStatus = ad["status"];
          audioDescriptionNotes = ad["notes"];
          audioDescriptionSelectedLanguage = ad["language"];
          if (ad.audio_clips && ad.audio_clips.length > 0) {
            ad.audio_clips.forEach((audioClip) => {
              audioDescriptionAudioClips[audioClip["_id"]] = audioClip;
            });
          }
          break;
        }
      }
    }

    if (!audioDescriptionSelectedLanguage) {
      audioDescriptionSelectedLanguage = getLang();
    }

    this.setState(
      {
        videoData,
        audioDescriptionId,
        audioDescriptionStatus,
        audioDescriptionAudioClips,
        audioDescriptionNotes,
        audioDescriptionSelectedLanguage,
      },
      () => {
        if (this.state.audioDescriptionId === null) {
          this.generateTags();
        }
        this.preLoadAudioClips(this.getYTVideoInfo);
      }
    );
  }

  // 4
  preLoadAudioClips(callback) {
    console.log("4 -> preLoadAudioClips");
    const self = this;
    const audioClips = Object.values(this.state.audioDescriptionAudioClips);

    if (audioClips.length > 0) {
      const promises = [];
      audioClips.forEach((audioObj, idx) => {
        const url = self.getAudioClipUrl(audioObj);
        console.log(
          url,
          audioObj.start_time,
          audioObj.end_time,
          audioObj.duration,
          audioObj.playback_type
        );
        promises.push(ourFetch(url, false));
      });
      Promise.all(promises)
        .then(function () {
          console.log(
            "Total audio clips:",
            audioClips.length,
            "Audio clips loaded:",
            promises.length
          );
          callback();
        })
        .catch(function (errorAllAudios) {
          console.log("ERROR LOADING AUDIOS -> ", errorAllAudios);
        });
    } else {
      callback();
    }
  }

  // 5
  getYTVideoInfo() {
    const self = this;
    console.log("5 -> getYTVideoInfo");
    const url = `${conf.youTubeApiUrl}/videos?id=${this.state.videoId}&part=contentDetails,snippet&key=${conf.youTubeApiKey}`;
    ourFetch(url)
      .then((data) => {
        this.videoDurationInSeconds = convertISO8601ToSeconds(
          data.items[0].contentDetails.duration
        );
        this.setState(
          {
            videoTitle: data.items[0].snippet.title,
            videoDescription: data.items[0].snippet.description,
            videoDurationInSeconds: this.videoDurationInSeconds,
            videoDurationToDisplay: convertSecondsToEditorFormat(
              this.videoDurationInSeconds
            ),
          },
          () => {
            self.loadExistingTracks();
          }
        );
      })
      .catch((err) => {
        console.log("Unable to load the video you are trying to edit.", err);
      });
  }

  // 6
  loadExistingTracks() {
    console.log("6 -> loadExistingTracks");
    const tracksComponents = [];
    const audioClips = Object.values(this.state.audioDescriptionAudioClips);
    const audioClipsLength = audioClips.length;
    if (audioClipsLength > 0) {
      audioClips.forEach((audioClip, idx) => {
        tracksComponents.push(
          <Track
            key={idx}
            id={idx}
            data={audioClip}
            translate={this.props.translate}
            actionIconClass={"fa-step-forward"}
            getATState={this.getATState}
            recordAudioClip={this.recordAudioClip}
            updateTrackLabel={this.updateTrackLabel}
            setSelectedTrack={this.setSelectedTrack}
            deleteTrack={this.deleteTrack}
            nudgeTrackLeft={this.nudgeTrackLeft}
            nudgeTrackRight={this.nudgeTrackRight}
            switchTrackType={this.switchTrackType}
          />
        );
      });
    }
    const playheadTailHeight =
      audioClipsLength <= 4 ? audioClipsLength * 54 - 1 : 189;
    this.setState(
      {
        tracksComponents,
        playheadTailHeight,
      },
      () => {
        this.initVideoPlayer();
      }
    );
  }

  // 7
  initVideoPlayer() {
    console.log("7 -> initVideoPlayer");

    const self = this;

    if (YT.loaded) {
      startVideo();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        startVideo();
      };
    }

    function startVideo() {
      console.log("8 -> startVideo");
      if (self.state.videoPlayer === null) {
        self.setState(
          {
            videoPlayer: new YT.Player("playerAT", {
              height: "100%",
              videoId: self.state.videoId,
              playerVars: {
                modestbranding: 1,
                fs: 0,
                rel: 0,
                disablekb: 0,
                cc_load_policy: 0,
                iv_load_policy: 3,
              },
              events: {
                onReady: onVideoPlayerReady,
                onStateChange: onPlayerStateChange,
              },
            }),
          },
          () => {
            self.refs.spinner.off();
          }
        );
      } else {
        self.refs.spinner.off();
      }
    }

    function onVideoPlayerReady() {
      console.log("9 -> onVideoPlayerReady");
      initAudioRecorder();
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
              self.state.currentClip.playbackType === "inline"
            ) {
              self.pauseAudioClips();
            }

            break;
          case 3: // buffering
            if (
              self.state.currentClip &&
              self.state.currentClip.playbackType !== "extended"
            ) {
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

  getAudioClipUrl(audioClip) {
    return `${conf.audioClipsUploadsPath}${audioClip.file_path}/${audioClip.file_name}`;
  }

  checkSeek() {
    if (this.state.currentClip) {
      this.state.currentClip.audio.stop();
      this.state.currentClip = null;
    }

    const audioClips = Object.values(this.state.audioDescriptionAudioClips);
    let videoTimestamp = this.state.videoPlayer.getCurrentTime();

    //check nearest video. If video is inline, check the start time + duration of clip. If the video timestamp
    //falls in between, seek to the time (video timestamp - clip duration) of that clip. Then, play clip.

    //round to 2 nearest dec
    videoTimestamp = Math.round(videoTimestamp * 100) / 100;

    for (let i = 0; i < audioClips.length; i += 1) {
      const clip = audioClips[i];

      if (clip.playback_type === "inline") {
        let startTime = Math.round(clip.start_time * 100) / 100;
        let duration = Math.round(clip.duration * 100) / 100;

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

  // 10
  startProgressWatcher() {
    const self = this;
    console.log("10 -> startProgressWatcher");

    const audioClips = Object.values(this.state.audioDescriptionAudioClips);

    const interval = 50;
    if (this.watcher) {
      this.stopProgressWatcher();
    }

    this.watcher = setInterval(() => {
      const currentVideoProgress = this.state.videoPlayer.getCurrentTime();
      const videoVolume = this.state.videoPlayer.getVolume();
      const playheadPosition =
        756 * (currentVideoProgress / this.videoDurationInSeconds);
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
            self.playAudioClip(audioClip);
          }
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

  playAudioClip(audioClip, timestamp = null) {
    if (this.state.currentClip === null) {
      const self = this;
      const playbackType = audioClip.playback_type;
      const url = this.getAudioClipUrl(audioClip);
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
          }

          self.startProgressWatcher();
        },

        onstop: () => {
          this.state.currentClip = null;
        },
      });

      // Audio ducking.
      // if (playbackType === 'inline') {
      //   self.audioClipsPlayed[audioClipId].volume(self.state.balancerValue / 100);
      //   self.state.videoPlayer.setVolume((100 - self.state.balancerValue) * 0.4);
      // } else {
      //   self.state.videoPlayer.setVolume(100 - self.state.balancerValue);
      // }

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
    // audioClipsIds.forEach((id) => {
    //   this.audioClipsPlayed[id].stop();
    // });
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

  componentWillUnmount() {
    if (this.state.currentClip) {
      this.state.currentClip.audio.stop();
      this.state.currentClip = null;
    }
    if (this.state.videoPlayer) {
      this.state.videoPlayer.stopVideo();
    }
    this.stopProgressWatcher();
  }

  addAudioClipTrack(playbackType) {
    if (!this.props.getAppState().isSignedIn) {
      alert(
        this.props.translate(
          "You have to be logged in in order to describe this video"
        )
      );
      return;
    }

    // Current tracks components.
    const tracks = this.state.tracksComponents.slice();

    // I will just add tracks if all existant have urls.
    for (let i = 0; i < tracks.length; i += 1) {
      if (tracks[i].props.data.url === "") {
        // this.alertBoxOpen('unused-track');
        alert(
          this.props.translate(
            "There is an unused track. Please record or delete the previous track to add a new one. "
          )
        );
        return;
      }
    }

    // Don't allow adding more tracks while recording.
    if (this.state.selectedTrackComponentStatus === "recording") {
      // this.alertBoxOpen('recording-in-process');
      alert(this.props.translate("There is a track currently recording."));
      return;
    }

    const newTrackId = this.state.tracksComponents.length;

    const audioClip = {
      id: newTrackId,
      label: window.getSelection().toString() || "",
      playback_type: playbackType,
      start_time: 0,
      url: "",
    };

    tracks.push(
      <Track
        key={newTrackId}
        id={newTrackId}
        data={audioClip}
        translate={this.props.translate}
        actionIconClass={"fa-circle"}
        getATState={this.getATState}
        recordAudioClip={this.recordAudioClip}
        updateTrackLabel={this.updateTrackLabel}
        setSelectedTrack={this.setSelectedTrack}
        deleteTrack={this.deleteTrack}
        switchTrackType={this.switchTrackType}
      />
    );

    const playheadTailHeight =
      this.state.playheadTailHeight < 189
        ? this.state.playheadTailHeight + 27
        : this.state.playheadTailHeight;

    this.setState({
      tracksComponents: tracks,
      selectedTrackComponentPlaybackType: playbackType,
      playheadTailHeight,
      selectedTrackComponentId: null,
      selectedTrackComponentStatus: null,
      selectedTrackComponentLabel: audioClip.label,
      selectedTrackComponentUrl: "",
      selectedTrackComponentAudioClipStartTime: 0,
      selectedTrackComponentAudioClipSEndTime: -1,
      selectedTrackComponentAudioClipDuration: -1,
    });
  }

  getTrackComponentByTrackId(trackId) {
    const tc = this.state.tracksComponents;
    for (let i = 0; i < tc.length; i += 1) {
      if (tc[i].props.id === trackId) {
        return tc[i];
      }
    }
    return;
  }

  deleteTrack(e, id, data) {
    // It is an existing recorder audio track.
    if (data._id) {
      const resConfirm = confirm(
        this.props.translate(
          "Are you sure you want to remove this track? This action cannot be undone!"
        )
      );
      if (resConfirm) {
        const url = `${conf.apiUrl}/audioclips/${data._id}`;
        ourFetch(url, true, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: this.props.getAppState().userId,
            userToken: this.props.getAppState().userToken,
          }),
        })
          .then((response) => {
            const videoData = response.result;
            const tc = this.state.tracksComponents.slice();
            const newTracks = tc.filter((t) => t.props.id !== id);
            this.setState(
              {
                videoData: videoData,
              },
              () => {
                this.resetSelectedTrack();
                this.parseYDVideoData();
              }
            );
          })
          .catch((err) => {
            this.setState(
              {
                videoData: {},
              },
              () => {
                this.resetSelectedTrack();
                this.parseYDVideoData();
              }
            );
          });
      }
    } else {
      // We just need to remove from the UI.
      const tc = this.state.tracksComponents.slice();
      const newTracks = tc.filter((t) => t.props.id !== id);
      this.setState(
        {
          tracksComponents: newTracks,
        },
        this.resetSelectedTrack()
      );
    }
  }

  nudgeTrackLeft(e, id, data) {
    this.refs.spinner.on();
    const nudgeIncrementDecrementValue = conf.nudgeIncrementDecrementValue;

    // Trying to decrease from 0;
    if (data.start_time === 0) {
      alert(
        this.props.translate(
          "Impossible to descrease the start time. It is already 0"
        )
      );
      this.refs.spinner.off();
      return;
    }

    // Impossible to nudge to less than 0 so we decide to make it zero.
    if (data.start_time - nudgeIncrementDecrementValue < 0) {
      data.start_time = 0;
    } else {
      // Fix for 0.3 + 0.15 floating point issue.
      data.start_time =
        (data.start_time * 1000 - nudgeIncrementDecrementValue * 1000) / 1000;
    }

    ourFetch(`${conf.apiUrl}/audioclips/${data._id}`, true, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: this.props.getAppState().userId,
        userToken: this.props.getAppState().userToken,
        playback_type: data.playback_type,
        start_time: data.start_time,
        end_time: data.end_time,
        duration: data.duration,
      }),
    })
      .then((response) => {
        this.refs.spinner.off();
        const saved = response.result;
        const tcs = this.state.tracksComponents.slice();
        const acs = Object.assign({}, this.state.audioDescriptionAudioClips);
        acs[saved._id] = saved;
        this.setState({ audioDescriptionAudioClips: acs }, () => {
          this.resetPlayedAudioClips();
          this.loadExistingTracks();
        });
      })
      .catch((err) => {
        console.log("Error nudge left");
      });
  }

  nudgeTrackRight(e, id, data) {
    this.refs.spinner.on();
    const nudgeIncrementDecrementValue = conf.nudgeIncrementDecrementValue;

    // Trying to increase beyond video duration.
    if (
      data.start_time + nudgeIncrementDecrementValue >
      this.videoDurationInSeconds - data.duration
    ) {
      alert(this.props.translate("Impossible to increase the start time more"));
      this.refs.spinner.off();
      return;
    }

    data.start_time =
      (data.start_time * 1000 + nudgeIncrementDecrementValue * 1000) / 1000;

    const url = `${conf.apiUrl}/audioclips/${data._id}`;

    ourFetch(url, true, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: this.props.getAppState().userId,
        userToken: this.props.getAppState().userToken,
        playback_type: data.playback_type,
        start_time: data.start_time,
        end_time: data.end_time,
        duration: data.duration,
      }),
    })
      .then((response) => {
        this.refs.spinner.off();
        const saved = response.result;
        const tcs = this.state.tracksComponents.slice();
        const acs = Object.assign({}, this.state.audioDescriptionAudioClips);
        acs[saved._id] = saved;
        this.setState({ audioDescriptionAudioClips: acs }, () => {
          this.resetPlayedAudioClips();
          this.loadExistingTracks();
        });
      })
      .catch((err) => {
        console.log("Error nudge right");
      });
  }

  switchTrackType(e, id, data) {
    this.refs.spinner.on();
    let resConfirm;
    let playback_type;
    if (data.playback_type === "extended") {
      resConfirm = confirm(
        this.props.translate(
          "Are you sure you want to change from EXTENDED to INLINE?"
        )
      );
      playback_type = "inline";
    } else {
      resConfirm = confirm(
        this.props.translate(
          "Are you sure you want to change from INLINE to EXTENDED?"
        )
      );
      playback_type = "extended";
    }
    if (resConfirm) {
      const url = `${conf.apiUrl}/audioclips/${data._id}`;
      ourFetch(url, true, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: this.props.getAppState().userId,
          userToken: this.props.getAppState().userToken,
          playback_type,
          start_time: data.start_time,
          end_time: data.end_time,
          duration: data.duration,
        }),
      }).then((response) => {
        this.refs.spinner.off();
        const saved = response.result;
        const tcs = this.state.tracksComponents.slice();
        const acs = Object.assign({}, this.state.audioDescriptionAudioClips);
        acs[saved._id] = saved;
        this.setState({ audioDescriptionAudioClips: acs }, () => {
          this.resetPlayedAudioClips();
          this.loadExistingTracks();
        });
      });
    }
  }

  resetSelectedTrack() {
    this.setState({
      selectedTrackComponentId: null,
      selectedTrackComponentPlaybackType: null,
      selectedTrackComponentStatus: null,
      selectedTrackComponentAudioClipStartTime: 0,
      selectedTrackComponentAudioClipSEndTime: -1,
      selectedTrackComponentAudioClipDuration: -1,
      selectedTrackComponentLabel: "",
      selectedTrackComponentUrl: null,
    });
  }

  recordAudioClip(e, trackId) {
    const self = this;
    if (!this.props.getAppState().isSignedIn) {
      alert(
        this.props.translate(
          "You need to be logged in in order to record audio clips"
        )
      );
      return;
    }

    if (this.state.selectedTrackComponentId !== trackId) {
      if (this.state.selectedTrackComponentStatus === "recording") {
        alert(
          this.props.translate(
            "You need to stop recording in order to activate any other track"
          )
        );
        return;
      }
    }

    const clickedTrackComponent = this.getTrackComponentByTrackId(trackId);

    if (e.target.className === "fa fa-circle") {
      // RECORD.
      // if (this.state.selectedTrackComponentPlaybackType === 'inline' && this.state.videoState !== 1) {
      //   alert('Not ready to record an inline track because the video is not playing yet');
      //   return;
      // }
      this.setState(
        {
          selectedTrackComponentAudioClipStartTime:
            this.state.currentVideoProgress,
          selectedTrackComponentId: trackId,
          selectedTrackComponentPlaybackType:
            clickedTrackComponent.props.data.playback_type,
          selectedTrackComponentStatus: "recording",
        },
        () => {
          this.updateTrackComponent("fa-stop", this.state.currentVideoProgress);
          if (this.state.selectedTrackComponentPlaybackType === "inline") {
            this.state.videoPlayer.mute();
            this.state.videoPlayer.playVideo();
          } else {
            this.state.videoPlayer.pauseVideo();
          }
          startRecording();
        }
      );
    } else if (e.target.className === "fa fa-stop") {
      // STOP RECORDING.
      this.setState(
        {
          selectedTrackComponentStatus: "stopped",
        },
        () => {
          this.updateTrackComponent("fa-step-forward");
          this.state.videoPlayer.unMute();
          this.state.videoPlayer.pauseVideo();
          self.refs.spinner.on();
          stopRecordingAndSave(this.uploadAudioRecorded);
        }
      );
    } else if (e.target.className === "fa fa-step-forward") {
      // SEEK TO.

      const seekToValue = clickedTrackComponent.props.data.start_time;
      const seekToValueWithCorrection =
        parseFloat(seekToValue) - conf.seekToPositionDelayFix;

      this.setState(
        {
          currentVideoProgress: seekToValueWithCorrection,
          currentTimeInVideo: seekToValueWithCorrection,
          playheadPosition: (756 * seekToValue) / this.videoDurationInSeconds,
        },
        () => {
          this.state.videoPlayer.seekTo(seekToValueWithCorrection, true);
          this.state.videoPlayer.unMute();

          if (this.state.currentClip) {
            this.state.currentClip.audio.stop();
          }
        }
      );
    } else {
      console.log("?");
    }
  }

  updateTrackComponent(classIcon, startTime = 0) {
    const tracks = this.state.tracksComponents.slice();
    for (let i = 0; i < tracks.length; i += 1) {
      if (this.state.selectedTrackComponentId === tracks[i].props.id) {
        const audioClip = {
          label: this.state.selectedTrackComponentLabel,
          playback_type: this.state.selectedTrackComponentPlaybackType,
          start_time: startTime,
          url: this.state.selectedTrackComponentUrl,
        };

        tracks[i] = (
          <Track
            key={this.state.selectedTrackComponentId}
            id={this.state.selectedTrackComponentId}
            translate={this.props.translate}
            data={audioClip}
            actionIconClass={classIcon}
            getATState={this.getATState}
            recordAudioClip={this.recordAudioClip}
            updateTrackLabel={this.updateTrackLabel}
            setSelectedTrack={this.setSelectedTrack}
            deleteTrack={this.deleteTrack}
            switchTrackType={this.switchTrackType}
          />
        );
      }
    }
    this.setState({ tracksComponents: tracks });
  }

  touchAD(args) {
    if (this.state.audioDescriptionId === null) {
      this.refs.spinner.on();
      let url = `${conf.apiUrl}/audiodescriptions`;
      let method = "PUT";

      // We still don't have a AD.
      url += `/${this.state.videoId}`;
      method = "POST";

      ourFetch(url, true, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: this.state.videoTitle,
          description: this.state.videoDescription,
          userId: this.props.getAppState().userId,
          userToken: this.props.getAppState().userToken,
          notes: this.state.audioDescriptionNotes,
          audioDescriptionSelectedLanguage:
            this.state.audioDescriptionSelectedLanguage,
        }),
      }).then(() => {
        console.log("2 -> getYDVideoData");

        const url = `${conf.apiUrl}/videos/${this.props.params.videoId}`;

        ourFetch(url)
          .then((response) => {
            if (response.result) {
              const videoData = response.result;

              videoData["audio_descriptions"].forEach((ad) => {
                if (ad.user._id === this.props.getUserInfo().userId) {
                  let audioDescriptionId = ad["_id"];
                  let audioDescriptionStatus = ad["status"];
                  let audioDescriptionNotes = ad["notes"];
                  let audioDescriptionSelectedLanguage = ad["language"];

                  this.setState(
                    {
                      videoData: response.result,
                      audioDescriptionId,
                      audioDescriptionStatus,
                      audioDescriptionNotes,
                      audioDescriptionSelectedLanguage,
                    },
                    () => {
                      this.sendAudio(args);
                    }
                  );
                }
              });
            }
          })
          .catch(() => {});
      });
    }
  }

  uploadAudioRecorded(args) {
    console.log("start touch");

    if (this.state.audioDescriptionId === null) {
      this.touchAD(args);
    } else {
      this.sendAudio(args);
    }
  }

  sendAudio(args) {
    const self = this;
    const formData = new FormData();
    formData.append("wavfile", args.audioBlob);
    formData.append("userId", this.props.getAppState().userId);
    formData.append("userToken", this.props.getAppState().userToken);
    formData.append("title", this.state.videoTitle);
    formData.append("description", this.state.videoDescription);
    formData.append("notes", this.state.notes);
    formData.append("label", this.state.selectedTrackComponentLabel);
    formData.append(
      "playbackType",
      this.state.selectedTrackComponentPlaybackType
    );
    formData.append(
      "startTime",
      this.state.selectedTrackComponentAudioClipStartTime
    );
    formData.append("audioDescriptionId", this.state.audioDescriptionId);
    formData.append("audioDescriptionNotes", this.state.audioDescriptionNotes);
    formData.append(
      "audioDescriptionSelectedLanguage",
      this.state.audioDescriptionSelectedLanguage
    );
    if (this.state.selectedTrackComponentPlaybackType === "extended") {
      formData.append(
        "endTime",
        this.state.selectedTrackComponentAudioClipStartTime
      );
    } else {
      formData.append(
        "endTime",
        this.state.selectedTrackComponentAudioClipStartTime + args.duration
      );
    }
    formData.append("duration", args.duration);

    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    const url = `${conf.apiUrl}/audioclips/${this.state.videoId}`;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.onload = function () {
      self.setState(
        {
          videoData: JSON.parse(this.responseText).result,
        },
        () => {
          self.parseYDVideoData();
          self.refs.spinner.off();
        }
      );
    };
    xhr.send(formData);
  }

  publishAudioDescription() {
    const self = this;
    const resultConfirm = confirm(
      this.props.translate(
        "Are you sure you want to publish this audio description?"
      )
    );
    if (resultConfirm) {
      /* start of email */
      this.sendOptInEmail();
      /* end of email */

      const url = `${conf.apiUrl}/audiodescriptions/${this.state.audioDescriptionId}?action=publish`;
      ourFetch(url, true, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: this.props.getAppState().userId,
          userToken: this.props.getAppState().userToken,
          audioDescriptionSelectedLanguage:
            this.state.audioDescriptionSelectedLanguage,
        }),
      }).then((response) => {
        const result = response.result;
        if (result._id) {
          self.setState(
            {
              videoData: result,
            },
            () => {
              self.parseYDVideoData();
            }
          );
        } else {
          console.log("There was a problem to publish your audio description");
        }
      });
    }
  }

  playFromStart() {
    this.state.videoPlayer.seekTo(0, true);

    this.pauseAudioClips();
    this.resetPlayedAudioClips();

    this.setState({
      currentVideoProgress: 0,
      currentVideoProgressToDisplay: convertSecondsToEditorFormat(0),
      playheadPosition: 0,
    });
    this.state.videoPlayer.playVideo();
  }

  /* start of email */
  sendOptInEmail() {
    const ref = `${window.location.protocol}//${window.location.host}/video/${this.state.videoId}?ad=${this.state.audioDescriptionId}`;
    const emailBody = `Your wishlist selection has been described and published:\n${ref}.`;
    const url = `${conf.apiUrl}/users/sendoptinemail`;
    const optionObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: this.state.videoId,
        optin: 0,
        emailbody: emailBody,
      }),
    };
    ourFetch(url, true, optionObj).then((response) => {});
  }
  /* end of email */

  unpublishAudioDescription() {
    const self = this;
    const resultConfirm = confirm(
      this.props.translate(
        "Are you sure you want to unpublish this audio description?"
      )
    );
    if (resultConfirm) {
      const url = `${conf.apiUrl}/audiodescriptions/${this.state.audioDescriptionId}?action=unpublish`;
      ourFetch(url, true, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: this.props.getAppState().userId,
          userToken: this.props.getAppState().userToken,
        }),
      }).then((response) => {
        const result = response.result;
        if (result._id) {
          self.setState(
            {
              videoData: result,
            },
            () => {
              self.parseYDVideoData();
            }
          );
        } else {
          console.log(
            "There was a problem to unpublish your audio description"
          );
        }
      });
    }
  }

  getATState() {
    return this.state;
  }

  updateState(newState) {
    this.setState(newState);
  }

  setSelectedTrack(e, trackId) {
    const tracks = this.state.tracksComponents;
    for (let i = 0; i < tracks.length; i += 1) {
      if (trackId === tracks[i].props.id) {
        this.setState({
          selectedTrackComponentId: tracks[i].props.id,
          selectedTrackComponentPlaybackType: tracks[i].props.playBackType,
          selectedTrackComponentAudioClipStartTime: tracks[i].props.startTime,
          selectedTrackComponentLabel: tracks[i].props.label,
          selectedTrackComponentUrl: tracks[i].props.audioClipUrl,
        });
      }
    }
  }

  updateTrackLabel(e) {
    const audioClipId = e.target.dataset["id"];
    const label = e.target.value;
    console.log(label);
    const audioClipsUpdated = Object.assign(
      {},
      this.state.audioDescriptionAudioClips
    );

    if (audioClipId) {
      audioClipsUpdated[audioClipId].label = label;
      this.setState(
        {
          selectedTrackComponentLabel: label,
          audioDescriptionAudioClips: audioClipsUpdated,
        },
        () => {
          this.loadExistingTracks();
        }
      );
    } else {
      this.setState({
        selectedTrackComponentLabel: label,
      });
    }
  }

  updateNotes(e) {
    this.setState(
      {
        audioDescriptionNotes: e.target.value,
      },
      () => {
        this.autoSave();
      }
    );
  }

  autoSave() {
    const now = new Date();
    const nowMs = now.getTime();
    if (nowMs - this.autoSaveTimer > 3000) {
      console.log("auto save");
      this.saveLabelsAndNotes();
    } else {
      console.log("too soon to auto save", this.autoSaveTimer - nowMs);
    }
    this.autoSaveTimer = nowMs;
  }

  saveLabelsAndNotes() {
    this.refs.spinner.on();
    let url = `${conf.apiUrl}/audiodescriptions`;
    let method = "PUT";

    // We already have an audio description.
    if (this.state.audioDescriptionId) {
      url += `/${this.state.audioDescriptionId}`;

      // Update labels at each audio clip.
      const audioClips = this.state.audioDescriptionAudioClips;
      Object.keys(audioClips).forEach((acId) => {
        const ac = this.state.audioDescriptionAudioClips[acId];
        ourFetch(`${conf.apiUrl}/audioclips/${acId}`, true, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: this.props.getAppState().userId,
            userToken: this.props.getAppState().userToken,
            label: ac.label,
          }),
        }).then(() => {
          this.refs.spinner.off();
        });
      });
    } else {
      // We still don't have a AD.
      url += `/${this.state.videoId}`;
      method = "POST";
    }

    // Update audio description.
    ourFetch(url, true, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: this.state.videoTitle,
        description: this.state.videoDescription,
        userId: this.props.getAppState().userId,
        userToken: this.props.getAppState().userToken,
        notes: this.state.audioDescriptionNotes,
        audioDescriptionSelectedLanguage:
          this.state.audioDescriptionSelectedLanguage,
      }),
    }).then(() => {
      if (method === "POST") {
        this.getYDVideoData();
      } else {
        this.refs.spinner.off();
      }
    });
  }

  deleteAudioDescription() {
    const resConfirm = confirm(
      this.props.translate(
        "Are you sure you want to delete the audio description? This will remove all recorder tracks and cannot be undone"
      )
    );
    if (resConfirm) {
      this.refs.spinner.on();
      ourFetch(
        `${conf.apiUrl}/audiodescriptions/${this.state.audioDescriptionId}`,
        true,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: this.props.getAppState().userId,
            userToken: this.props.getAppState().userToken,
          }),
        }
      ).then((response) => {
        console.log("Deleted", response);
        this.refs.spinner.off();
        browserHistory.push(`/videos/user/${this.props.getAppState().userId}`);
      });
    }
  }

  /* start of custom tags */
  loadYTVideoTags() {
    const url = `${conf.apiUrl}/videos/getyoutubetags?id=${this.state.videoId}`;

    ourFetch(url).then((response) => {
      const video = response.result;

      const tags = [];
      video.tags.forEach((tag) => {
        tags.push({
          id: tag,
          text: tag,
        });
      });
      this.setState({
        tags: tags,
      });
    });
  }

  generateTags() {
    const url = `${conf.apiUrl}/videos/updateyoutubeid`;
    const optionObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: this.state.videoData._id,
        youtube_id: this.state.videoId,
      }),
    };

    ourFetch(url, true, optionObj).then((response) => {
      let count = 0;
      setInterval(() => {
        if (count < 3) {
          this.loadYTVideoTags();
          count++;
        }
      }, 1000);
    });
  }

  handleDelete(i) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
  }

  handleAddition(tag) {
    this.setState((state) => ({
      tags: [...state.tags, tag],
    }));
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    // re-render
    this.setState({
      tags: newTags,
    });
  }

  handleTagClick(index) {
    console.log("The tag at index " + index + "was clicked");
  }

  handleClick() {
    window.location.href = "/waitlist";
  }

  handleSave() {
    const url = `${conf.apiUrl}/videos/updatecustomtags`;
    const formattedTags = this.state.tags.map(tag => ({
      id: tag.id || tag.value,
      text: tag.text || tag.label
    }));

    const optionObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: this.state.videoId,
        tags: formattedTags,
      }),
    };

    ourFetch(url, true, optionObj).then((response) => {
      alert("Your custom tags have been successfully saved!");
    });
  }

  handleSelectChange = (newValue) => {
    this.setState({
      tags: newValue || []
    });
  };

  /* end of custom tags */

  // 1
  render() {
    // console.log('1 -> render authoring tool')
    return (
      <div id="authoring-tool">
        {/* <button
          type="submit"
          onClick={this.handleClick}
          style={{
            fontWeight: "bold",
            cursor: "pointer",
            width: 200,
            marginBlockStart: 15,
            marginBottom: 10,
            marginInlineStart: 530,
            height: 50,
            backgroundColor: "#4267B2",
            color: "white"
          }}
          variant="success"
        >
          YouDescribeX
        </button> */}

        <SpinnerGlobal ref="spinner" />
        <main role="main">
          <div className="w3-row">
            <div className="w3-hide-large">
              {this.props.translate(
                "Authoring is not available on this screen size. Please use a larger screen to add a description"
              )}
            </div>
            <div
              id="video-section"
              className="w3-left w3-card-2 w3-margin-top w3-hide-small w3-hide-medium"
            >
              <div id="playerAT" />
            </div>
            <div
              id="notes-section"
              className="w3-left w3-card-2 w3-margin-top w3-hide-small w3-hide-medium"
            >
              <Notes
                translate={this.props.translate}
                updateNotes={this.updateNotes}
                saveLabelsAndNotes={this.saveLabelsAndNotes}
                getATState={this.getATState}
              />
              <LanguageSelector
                translate={this.props.translate}
                getATState={this.getATState}
                updateState={this.updateState}
              />
            </div>
          </div>
          <div className="w3-row w3-margin-top w3-hide-small w3-hide-medium">
            <div className="w3-col w3-margin-bottom">
              <Editor
                translate={this.props.translate}
                getATState={this.getATState}
                updateState={this.updateState}
                publishAudioDescription={this.publishAudioDescription}
                unpublishAudioDescription={this.unpublishAudioDescription}
                alertBoxClose={this.alertBoxClose}
                addAudioClipTrack={this.addAudioClipTrack}
                recordAudioClip={this.recordAudioClip}
                playFromStart={this.playFromStart}
                deleteTrack={this.deleteTrack}
                deleteAudioDescription={this.deleteAudioDescription}
                saveLabelsAndNotes={this.saveLabelsAndNotes}
                {...this.state}
              />
            </div>
          </div>

          {/* start of custom tags */}
          {/* https://stackblitz.com/edit/react-tag-input-1nelrc?file=index.js */}
          <div className="w3-row w3-margin-top w3-hide-small w3-hide-medium">
            Please delete unrelated tags below and add your own tags that can
            describe this video better.
            <br />
            <br />
            <div className="w3-col w3-margin-bottom">
              <Select
                  placeholder="Add custom tags here"
                  value={this.state.tags}
                  options={this.state.suggestions}
                  onChange={this.handleSelectChange}
                  isMulti
                  isClearable
                  isCreatable
                  className="react-select-container"
                  classNamePrefix="react-select"
              />
              <br />
              <Button
                title="Save custom tags for this video"
                text="Save Custom Tags"
                color="w3-indigo"
                onClick={this.handleSave}
              />
            </div>
          </div>
          {/* end of custom tags */}
        </main>
      </div>
    );
  }
}

export default AuthoringTool;
