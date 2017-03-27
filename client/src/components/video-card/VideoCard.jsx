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

  upVote() {
    if (!this.props.getAppState().isSignedIn) {
      alert('You have to be legged in in order to up vote');
    } else {
      const url = `${conf.apiUrl}/wishlist?token=${this.props.getAppState().userToken}`;
      ourFetch(url, true, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: this.props.id }),
      })
      .then((res) => {
        console.log(res);
      });
    }
  }

    // upVoteClick(e, i, id, description, thumbnailHigh, title, author, views, time, voteCount) {
    // if (e.target.className === 'w3-btn w3-white w3-text-indigo w3-left' ||
    //   e.target.className === 'fa fa-heart') {
    //   if (e.target.className === 'fa fa-heart') e.target.parentElement.className = 'w3-btn w3-white w3-text-red w3-left';
    //   else e.target.className = 'w3-btn w3-white w3-text-red w3-left';
    //   console.log('heart activated and video request added to wishlist or incremented by 1');
    // }

  describeThisVideo() {
    if (this.props.getAppState().isSignedIn) {
      browserHistory.push('/authoring-tool/' + this.props.id);
    } else {
      alert('You have to be legged in in order to describe this video');
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
    if (this.props.buttons === 'on') {
      buttons =
        (
          <div>
            <div><Button title="Request an audio description for this video" text={<i className="fa fa-heart"></i>} color="w3-white w3-text-indigo w3-left" onClick={this.upVote} /><span id="vote-count">{voteCount}</span></div>
            <Button title="Create an audio description for this video" text="Describe" color="w3-indigo w3-right" onClick={this.describeThisVideo} />
          </div>
        )
    }
    return (
      <div id="video-card" className="w3-margin-top w3-left">
        <div className="w3-card-2 w3-hover-shadow">
          <div id="card-thumbnail">
            <Link to={'/video/' + this.props.id}><img alt={this.props.description} src={this.props.thumbnailMediumUrl} width="100%" /></Link>
            <div id="card-duration">{this.props.duration}</div>
          </div>
          <div className="w3-container w3-padding-bottom">
            <div id="card-title-container">
              <div id="card-title">
                <h5><Link to={'/video/' + this.props.id}>{this.props.title}</Link></h5>
              </div>
              <div id="card-author">
                <h6>
                  <a href="#">{this.props.author}</a><br />
                  <a href="#">{this.props.describer}</a>
                </h6>
              </div>
            </div>
            <div id="card-stats">
              <h6><div className="w3-left">{this.props.views}</div><div className="w3-right"> {this.props.time}</div></h6>
            </div>
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
