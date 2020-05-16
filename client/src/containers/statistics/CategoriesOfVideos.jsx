import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import Echarts from "echarts";
import { ButtonToolbar, Button, FormControl, Form, Table } from "react-bootstrap";
import AdminNav from "../../components/admin-nav/AdminNav.jsx";
import { ourFetchWithToken, convertTimeToCardFormat, convertViewsToCardFormat } from "../../shared/helperFunctions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const conf = require("../../shared/config")();

// http://www.echartsjs.com/examples/en/editor.html?c=dataset-simple1
// https://www.echartsjs.com/en/api.html#events
class CategoriesOfVideos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: (parseInt(props.location.query.startdate) || (new Date(conf.startDateTimeStamp)).getTime()),
      endDate: (parseInt(props.location.query.enddate) || (new Date()).getTime()), 
      categories: [],
      source: [],
      showLoading: true,
    };

    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleReload = this.handleReload.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    document.title = this.props.translate("Statistics");
    this.loadCategories();
  }

  loadCategories() {
    const url = `${conf.apiUrl}/statistics/getcategories`;
    ourFetchWithToken(url).then((response) => {
      const items = response.result;
      var categories = [];
      items.forEach(item => {
        categories[item.title] = {
          "category": item.title,
          "described": 0,
          "wishlist-described": 0,
          "wishlist-not-described": 0,
        };
      });
      this.setState({
        categories: categories,
      });
      this.loadStatistics(categories);
    });
  }

  loadStatistics(categories) {
    const url = `${conf.apiUrl}/statistics/getcategoriesofvideos?startdate=${this.state.startDate}&enddate=${this.state.endDate}`;
    var source = [];
    ourFetchWithToken(url).then((response) => {
      const wishListDescribedVideos = response.result.wishListDescribedVideos;
      const wishListNotDescribedVideos = response.result.wishListNotDescribedVideos;
      const describedVideos = response.result.describedVideos;
      for (var i = 0; i < describedVideos.length; ++i) {
        var key = describedVideos[i].category;
        categories[key]["described"]++;
      }
      for (var i = 0; i < wishListDescribedVideos.length; ++i) {
        var key = wishListDescribedVideos[i].category;
        categories[key]["wishlist-described"]++;
      }
      for (var i = 0; i < wishListNotDescribedVideos.length; ++i) {
        var key = wishListNotDescribedVideos[i].category;
        categories[key]["wishlist-not-described"]++;
      }
      for (key in categories) {
        if (categories[key]["described"] || categories[key]["wishlist-described"] || categories[key]["wishlist-not-described"]) {
          source.push(categories[key]);
        }
      }
      this.setState({
        source: source,
        showLoading: false,
      });
    });
  }

  getOption() {
    return {
      title: {
        // text: "Number Of Videos Per Category",
      },
      grid: {
        left: "12%",
        right: "3%",
      },
      tooltip: {},
      legend: {},
      dataset: {
        dimensions: ["category", "described", "wishlist-described", "wishlist-not-described"],
        source: this.state.source,
      },
      xAxis: {},
      yAxis: {
        type: "category",
      },
      series: [
        {type: 'bar'},
        {type: 'bar'},
        {type: 'bar'},
      ],
    };
  }

  getOnEvents() {
    return {
      click: this.handleClick,
    }
  }

  handleClick(params) {
    window.open(
      `/statistics/tagsofvideos?category=${encodeURIComponent(params.name)}&group=${params.seriesName}&startdate=${this.state.startDate}&enddate=${this.state.endDate}`,
      "_blank",
    );
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
    window.location.href = `/statistics/categoriesofvideos?startdate=${this.state.startDate}&enddate=${this.state.endDate}`;
  }

  render() {
    return (
      <div className="admin-responsive">
        <AdminNav/>
        <main className="w3-row">
          <div style={{textAlign: "center", fontSize: 20}}><b>Number Of Videos Per Category</b></div>
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
            onEvents={this.getOnEvents()}
            style={{height: "750px", width: "100%"}}
            className="react_for_echarts"
            showLoading={this.state.showLoading}
          />
        </main>
      </div>
    );
  };
}
export default CategoriesOfVideos;