import React from "react";
import AdminNav from "../../components/admin-nav/AdminNav.jsx";
import AudioClipComponent from "./AudioClipComponent.jsx";
import { ButtonToolbar, Button, FormControl, Form, Table } from "react-bootstrap";
import { ourFetchWithToken, convertTimeToCardFormat, convertViewsToCardFormat } from "../../shared/helperFunctions";

const conf = require("../../shared/config")();

class AudioClips extends Admin {
  constructor(props) {
    super(props);
    this.state = {
      audioClips: [],
    };
    this.currentPageNumber = 1;
  }

  componentWillMount() {
    document.title = this.props.translate("Audio");
    this.loadAudioClips();
  }

  loadAudioClips() {
    const url = `${conf.apiUrl}/audioclips?page=${this.currentPageNumber}`;
    const audioClips = [];
    ourFetchWithToken(url).then((response) => {
      const items = response.result;
      console.log(items);
      for (var i = 0; i < items.length; ++i) {
        var created_at = items[i].created_at.toString();
        audioClips.push(
          <AudioClipComponent
            key={items[i]._id}
            video={items[i].video.substr(-6, 6)}
            description={items[i].audio_description.substr(-6, 6)}
            user={items[i].user.substr(-6, 6)}
            playback={items[i].playback_type}
            created_at={created_at.substr(0, 4) + "-" + created_at.substr(4, 2) + "-" + created_at.substr(6, 2)}
          />
        );
      }
      this.setState({audioClips: audioClips});
    });
  }

  render() {
    return (
      <div className="admin-responsive">
        <AdminNav/>
        <main className="w3-row">
          <h4>List of Audio Clips</h4>
          <Table striped bordered hover>
          <thead>
            <tr>
              <th>Video</th>
              <th>Description</th>
              <th>Describer</th>
              <th>Playback</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.audioClips}
          </tbody>
          </Table>
        </main>
      </div>
    );
  };
}
export default AudioClips;
