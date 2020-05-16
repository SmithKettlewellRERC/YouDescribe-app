import React, { Component } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router";
import { browserHistory } from "react-router";

const conf = require("../../shared/config")();

class VideoRemappingComponent extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const location = browserHistory.getCurrentLocation();
    window.location.href = `${location.pathname}?youtube_id=${event.target.value}&keyword=${this.props.keyword}&sortby=${this.props.sortBy}&order=${this.props.order}`;
  }

  render() {
    return (
      <tr>
        <td>
        <Container>
          <Row>
            <Form.Check
              type="radio"
              name="youtube"
              value={this.props.youtube_id}
              checked={this.props.checked}
              onChange={(event) => this.handleChange(event)}
            >
            </Form.Check>
            <Col xs="auto">
              <iframe src={"https://www.youtube.com/embed/" + this.props.youtube_id}
                height="180"
                width="320"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="video"
              />
            </Col>
            <Col xs lg="7.5">
              <p><b>Title:</b> {this.props.title}</p>
              <p><b>Description:</b> {this.props.description}</p>
            </Col>
          </Row>
        </Container>
        </td>
      </tr>
    );
  }
}

export default VideoRemappingComponent;
