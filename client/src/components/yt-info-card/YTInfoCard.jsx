import React from "react";

const YTInfoCard = (props) => {
  return (
    <div id="yt-info-card" className="w3-card-2">
      <h2>{props.videoTitle}</h2>
      <span>{props.videoAuthor}</span>
      <span style={{ float: "right" }}>{props.videoViews}</span>
      <hr style={{ marginTop: 0 }} aria-hidden="true" />
      <div id="time-and-likes-container">
        <div id="publish-time">
          {props.translate("Published on")} {props.videoPublishedAt}
        </div>
        <div id="video-likes">
          <span style={{ paddingRight: "16px" }}>
            <i className="fa fa-thumbs-o-up" aria-hidden="true" />{" "}
            {props.videoLikes}
          </span>
        </div>
      </div>
    </div>
  );
};

export default YTInfoCard;
