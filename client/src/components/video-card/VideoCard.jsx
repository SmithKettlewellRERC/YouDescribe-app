import React, { Component } from 'react';
import { Link } from 'react-router';
import Button from '../button/Button.jsx';
import { browserHistory } from 'react-router';
import { ourFetch } from '../../shared/helperFunctions';
const conf = require('../../shared/config')();

class VideoCard extends Component {
  constructor(props) {
    super(props);
    this.upVote = this.upVote.bind(this);
    this.describeThisVideo = this.describeThisVideo.bind(this);
  }

  upVote(e) {
    if (!this.props.getAppState().isSignedIn) {
      alert('You have to be logged in in order to up vote');
    } else {
      e.currentTarget.className = 'w3-btn w3-white w3-text-indigo w3-left w3-text-red';
      const url = `${conf.apiUrl}/wishlist`;
      ourFetch(url, true, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youTubeId: this.props.youTubeId,
          userId: this.props.getAppState().userId,
          userToken: this.props.getAppState().userToken,
        }),
      })
      .then((res) => {
        console.log('Success upVote');
      })
      .catch(err => {
        console.log(err);
        alert('It was impossible to vote. Maybe your session has expired. Try to logout and login again.');
      });
    }
  }

  describeThisVideo() {
    if (this.props.getAppState().isSignedIn) {
      browserHistory.push('/authoring-tool/' + this.props.youTubeId);
    } else {
      alert('You have to be logged in in order to describe this video');
    }
  }

  render() {
    let voteCount;
    if (this.props.voteCount > 0) {
      voteCount =
        (
          <div>
            {this.props.votes}
          </div>
        )
    }

    let buttons;

    if (this.props.buttons === 'upvote-describe') {
      buttons = (
        <div>
          <Button title="Request an audio description for this video" text={<i className="fa fa-heart"></i>} color="w3-white w3-text-indigo w3-left" onClick={this.upVote} />
          <span id="vote-count">{voteCount}</span>
          <Button title="Create an audio description for this video" text="Describe" color="w3-indigo w3-right" onClick={this.describeThisVideo} />
        </div>
      );
    } else if (this.props.buttons === 'edit') {
      buttons = (
        <div>
          <Button title="Edit the audio description for this video" text="Edit" color="w3-indigo w3-block" onClick={this.describeThisVideo} />
        </div>
      );
    }

    return (
      <div id="video-card" className="w3-margin-top w3-left" title="">
        <div className="w3-card-2 w3-hover-shadow">
          <div id="card-thumbnail">
            <Link role="link" to={'/video/' + this.props.youTubeId}><img alt={this.props.title} src={this.props.thumbnailMediumUrl} width="100%" /></Link>
            <div id="card-duration">{this.props.duration}</div>
          </div>
          <div className="w3-container w3-padding-bottom">
            <div id="card-title-container">
              <div id="card-title" aria-hidden="true" >
                <h3><Link role="link" to={'/video/' + this.props.youTubeId}>{this.props.title}</Link></h3>
              </div>
              <div id="card-author">
                <h4>{this.props.author}</h4>
                {/* <a href="#">{this.props.describer}</a> */}
              </div>
            </div>
            {/*<div id="card-stats">
              <h4><div className="w3-left">{this.props.views}</div><div className="w3-right">{this.props.time}</div></h4>
            </div>*/}
            <div id="card-buttons">
              {buttons}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VideoCard;
