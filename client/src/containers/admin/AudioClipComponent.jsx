import React, { Component } from "react";
import { Link } from "react-router";
import { browserHistory } from "react-router";
import { ourFetch } from "../../shared/helperFunctions";
const conf = require("../../shared/config")();

class AudioClipComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <tr>
        <td>{this.props.video}</td>
        <td>{this.props.description}</td>
        <td>{this.props.user}</td>
        <td>{this.props.playback}</td>
        <td>{this.props.created_at}</td>
        <td>Edit / Delete</td>
      </tr>
    );
  }
}

export default AudioClipComponent;
