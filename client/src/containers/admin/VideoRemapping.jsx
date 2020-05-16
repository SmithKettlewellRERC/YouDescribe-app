import React, { Component } from "react";
import VideoRemappingComponent from "./VideoRemappingComponent.jsx";
import { Navbar, Nav, NavDropdown, Button, FormControl, Form, Table } from "react-bootstrap";
import { Link } from "react-router";
import { ourFetch, convertTimeToCardFormat, convertViewsToCardFormat } from "../../shared/helperFunctions";

const conf = require("../../shared/config")();

class VideoRemapping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      originalVideo: this.props.originalVideo,
      selectedYoutubeId: this.props.selectedYoutubeId,
      youtubeVideos: [],
    }
  }

  componentWillMount() {
    document.title = "Video Detail";
    this.loadSimilarYoutubeVideos();
  }

  loadSimilarYoutubeVideos() {
    let youtubeVideoIds = "";
    const title = encodeURIComponent(this.state.originalVideo.title);
    const urlForSearch = `${conf.youTubeApiUrl}/search?part=snippet&q=${title}&maxResults=5&type=video&key=${conf.youTubeApiKey}`;
    const youtubeVideos = [];
    ourFetch(urlForSearch).then((result) => {
      const ids = [];
      result.items.forEach(youtubeVideo => {
        ids.push(youtubeVideo.id.videoId);
      });
      youtubeVideoIds = ids.join(",");
    }).then(() => {
      const urlForVideoDetail = `${conf.youTubeApiUrl}/videos?id=${youtubeVideoIds}&part=contentDetails,snippet,statistics&key=${conf.youTubeApiKey}`;
      ourFetch(urlForVideoDetail).then((result) => {
        const items = result.items;
        for (var i = 0; i < items.length; ++i) {
          if (youtubeVideos.length >= 5) {
            break;
          }
          if (items[i].snippet && items[i].contentDetails) {
            youtubeVideos.push(
              <VideoRemappingComponent
                key={items[i].id}
                youtube_id={items[i].id}
                checked={this.state.selectedYoutubeId == items[i].id}
                title={items[i].snippet.title}
                description={items[i].snippet.description}
                duration={items[i].contentDetails.duration}
                keyword={this.props.keyword}
                sortBy={this.props.sortBy}
                order={this.props.order}
              />
            )
          }
        }
        this.setState({
          youtubeVideos: youtubeVideos,
        });
      });
    });
  }

  render() {
    return (
      <div>
        <h4>List of Similar Videos</h4>
        <Table striped bordered hover>
        <tbody>
          {this.state.youtubeVideos}
        </tbody>
        </Table>
      </div>
    );
  };
};

export default VideoRemapping;
