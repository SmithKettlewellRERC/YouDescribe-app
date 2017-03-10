import React from 'react';

const VideoCard = () => (
  <div id="video-card">
    <div className="w3-col m4 l2 w3-margin-top">
      <div className="w3-card-2 w3-hover-shadow">
        <img alt={description} src={thumbnailHigh.url} width="100%" />
        <div className="w3-container vid-title">
          <h5><a href={'/video/' + id}>{title}</a></h5>
          <h6>
            <a href="#">{author}</a><br />
            <a href="#">{describer}</a> (describer)
          </h6>
        </div>
        <div className="w3-container w3-padding-8">
          <h6><div className="w3-left">{views}</div><div className="w3-right"> {time}</div></h6>
        </div>
      </div>
    </div>
  </div>
);

export default VideoCard;
