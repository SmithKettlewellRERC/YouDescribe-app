import React, { Component } from "react";
import ActionIcon from "../action-icon/ActionIcon.jsx";
import DeleteTrack from "../delete-track/DeleteTrack.jsx";
import NudgeLeft from "../nudge-left/NudgeLeft.jsx";
import NudgeRight from "../nudge-right/NudgeRight.jsx";
import SwitchTrackType from "../switch-track-type/SwitchTrackType.jsx";
import AlertBox from "../alert-box/AlertBox.jsx";
import { convertSecondsToEditorFormat } from "../../shared/helperFunctions";

const conf = require("../../shared/config");

class Track extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.data.label) {
      var element = document.getElementById("init-text");
      if (element) {
        var event = new Event("change");
        element.dispatchEvent(event);
        element.value = this.props.data.label;
      }
    }
  }

  render() {
    let label;
    let switchTrackTypeComponent = null;
    let nudgeLeftComponent = null;
    let nudgeRightComponent = null;
    let startEndTimeInfo = "";
    if (this.props.data.end_time >= 0) {
      startEndTimeInfo =
        convertSecondsToEditorFormat(this.props.data.start_time) +
        " - " +
        convertSecondsToEditorFormat(this.props.data.end_time) +
        " (" +
        convertSecondsToEditorFormat(this.props.data.duration) +
        ")";
    }
    this.label = this.props.data.label;
    this.url = this.props.data.url;
    this.labelText = this.props.data.playback_type === "inline" ? "I" : "E";
    this.styleButton =
      this.props.data.playback_type === "inline" ? "w3-yellow" : "w3-purple";
    this.wavesurfer = null;
    // It is an existant track.
    if (this.props.data._id) {
      if (this.props.data.label === "") {
        label = (
          <input
            type="text"
            data-id={this.props.data._id}
            onChange={this.props.updateTrackLabel}
            placeholder={this.props.translate("Unlabeled saved track")}
          />
        );
      } else {
        label = (
          <input
            type="text"
            data-id={this.props.data._id}
            onChange={this.props.updateTrackLabel}
            value={this.props.data.label}
          />
        );
      }
      switchTrackTypeComponent = <SwitchTrackType {...this.props} />;
      nudgeLeftComponent = <NudgeLeft {...this.props} />;
      nudgeRightComponent = <NudgeRight {...this.props} />;
    } else {
      label = (
        <input
          type="text"
          data-id=""
          id="init-text"
          placeholder={this.props.translate("Label for this track")}
          onChange={this.props.updateTrackLabel}
          onKeyPress={(evt) => {
            this.props.setSelectedTrack(evt, this.props.id);
          }}
        />
      );
    }
    return (
      <div id="track" className="w3-row w3-display-container">
        <div className="w3-col l3 m3 s3">
          <div id="track-info">
            <div className="label">
              <div id="type" className={this.styleButton}>
                {this.labelText}
              </div>
              <div>{label}</div>
            </div>
            <div id="track-action" className="w3-right">
              <ActionIcon {...this.props} />
              {switchTrackTypeComponent}
              {nudgeLeftComponent}
              {nudgeRightComponent}
              <DeleteTrack {...this.props} />
            </div>
          </div>
        </div>
        <div id="sinewave-container" className="w3-col l9 m9 s9">
          <span>{startEndTimeInfo}</span>
          <div
            id="sinewave"
            className={this.styleButton}
            style={{
              left: `${
                756 *
                (this.props.data.start_time /
                  this.props.getATState().videoDurationInSeconds)
              }px`,
              width:
                Math.abs(
                  756 *
                    ((this.props.data.end_time - this.props.data.start_time) /
                      this.props.getATState().videoDurationInSeconds)
                ) !== 0
                  ? `${~~(
                      756 *
                      ((this.props.data.end_time - this.props.data.start_time) /
                        this.props.getATState().videoDurationInSeconds)
                    )}px`
                  : 1,
              height: "53px",
            }}
          >
            <div id={`wave${this.props.id}`} />
          </div>
        </div>
      </div>
    );
  }
}

export default Track;
