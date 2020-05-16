import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import Echarts from "echarts";
import { ButtonToolbar, Button, FormControl, Form, Table } from "react-bootstrap";
import AdminNav from "../../components/admin-nav/AdminNav.jsx";
import { ourFetchWithToken, convertTimeToCardFormat, convertViewsToCardFormat } from "../../shared/helperFunctions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const conf = require("../../shared/config")();

class DailyCountOfDataRecords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: (decodeURIComponent(props.location.query.type) || "Video Visits"),
      startDate: (parseInt(props.location.query.startdate) || (new Date(conf.startDateTimeStamp)).getTime()),
      endDate: (parseInt(props.location.query.enddate) || (new Date()).getTime()),
      dailyKeys: [],
      dailyValues: [],
      showLoading: true,
    };

    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleReload = this.handleReload.bind(this);
  }

  componentWillMount() {
    document.title = this.props.translate("Statistics");
    this.loadStatistics();
  }

  loadStatistics() {
    const url = (this.state.type == "Words") ? `${conf.apiUrl}/statistics/getdailycountofwords?startdate=${this.state.startDate}&enddate=${this.state.endDate}` : 
                `${conf.apiUrl}/statistics/getdailycountofdatarecords?type=${encodeURIComponent(this.state.type)}&startdate=${this.state.startDate}&enddate=${this.state.endDate}`;
    ourFetchWithToken(url).then((response) => {
      const dailyKeys = [];
      const dailyValues = [];
      const items = response.result;
      items.forEach(item => {
        dailyKeys.push(item._id);
        dailyValues.push(item.count);
      });
      this.setState({
        dailyKeys: dailyKeys,
        dailyValues: dailyValues,
        showLoading: false,
      });
    });
  }

  getOption() {
    return {
      title: {
        // text: `Daily Count Of ${this.state.type}`,
      },
      tooltip: {},
      legend: {},
      xAxis: [{
        type: "category",
        boundaryGap: false,
        data: this.state.dailyKeys,
      }],
      yAxis: [{
        name: "daily count",
        type: "value",
      }],
      series: [{
        name: "daily count",
        areaStyle: {},
        smooth: false,
        type: "line",
        data: this.state.dailyValues,
      }],
      dataZoom: [{
        show: true,
        start: 0,
        end: 100,
      // },{
      //   type: "inside",
      //   start: 90,
      //   end: 100,
      // },{
      //   show: true,
      //   yAxisIndex: 0,
      //   filterMode: "empty",
      //   width: 30,
      //   height: "80%"",
      //   showDataShadow: false,
      //   left: "93%",
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

  handleReload() {
    window.location.href = `/statistics/dailycountofdatarecords?type=${encodeURIComponent(this.state.type)}&startdate=${this.state.startDate}&enddate=${this.state.endDate}`;
  }

  render() {
    return (
      <div className="admin-responsive">
        <AdminNav/>
        <main className="w3-row">
          <div style={{textAlign: "center", fontSize: 20}}><b>Daily Count Of {this.state.type}</b></div>
          <div style={{textAlign: "center"}}>
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
        </main>
      </div>
    );
  };
}
export default DailyCountOfDataRecords;