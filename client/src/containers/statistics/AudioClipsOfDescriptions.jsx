import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import Echarts from "echarts";
import { ButtonToolbar, Button, FormControl, Form, Table } from "react-bootstrap";
import AdminNav from "../../components/admin-nav/AdminNav.jsx";
import { ourFetchWithToken, convertTimeToCardFormat, convertViewsToCardFormat } from "../../shared/helperFunctions";

const conf = require("../../shared/config")();

class AudioClipsOfDescriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioClips: [],
      max: 0,
      min: 0,
      avg: 0,
      showLoading: true,
    };
  }

  componentWillMount() {
    document.title = this.props.translate("Statistics");
    this.loadStatistics();
  }

  // <=5, 6~10, 11~15, 16~20, 21~25, 26~35, 36~50, 51~100, >100
  loadStatistics() {
    const url = `${conf.apiUrl}/statistics/getaudioclipsofdescriptions`;
    ourFetchWithToken(url).then((response) => {
      const audioClips = new Array(9).fill(0);
      var max = 0;
      var min = Infinity;
      var avg = 0;
      const items = response.result;
      for (var i = 0; i < items.length; ++i) {
        var length = items[i].audio_clips.length;

        if (length > max) {
          max = length;
        }
        if (length < min) {
          min = length;
        }
        avg += length;

        if (length <= 5) {
          length = 0;
        } else if (length <= 10) {
          length = 1;
        } else if (length <= 15) {
          length = 2;
        } else if (length <= 20) {
          length = 3;
        } else if (length <= 25) {
          length = 4;
        } else if (length <= 35) {
          length = 5;
        } else if (length <= 50) {
          length = 6;
        } else if (length <= 100) {
          length = 7;
        } else {
          length = 8;
        }
        audioClips[length]++;
      }
      this.setState({
        audioClips: audioClips,
        max: max,
        min: min,
        avg: avg / items.length,
        showLoading: false,
      });
    });
  }

  getOption() {
    return {
      title: {
        // text: "Number Of Audio Clips Per Description",
      },
      tooltip: {},
      legend: {},
      xAxis: [{
        type: "category",
        data: [
          "<=5clips",
          "6~10clips",
          "11~15clips",
          "16~20clips",
          "21~25clips",
          "26~35clips",
          "36~50clips",
          "51~100clips",
          ">100clips",
        ],
      }],
      yAxis: [{
        name: "count of descriptions",
        type: "value",
      }],
      series: [{
        name: "count of descriptions",
        type: "bar",
        data: this.state.audioClips,
      }],
      // dataZoom: [{
      //     show: true,
      //     realtime: true,
      //     start: 0,
      //     end: 50
      // }, {
      //     type: 'inside',
      //     realtime: true,
      //     start: 0,
      //     end: 50
      // }]
    };
  }

  render() {
    return (
      <div className="admin-responsive">
        <AdminNav/>
        <main className="w3-row">
          <div style={{textAlign: "center", fontSize: 20}}><b>Number Of Audio Clips Per Description</b></div>
          <ReactEcharts 
            option={this.getOption()} 
            style={{height: "350px", width: "100%"}}
            className="react_for_echarts"
            showLoading={this.state.showLoading}
          />
          <Table striped bordered hover>
          <tbody>
            <tr>
              <th style={{width: "30%"}}>Maximum</th>
              <th>{this.state.max} Audio Clip(s) / Description</th>
            </tr>
            <tr>
              <th>Minimum</th>
              <th>{this.state.min} Audio Clip(s) / Description</th>
            </tr>
            <tr>
              <th>Average</th>
              <th>{this.state.avg.toFixed(2)} Audio Clip(s) / Description</th>
            </tr>
          </tbody>
          </Table>
        </main>
      </div>
    );
  };
}
export default AudioClipsOfDescriptions;