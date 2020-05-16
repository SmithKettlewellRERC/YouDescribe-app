import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import Echarts from "echarts";
import { ButtonToolbar, Button, FormControl, Form, Table } from "react-bootstrap";
import AdminNav from "../../components/admin-nav/AdminNav.jsx";
import { ourFetchWithToken, convertTimeToCardFormat, convertViewsToCardFormat } from "../../shared/helperFunctions";

const conf = require("../../shared/config")();

class SummaryOfDataRecords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataRecords: [],
      showLoading: true,
    };
  }

  componentWillMount() {
    document.title = this.props.translate("Statistics");
    this.loadStatistics();
  }

  // <= 5, 6 ~ 10, 11 ~ 15, 16 ~ 20, 21 ~ 25, > 25
  loadStatistics() {
    const url = `${conf.apiUrl}/statistics/getcountofdatarecords`;
    ourFetchWithToken(url).then((response) => {
      const dataRecords = new Array(3).fill(0);
      const items = response.result;
      dataRecords[0] = items.countOfVideos;
      dataRecords[1] = items.countOfDescriptions;
      dataRecords[2] = items.countOfAudioClips;
      this.setState({
        dataRecords: dataRecords,
        showLoading: false,
      });
    });
  }

  getOption() {
    return {
      title: {
        // text: "Number Of Videos / Descriptions / Audio Clips For Statistics",
      },
      tooltip: {},
      legend: {},
      xAxis: [{
        type: "category",
        data: [
          "videos",
          "descriptions",
          "audio clips",
        ]
      }],
      yAxis: [{
        name: "count of records",
        type: "value",
      }],
      series: [{
        name: "count of records",
        type: "bar",
        data: this.state.dataRecords,
      }],
    };
  }

  render() {
    return (
      <div className="admin-responsive">
        <AdminNav/>
        <main className="w3-row">
          <div style={{textAlign: "center", fontSize: 20}}><b>Number Of Videos / Descriptions / Audio Clips For Statistics</b></div>
          <ReactEcharts 
            option={this.getOption()} 
            style={{height: "350px", width: "100%"}}
            className="react_for_echarts"
            showLoading={this.state.showLoading}
          />
        </main>
      </div>
    );
  };
}
export default SummaryOfDataRecords;