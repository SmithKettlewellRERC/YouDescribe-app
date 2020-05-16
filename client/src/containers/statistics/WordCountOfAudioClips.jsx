import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import Echarts from "echarts";
import { ButtonToolbar, Button, FormControl, Form, Table } from "react-bootstrap";
import AdminNav from "../../components/admin-nav/AdminNav.jsx";
import { ourFetchWithToken, convertTimeToCardFormat, convertViewsToCardFormat } from "../../shared/helperFunctions";

const conf = require("../../shared/config")();

class WordCountOfAudioClips extends Component {
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

  // <= 5, 6 ~ 10, 11 ~ 30, 31 ~ 50, 51 ~ 100, > 100
  loadStatistics() {
    const url = `${conf.apiUrl}/statistics/getwordcountofaudioclips`;
    ourFetchWithToken(url).then((response) => {
      const audioClips = new Array(6).fill(0);
      var max = 0;
      var min = Infinity;
      var avg = 0;
      const items = response.result;
      items.forEach(item => {
        var length = item.length;
        max = Math.max(max, length);
        min = Math.min(min, length);
        avg += length;
        if (length <= 5) {
          length = 0;
        } else if (length <= 10) {
          length = 1;
        } else if (length <= 30) {
          length = 2;
        } else if (length <= 50) {
          length = 3;
        } else if (length <= 100) {
          length = 4;
        } else {
          length = 5;
        }
        audioClips[length]++;
      });
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
        // text: "Number Of Words Per Audio Clip",
      },
      tooltip: {},
      legend: {},
      // xAxis: {
      //   data: [
      //     "<=5words",
      //     "6~10words",
      //     "11~30words",
      //     "31~50words",
      //     "51~100words",
      //     ">100words",
      //   ]
      // },
      // yAxis: {},
      xAxis: [{
        type: "category",
        data: [
          "<=5words",
          "6~10words",
          "11~30words",
          "31~50words",
          "51~100words",
          ">100words",
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
          <div style={{textAlign: "center", fontSize: 20}}><b>Number Of Words Per Audio Clip</b></div>
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
              <th>{this.state.max} Word(s) / Audio Clip</th>
            </tr>
            <tr>
              <th>Minimum</th>
              <th>{this.state.min} Word(s) / Audio Clip</th>
            </tr>
            <tr>
              <th>Average</th>
              <th>{this.state.avg.toFixed(2)} Word(s) / Audio Clip</th>
            </tr>
          </tbody>
          </Table>
        </main>
      </div>
    );
  };
}
export default WordCountOfAudioClips;