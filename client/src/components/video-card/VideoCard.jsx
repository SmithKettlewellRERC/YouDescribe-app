import React from 'react';
import { Link } from 'react-router';

const VideoCard = props => {
  let buttons;
  if (props.buttons === 'on') {
    buttons = 
      (
        <div>
          <button className="w3-btn w3-indigo w3-text-shadow w3-margin-bottom" onClick={props.upVoteClick}>Up Vote</button>
          <button className="w3-btn w3-indigo w3-text-shadow w3-margin-bottom" onClick={props.describeClick}>Describe</button>
        </div>
      )
  }

  return (
    <div className="vid-card w3-margin-top w3-left">
      <div className="w3-card-2 w3-hover-shadow">
        <Link to={'/video/' + props.id}><img alt={props.description} src={props.thumbnailHighUrl} width="100%" /></Link>
        <div className="w3-container vid-title">
          <h5><Link to={'/video/' + props.id}>{props.title}</Link></h5>
          <h6>
            <a href="#">{props.author}</a><br />
            <a href="#">{props.describer}</a> (describer)
          </h6>
        </div>
        <div className="w3-container w3-padding-8">
          <h6><div className="w3-left">{props.views}</div><div className="w3-right"> {props.time}</div></h6>
        </div>
        {buttons}
      </div>
    </div>
    );
}

export default VideoCard;
