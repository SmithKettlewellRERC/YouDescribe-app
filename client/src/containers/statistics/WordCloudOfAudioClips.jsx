import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import Echarts from "echarts";
import { ButtonToolbar, Button, FormControl, Form, Table } from "react-bootstrap";
import AdminNav from "../../components/admin-nav/AdminNav.jsx";
import { ourFetchWithToken, convertTimeToCardFormat, convertViewsToCardFormat } from "../../shared/helperFunctions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const conf = require("../../shared/config")();

class WordCloudOfAudioClips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: (parseInt(props.location.query.startdate) || (new Date(conf.startDateTimeStamp)).getTime()),
      endDate: (parseInt(props.location.query.enddate) || (new Date()).getTime()),
      user: (props.location.query.user || ""),
      wordCloud: [],
      showLoading: true,
    };

    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleReload = this.handleReload.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
  }

  componentWillMount() {
    document.title = this.props.translate("Statistics");
    this.loadStatistics();
  }

  loadStatistics() {
    const url = `${conf.apiUrl}/statistics/getwordcloudofaudioclips?user=${this.state.user}&startdate=${this.state.startDate}&enddate=${this.state.endDate}`;
    ourFetchWithToken(url).then((response) => {
      const wordCloud = [];
      const items = response.result;
      items.forEach(item => {
        wordCloud.push({
          name: item._id,
          value: item.count,
          textStyle: {
            normal: {},
            emphasis: {}
          }
        });
      });
      this.setState({
        wordCloud: wordCloud,
        showLoading: false,
      });
    });
  }

  getOption() {
    require("echarts-wordcloud");
    return {
      title: {
        // text: "Word Cloud",
      },
      tooltip: {},
      series: [{
        type: "wordCloud",

        // the shape of the "cloud" to draw
        // can be any polar equation represented as a callback function, or a keyword present
        // available presents: circle (default), cardioid (apple or heart shape curve, the most known polar equation),
        //                     diamond (alias of square), triangle-forward, triangle, (alias of triangle-upright), pentagon, and star.
        shape: "circle",

        // left/top/width/height/right/bottom are used for positioning the word cloud
        // default to be put in the center and has 75% x 80% size.
        left: "center",
        top: "center",
        width: "100%", // 70%
        height: "80%",
        right: null,
        bottom: null,

        // text size range which the value in data will be mapped to.
        // default to have minimum 12px and maximum 60px size.
        sizeRange: [12, 60],

        // text rotation range and step in degree
        // text will be rotated randomly in range [] by rotationStep 
        rotationRange: [-0, 0], // [-90, 90]
        rotationStep: 0, // 45

        // size of the grid in pixels for marking the availability of the canvas
        // the larger the grid size, the bigger the gap between words.
        gridSize: 8,

        // set to true to allow word being draw partly outside of the canvas.
        // allow word bigger than the size of the canvas to be drawn
        drawOutOfBound: false,

        // global text style
        textStyle: {
          normal: {
            fontFamily: "sans-serif",
            fontWeight: "bold",
            // color can be a callback function or a color string
            color: function () {
              // random color
              return "rgb(" + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
              ].join(",") + ")";
            }
          },
          emphasis: {
            shadowBlur: 10,
            shadowColor: "#333",
          },
        },

        // data in array format
        // each array item must have name and value property
        data: this.state.wordCloud,
      }],
    };
  }

  handleStartDateChange(startDate) {
    this.setState({
      startDate: startDate.getTime(),
    });
  };

  handleEndDateChange(endDate) {
    this.setState({
      endDate: endDate.getTime(),
    });
  };

  handleUserChange(event) {
    const user = event.target.value;
    this.setState({
      user: user,
    });
  }

  handleReload() {
    location.href = `/statistics/wordcloudofaudioclips?user=${this.state.user}&startdate=${this.state.startDate}&enddate=${this.state.endDate}`;
  }

  handleDownload() {
    window.open(
      `${conf.apiUrl}/statistics/getwordcloudofaudioclips?download=yes&user=${this.state.user}&startdate=${this.state.startDate}&enddate=${this.state.endDate}`,
      "_blank",
    );
  }

  render() {
    return (
      <div className="admin-responsive">
        <AdminNav/>
        <main className="w3-row">
          <div style={{textAlign: "center", fontSize: 20}}><b>Word Cloud Of Audio Clips</b></div>
          <div style={{textAlign: "center"}}>
            <div style={{display: "inline-block"}}>
              <FormControl type="text" size="sm" placeholder="Enter User Name..." name="user" value={this.state.user} onChange={(event) => this.handleUserChange(event)}/>
            </div>
            <span style={{marginLeft: 10, marginRight: 10}}></span>
            <div style={{display: "inline-block"}}>
              Start Date:&nbsp;
              <DatePicker
                placeholderText="Start Date"
                selected={this.state.startDate}
                onChange={(value) => this.handleStartDateChange(value)}
              />
            </div>
            <span style={{marginLeft: 10, marginRight: 10}}></span>
            <div style={{display: "inline-block"}}>
              End Date:&nbsp;
              <DatePicker
                placeholderText="End Date"
                selected={this.state.endDate}
                onChange={(value) => this.handleEndDateChange(value)}
              />
            </div>
            <span style={{marginLeft: 10, marginRight: 10}}></span>
            <Button type="submit" style={{marginTop: 20, marginBottom: 20}} variant="outline-info" onClick={this.handleReload}>Reload</Button>
          </div>
          <ReactEcharts 
            option={this.getOption()} 
            style={{height: "350px", width: "100%"}}
            className="react_for_echarts"
            showLoading={this.state.showLoading}
          />
          <Button type="submit" style={{marginTop: 20, marginBottom: 20}} variant="outline-info" onClick={this.handleDownload}>Download</Button>
        </main>
      </div>
    );
  };
}
export default WordCloudOfAudioClips;