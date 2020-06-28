import React, { Component } from "react";
import AdminNav from "../../components/admin-nav/AdminNav.jsx";
import DescriptionComponent from "./DescriptionComponent.jsx";
import ReactPaginate from "react-paginate";
import { Link } from "react-router";
import { ButtonToolbar, Button, FormControl, Form, Table } from "react-bootstrap";
import { ourFetchWithToken, convertTimeToCardFormat, convertViewsToCardFormat } from "../../shared/helperFunctions";

const conf = require("../../shared/config")();

class Descriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descriptions: [],
      totalCount: 0,
    }

    this.pageNumber = props.location.query.page;
    if (this.pageNumber == undefined || this.pageNumber == "") {
      this.pageNumber = 1;
    }

    this.keyword = (props.location.query.keyword || "").trim();
    if (this.keyword.match(/^https:\/\/(?:www\.)?youtube.com\/watch\?(?=v=\w+)(?:\S+)?$/g)) {
      const url = new URL(this.keyword);
      this.keyword = url.searchParams.get("v");
    }

    this.sortBy = props.location.query.sortby;
    if (this.sortBy == undefined || this.sortBy == "") {
      this.sortBy = "video._id";
    }

    this.order = props.location.query.order;
    if (this.order == undefined || this.order != 1) {
      this.order = -1;
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentWillMount() {
    document.title = this.props.translate("Descriptions");
    this.loadDescriptions(this.pageNumber);
  }

  loadDescriptions(pageNumber) {
    const url = `${conf.apiUrl}/audiodescriptions/getallbypage?keyword=${this.keyword}&page=${pageNumber}&sortby=${this.sortBy}&order=${this.order}`;
    ourFetchWithToken(url).then((response) => {
      const descriptions = [];
      const items = response.result;
      items.forEach(item => {
        const created_at = item.created_at.toString();
        if (item.video) {
          descriptions.push(
            <DescriptionComponent
              key={item._id}
              admin_review={item.admin_review}
              _id={item._id}
              video={item.video}
              user={item.user}
              status={item.status}
              rating={item.overall_rating_average}
              created_at={created_at.substr(0, 4) + "-" + created_at.substr(4, 2) + "-" + created_at.substr(6, 2)}
              keyword={this.keyword}
              sortBy={this.sortBy}
              order={this.order}
            />
          );
        }
      });
      this.setState({
        descriptions: descriptions,
        totalCount: response.count,
      });
    });
  }

  handleChange(li) {
    this.pageNumber = li.selected + 1;
    window.location.href = `/admin/descriptions?keyword=${this.keyword}&page=${this.pageNumber}&sortby=${this.sortBy}&order=${this.order}`;
  }

  handleSort(sortBy) {
    this.order = (this.order == -1) ? 1 : -1;
    this.sortBy = sortBy;
    window.location.href = `/admin/descriptions?keyword=${this.keyword}&sortby=${this.sortBy}&order=${this.order}`;
  }

  render() {
    if (!window.localStorage.getItem("adminToken") || !window.localStorage.getItem("adminLevel")) {
      return null;
    }
    
    let startNumber = 0;
    let endNumber = 0;
    if (this.pageNumber >= 1 && this.pageNumber <= Math.ceil(this.state.totalCount / 50)) {
      startNumber = this.pageNumber * 50 - 49;
      endNumber = Math.min(this.pageNumber * 50, this.state.totalCount);
    }
    return (
      <div className="admin-responsive">
        <AdminNav
          descriptionKeyword={this.keyword}
          descriptionSortBy={this.sortBy}
          descriptionOrder={this.order}
        />
        <main className="w3-row">
          <div style={{textAlign: "center", fontSize: 20}}><b>List of Descriptions</b></div>
          <b>Click Id for Full Info</b><br/>
          <b>Click Column Header for Sorting</b>
          <b className="pull-right">{startNumber} - {endNumber} out of {this.state.totalCount}</b>
          <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{width: "8%"}}><Link onClick={() => this.handleSort("video._id")}>Id</Link></th>
              <th style={{width: "30%"}}><Link onClick={() => this.handleSort("video.title")}>Title</Link></th>
              <th style={{width: "12%"}}><Link onClick={() => this.handleSort("user.name")}>Describer</Link></th>
              <th style={{width: "10%"}}><Link onClick={() => this.handleSort("status")}>Description Status</Link></th>
              <th style={{width: "10%"}}><Link onClick={() => this.handleSort("video.youtube_status")}>Video Status</Link></th>
              <th style={{width: "10%"}}><Link onClick={() => this.handleSort("video.category")}>Video Category</Link></th>
              <th><Link onClick={() => this.handleSort("overall_rating_average")}>Overall Rating</Link></th>
              <th style={{width: "10%"}}><Link onClick={() => this.handleSort("created_at")}>Created At</Link></th>
            </tr>
          </thead>
          <tbody>
            {this.state.descriptions}
          </tbody>
          </Table>
        </main>

        <div className="d-flex justify-content-center">
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            pageCount={Math.ceil(this.state.totalCount / 50)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handleChange}
            initialPage={this.pageNumber - 1}
            disableInitialCallback={true}
            activeClassName={"active"}
            containerClassName={"self-pagination"}
          />
          <ul className="self-pagination">
            <li className="borderless">Go To</li>
            <Form action="/admin/descriptions" style={{display: "inline-block", width: 50}}>
              <FormControl type="text" name="page"/>
              <FormControl type="hidden" name="keyword" value={this.keyword}/>
              <FormControl type="hidden" name="order" value={this.order}/>
              <FormControl type="hidden" name="sortby" value={this.sortBy}/>
            </Form>
          </ul>
        </div>
      </div>
    );
  };
}
export default Descriptions;
