import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import Echarts from "echarts";
import { ButtonToolbar, Button, FormControl, Form, Table } from "react-bootstrap";
import AdminNav from "../../components/admin-nav/AdminNav.jsx";
import { ourFetchWithToken, convertTimeToCardFormat, convertViewsToCardFormat } from "../../shared/helperFunctions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const conf = require("../../shared/config")();

class TagsOfVideos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: (decodeURIComponent(props.location.query.category) || "Howto & Style"),
      group: (props.location.query.group || "described"),
      startDate: (parseInt(props.location.query.startdate) || (new Date(conf.startDateTimeStamp)).getTime()),
      endDate: (parseInt(props.location.query.enddate) || (new Date()).getTime()),
      tagKeys: [],
      tagValues: [],
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
    const url = `${conf.apiUrl}/statistics/gettagsofvideos?category=${encodeURIComponent(this.state.category)}&group=${this.state.group}&startdate=${this.state.startDate}&enddate=${this.state.endDate}`;
    ourFetchWithToken(url).then((response) => {
      const tagKeys = [];
      const tagValues = [];
      const items = response.result;
      items.forEach(item => {
        tagKeys.unshift(item._id);
        tagValues.unshift(item.count);
      });
      this.setState({
        tagKeys: tagKeys,
        tagValues: tagValues,
        showLoading: false,
      });
    });
  }

  getOption() {
    return {
      title: {
        // text: `Tags Of ${this.state.group.toUpperCase()} Videos\nCategory: ${this.state.category}`
      },
      grid: {
        left: "12%",
        right: "3%",
      },
      tooltip: {},
      legend: {},
      xAxis: [{
        type: "value",
      }],
      yAxis: [{
        type: "category",
        data: this.state.tagKeys,
      }],
      series: [{
        name: "frequency",
        type: "bar",
        data: this.state.tagValues,
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
    window.location.href = `/statistics/tagsofvideos?category=${encodeURIComponent(this.state.category)}&group=${this.state.group}&startdate=${this.state.startDate}&enddate=${this.state.endDate}`;
  }

  render() {
    return (
      <div className="admin-responsive">
        <AdminNav/>
        <main className="w3-row">
          <div style={{textAlign: "center", fontSize: 20}}><b>Top-10 Tags Of {this.state.group.toUpperCase()} Videos In "{this.state.category}" Category</b></div>
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
export default TagsOfVideos;