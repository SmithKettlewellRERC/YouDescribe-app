import React, { Component } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import { ourFetch } from '../../shared/helperFunctions';
const conf = require('../../shared/config')();

class VideoComponent extends Component {
  constructor(props) {
    super(props);

    this.sendVideoRemappingEmail = this.sendVideoRemappingEmail.bind(this);
  }

  // todo: emailBody = "audiodescription id has to be found in back-end api";
  sendVideoRemappingEmail() {
    // const id = this.props._id;
    // const url = `${conf.apiUrl}/users/sendvideoremappingemail`;
    // const optionObj = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     id: id,
    //   })
    // };
    // ourFetchWithToken(url, true, optionObj).then((response) => {
    //   alert(response.info);
    // });
  }

  render() {
    return (
      <tr>
        <td>
          <Link to={`/video/${this.props.youtube_id}`} target={this.props._id}>
            {this.props._id.substr(-6, 6)}
          </Link>
        </td>
        <td>{this.props.title}</td>
        <td>{this.props.category}</td>
        <td>{this.props.status}</td>
        <td>{this.props.created_at}</td>
        <td>
          <Link to={`/admin/video/detail/${this.props._id}?keyword=${this.props.keyword}&order=${this.props.order}&sortby=${this.props.sortBy}`} target={this.props._id}>
            Video Remapping
          </Link>
        </td>
      </tr>
    );
  }
}

export default VideoComponent;
