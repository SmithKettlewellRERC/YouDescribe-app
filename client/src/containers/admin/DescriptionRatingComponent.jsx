import React, { Component } from "react";

class DescriptionRatingComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <tr>
        <td>{this.props.user}</td>
        <td>{this.props.rating}</td>
      </tr>
    );
  }
}

export default DescriptionRatingComponent;
