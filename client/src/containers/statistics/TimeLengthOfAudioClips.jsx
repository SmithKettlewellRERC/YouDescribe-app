import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import Echarts from "echarts";
import { ButtonToolbar, Button, FormControl, Form, Table } from "react-bootstrap";
import AdminNav from "../../components/admin-nav/AdminNav.jsx";
import { ourFetchWithToken, convertTimeToCardFormat, convertViewsToCardFormat } from "../../shared/helperFunctions";

const conf = require("../../shared/config")();

class TimeLengthOfAudioClips extends Component {
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

  // <=5, 6~10, 11~15, 16~30, 31~60, >60
  loadStatistics() {
    const url = `${conf.apiUrl}/statistics/gettimelengthofaudioclips`;
    ourFetchWithToken(url).then((response) => {
      const audioClips = new Array(6).fill(0);
      var max = 0;
      var min = Infinity;
      var avg = 0;
      const items = response.result;
      for (var i = 0; i < items.length; ++i) {
        var length = items[i].duration;

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
        } else if (length <= 30) {
          length = 3;
        } else if (length <= 60) {
          length = 4;
        } else {
          length = 5;
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
        // text: "Time Length (In Seconds) Per Audio Clip",
      },
      tooltip: {},
      legend: {},
      xAxis: [{
        type: "category",
        data: [
          "<=5s",
          "6~10s",
          "11~15s",
          "16~30s",
          "31~60s",
          ">60s",
        ],
      }],
      yAxis: [{
        name: "count of audio clips",
        type: "value",
      }],
      series: [{
        name: "count of audio clips",
        type: "bar",
        data: this.state.audioClips,
      }],
    };
  }

  render() {
    return (
      <div className="admin-responsive">
        <AdminNav/>
        <main className="w3-row">
          <div style={{textAlign: "center", fontSize: 20}}><b>Time Length (In Seconds) Per Audio Clip</b></div>
          <ReactEcharts 
            option={this.getOption()} 
            style={{height: '350px', width: '100%'}}
            className='react_for_echarts'
            showLoading={this.state.showLoading}
          />
          <Table striped bordered hover>
          <tbody>
            <tr>
              <th style={{width: "30%"}}>Maximum</th>
              <th>{this.state.max.toFixed(2)} Second(s) / Audio Clip</th>
            </tr>
            <tr>
              <th>Minimum</th>
              <th>{this.state.min.toFixed(2)} Second(s) / Audio Clip</th>
            </tr>
            <tr>
              <th>Average</th>
              <th>{this.state.avg.toFixed(2)} Second(s) / Audio Clip</th>
            </tr>
          </tbody>
          </Table>
        </main>
      </div>
    );
  };
}
export default TimeLengthOfAudioClips;