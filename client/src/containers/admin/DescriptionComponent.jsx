import React, { Component } from "react";
import { Link, browserHistory } from "react-router";
import { ourFetch } from "../../shared/helperFunctions";
const conf = require("../../shared/config")();

class DescriptionComponent extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const element = document.getElementById(this.props._id);
    element.className = "text-success";
  }

  render() {
    const tr_class = this.props.admin_review == "" ? "" : "text-success";
    return (
      <tr className={tr_class} id={this.props._id}>
        <td>
          <Link to={`/admin/description/detail/${this.props._id}?keyword=${this.props.keyword}&order=${this.props.order}&sortby=${this.props.sortBy}`} target={this.props._id} onClick={this.handleClick}>
            {this.props._id.substr(-6, 6)}
          </Link>
        </td>
        <td>{this.props.video.title}</td>
        <td>{this.props.user.name}</td>
        <td>{this.props.status}</td>
        <td>{this.props.video.youtube_status}</td>
        <td>{this.props.video.category}</td>
        <td>{this.props.rating}</td>
        <td>{this.props.created_at}</td>
      </tr>
    );
  }
}

export default DescriptionComponent;
