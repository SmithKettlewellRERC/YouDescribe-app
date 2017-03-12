import React, { Component } from 'react';
import { Link } from 'react-router';
import Button from '../button/Button.jsx';

const VideoCard = props => {

  let voteCount;
  if (props.voteCount > 0) {
    voteCount =
      (
        <div>
          Requested: {props.voteCount} times
        </div>
      )
  }

  let buttons;
  if (props.buttons === 'on') {
    buttons =
      (
        <div>
          <div className="w3-left">
            <Button title="Add video to audio description wish list" text={<i className="fa fa-heart"></i>} color="w3-indigo" onClick={props.upVoteClick} />
          </div>
          <div className="w3-right">
            <Button title="Add an audio description to video" text="Describe" color="w3-indigo" onClick={props.describeClick} />
          </div>
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
        {voteCount}
        {buttons}
      </div>
    </div>
    );
}

export default VideoCard;
