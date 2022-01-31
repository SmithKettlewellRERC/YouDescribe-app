import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import Echarts from "echarts";
import { Link } from "react-router";
import {
  ButtonToolbar,
  Button,
  FormControl,
  Form,
  Table,
} from "react-bootstrap";
import AdminNav from "../../components/admin-nav/AdminNav.jsx";
import {
  ourFetchWithToken,
  convertTimeToCardFormat,
  convertViewsToCardFormat,
} from "../../shared/helperFunctions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const conf = require("../../shared/config")();

// https://www.npmjs.com/package/react-datepicker
class SummaryOfTimeRange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate:
        parseInt(props.location.query.startdate) ||
        new Date(conf.startDateTimeStamp).getTime(),
      endDate: parseInt(props.location.query.enddate) || new Date().getTime(),
      videoVisits: "loading...",
      webVisits: "loading...",
      users: "loading...",
      audioClips: {
        count: "loading...",
        duration: "loading...",
      },
      audioDescriptionDrafts: "loading...",
      audioDescriptions: "loading...",
      videos: {
        count: "loading...",
        duration: "loading...",
      },
      words: "loading...",
      topVideos: ["loading..."],
      feedbacks: ["loading..."],
    };

    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleReload = this.handleReload.bind(this);
    this.getRoute = this.getRoute.bind(this);
  }

  componentWillMount() {
    document.title = this.props.translate("Statistics");
    this.loadStatistics(this.state.startDate, this.state.endDate);
  }

  loadStatistics(startDate, endDate) {
    this.loadCountOfVisits(startDate, endDate);
    this.loadCountOfFeedbacks(startDate, endDate);
    this.loadCountOfUsers(startDate, endDate);
    this.loadCountOfAudioClips(startDate, endDate);
    this.loadCountOfAudioDescriptions(startDate, endDate);
    this.loadCountOfVideos(startDate, endDate);
    this.loadCountOfWords(startDate, endDate);
    this.loadCountOfPublishedAudioDescriptions(startDate, endDate);
  }

  loadCountOfVisits(startDate, endDate) {
    const url = `${conf.apiUrl}/statistics/getcountofvisits?startdate=${startDate}&enddate=${endDate}`;
    ourFetchWithToken(url).then((response) => {
      const items = response.result;
      const topVideos = [];
      items.topVideos.forEach((item) => {
        topVideos.push(
          <div key={item._id}>
            <Link to={"/video/" + item._id} target={item._id}>
              {item.video.title}
            </Link>
          </div>
        );
      });
      this.setState({
        videoVisits: items.countOfVideoVisits,
        webVisits: items.countOfWebVisits,
        topVideos: topVideos,
      });
    });
  }

  loadCountOfFeedbacks(startDate, endDate) {
    const url = `${conf.apiUrl}/statistics/getcountoffeedbacks?startdate=${startDate}&enddate=${endDate}`;
    ourFetchWithToken(url).then((response) => {
      const items = response.result;
      const feedbacks = [];
      items.forEach((feedback) => {
        feedbacks.push(
          <div key={feedback._id}>
            {conf.audioDescriptionFeedbacks[feedback._id]}
          </div>
        );
      });
      this.setState({
        feedbacks: feedbacks,
      });
    });
  }

  loadCountOfUsers(startDate, endDate) {
    const url = `${conf.apiUrl}/statistics/getcountofusers?startdate=${startDate}&enddate=${endDate}`;
    ourFetchWithToken(url).then((response) => {
      this.setState({
        users: response.result,
      });
    });
  }

  loadCountOfAudioClips(startDate, endDate) {
    const url = `${conf.apiUrl}/statistics/getcountofaudioclips?startdate=${startDate}&enddate=${endDate}`;
    ourFetchWithToken(url).then((response) => {
      this.setState({
        audioClips: response.result,
      });
    });
  }

  loadCountOfAudioDescriptions(startDate, endDate) {
    const url = `${conf.apiUrl}/statistics/getcountofaudiodescriptions?startdate=${startDate}&enddate=${endDate}&status=draft`;
    ourFetchWithToken(url).then((response) => {
      this.setState({
        audioDescriptionDrafts: response.result.count,
      });
    });
  }

  loadCountOfPublishedAudioDescriptions(startDate, endDate) {
    const url = `${conf.apiUrl}/statistics/getcountofaudiodescriptions?startdate=${startDate}&enddate=${endDate}&status=published`;
    ourFetchWithToken(url).then((response) => {
      this.setState({
        audioDescriptions: response.result.count,
      });
    });
  }

  loadCountOfVideos(startDate, endDate) {
    const url = `${conf.apiUrl}/statistics/getcountofvideos?startdate=${startDate}&enddate=${endDate}`;
    ourFetchWithToken(url).then((response) => {
      this.setState({
        videos: response.result,
      });
    });
  }

  loadCountOfWords(startDate, endDate) {
    const url = `${conf.apiUrl}/statistics/getcountofwords?startdate=${startDate}&enddate=${endDate}`;
    ourFetchWithToken(url).then((response) => {
      this.setState({
        words: response.result.count,
      });
    });
  }

  handleStartDateChange(startDate) {
    this.setState({
      startDate: startDate.getTime(),
    });
  }

  handleEndDateChange(endDate) {
    this.setState({
      endDate: endDate.getTime(),
    });
  }

  handleReload() {
    window.location.href = `/statistics/summaryoftimerange?startdate=${this.state.startDate}&enddate=${this.state.endDate}`;
  }

  getRoute(type) {
    return `/statistics/dailycountofdatarecords?type=${encodeURIComponent(
      type
    )}&startdate=${this.state.startDate}&enddate=${this.state.endDate}`;
  }

  render() {
    return (
      <div className="admin-responsive">
        <AdminNav />
        <main className="w3-row">
          <div style={{ textAlign: "center", fontSize: 20 }}>
            <b>Summary Of Time Range</b>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-block" }}>
              Start Date:&nbsp;
              <DatePicker
                placeholderText="Start Date"
                selected={this.state.startDate}
                onChange={(value) => this.handleStartDateChange(value)}
              />
            </div>
            <span style={{ marginLeft: 10, marginRight: 10 }}></span>
            <div style={{ display: "inline-block" }}>
              End Start:&nbsp;
              <DatePicker
                placeholderText="End Date"
                selected={this.state.endDate}
                onChange={(value) => this.handleEndDateChange(value)}
              />
            </div>
            <span style={{ marginLeft: 10, marginRight: 10 }}></span>
            <Button
              type="submit"
              style={{ marginTop: 20, marginBottom: 20 }}
              variant="outline-info"
              onClick={this.handleReload}
            >
              Reload
            </Button>
          </div>
          <Table striped bordered hover style={{ textAlign: "center" }}>
            <thead>
              <tr>
                <th style={{ width: "50%" }}>Item</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Count Of Total Video Visits (not individual)</th>
                <th>
                  {this.state.videoVisits}&nbsp;
                  <Link to={this.getRoute("Video Visits")} target="daily">
                    View Daily Count
                  </Link>
                </th>
              </tr>
              <tr>
                <th>Count Of Total Home Page Visits (not individual)</th>
                <th>
                  {this.state.webVisits}&nbsp;
                  <Link to={this.getRoute("Web Visits")} target="daily">
                    View Daily Count
                  </Link>
                </th>
              </tr>
              <tr>
                <th>Count of User Logins</th>
                <th>
                  {this.state.users}&nbsp;
                  <Link to={this.getRoute("Users")} target="daily">
                    View Daily Count
                  </Link>
                </th>
              </tr>
              <tr>
                <th>Count Of Audio Clips</th>
                <th>
                  {this.state.audioClips.count}&nbsp;
                  <Link to={this.getRoute("Audio Clips")} target="daily">
                    View Daily Count
                  </Link>
                </th>
              </tr>
              <tr>
                <th>Total Audio Descriptions Created</th>
                <th>
                  {parseInt(this.state.audioDescriptionDrafts) +
                    parseInt(this.state.audioDescriptions)}
                  &nbsp;
                  <Link to={this.getRoute("Audio Descriptions")} target="daily">
                    View Daily Count
                  </Link>
                </th>
              </tr>
              <tr>
                <th>Count Of Audio Description Drafts Created</th>
                <th>
                  {this.state.audioDescriptionDrafts}&nbsp;
                  <Link to={this.getRoute("Audio Descriptions")} target="daily">
                    View Daily Count
                  </Link>
                </th>
              </tr>
              <tr>
                <th>Count Of Audio Descriptions Published </th>
                <th>
                  {this.state.audioDescriptions}&nbsp;
                  <Link to={this.getRoute("Audio Descriptions")} target="daily">
                    View Daily Count
                  </Link>
                </th>
              </tr>
              <tr>
                <th>Count Of Videos Added</th>
                <th>
                  {this.state.videos.count}&nbsp;
                  <Link to={this.getRoute("Videos")} target="daily">
                    View Daily Count
                  </Link>
                </th>
              </tr>
              <tr>
                <th>Count Of Words</th>
                <th>
                  {this.state.words}&nbsp;
                  <Link to={this.getRoute("Words")} target="daily">
                    View Daily Count
                  </Link>
                </th>
              </tr>
              <tr>
                <th>Duration Of Audio Clips (s)</th>
                <th>{this.state.audioClips.duration}</th>
              </tr>
              <tr>
                <th>Duration Of Videos (s)</th>
                <th>{this.state.videos.duration}</th>
              </tr>
              <tr>
                <th>Most Viewed Videos</th>
                <th>{this.state.topVideos}</th>
              </tr>
              <tr>
                <th>Most Frequent Feedbacks</th>
                <th>{this.state.feedbacks}</th>
              </tr>
            </tbody>
          </Table>
        </main>
      </div>
    );
  }
}
export default SummaryOfTimeRange;
