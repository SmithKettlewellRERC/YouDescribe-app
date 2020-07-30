import React, { Component } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Button,
  FormControl,
  Form
} from "react-bootstrap";
import { Link } from "react-router";

class AdminNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoKeyword: this.props.videoKeyword,
      videoOrder: this.props.videoOrder,
      videoSortBy: this.props.videoSortBy,
      descriptionKeyword: this.props.descriptionKeyword,
      descriptionOrder: this.props.descriptionOrder,
      descriptionSortBy: this.props.descriptionSortBy,
      modules: []
    };

    this.handleVideoKeywordChange = this.handleVideoKeywordChange.bind(this);
    this.handleDescriptionKeywordChange = this.handleDescriptionKeywordChange.bind(
      this
    );
  }

  componentWillMount() {
    this.loadModules();
  }

  loadModules() {
    const modules = [];
    if (localStorage.getItem("adminLevel")) {
      modules.push(
        <Nav.Link
          key="videos"
          style={{ fontSize: 20 }}
          href="#"
          onClick={() => this.handleClick("/admin/videos")}
        >
          Videos
        </Nav.Link>
      );
      modules.push(
        <Form key="searchforvideos" action="/admin/videos" inline>
          <FormControl
            type="text"
            style={{ width: 180 }}
            placeholder="Find Videos..."
            name="keyword"
            defaultValue={this.state.videoKeyword}
            onChange={event => this.handleVideoKeywordChange(event)}
            className="mr-sm-2"
          />
          <FormControl
            type="hidden"
            name="order"
            value={this.state.videoOrder}
          />
          <FormControl
            type="hidden"
            name="sortby"
            value={this.state.videoSortBy}
          />
          <Button
            type="submit"
            variant="outline-success"
            onClick={this.handleClick}
          >
            Search
          </Button>
        </Form>
      );
    }
    if (localStorage.getItem("adminLevel") == 0) {
      modules.push(
        <Nav.Link
          key="descriptions"
          style={{ fontSize: 20 }}
          className="ml-auto"
          href="#"
          onClick={() => this.handleClick("/admin/descriptions")}
        >
          Descriptions
        </Nav.Link>
      );
      modules.push(
        <Form key="searchfordescriptions" action="/admin/descriptions" inline>
          <FormControl
            type="text"
            style={{ width: 180 }}
            placeholder="Find Descriptions..."
            name="keyword"
            defaultValue={this.state.descriptionKeyword}
            onChange={event => this.handleDescriptionKeywordChange(event)}
            className="mr-sm-2"
          />
          <FormControl
            type="hidden"
            name="order"
            value={this.state.descriptionOrder}
          />
          <FormControl
            type="hidden"
            name="sortby"
            value={this.state.descriptionSortBy}
          />
          <Button
            type="submit"
            variant="outline-success"
            onClick={this.handleClick}
          >
            Search
          </Button>
        </Form>
      );
      modules.push(
        <NavDropdown
          key="statistics"
          style={{ fontSize: 20 }}
          className="ml-auto"
          title="Statistics"
          id="collasible-nav-dropdown"
        >
          <NavDropdown.Item
            href="#"
            onClick={() => this.handleClick("/statistics/summaryofdatarecords")}
          >
            Summary Of Data Records
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item
            href="#"
            onClick={() =>
              this.handleClick("/statistics/audioclipsofdescriptions")
            }
          >
            Audio Clips Of Descriptions
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item
            href="#"
            onClick={() =>
              this.handleClick("/statistics/timelengthofaudioclips")
            }
          >
            Time Length Of Audio Clips
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item
            href="#"
            onClick={() =>
              this.handleClick("/statistics/wordcountofaudioclips")
            }
          >
            Word Count Of Audio Clips
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item
            href="#"
            onClick={() =>
              this.handleClick("/statistics/wordcloudofaudioclips")
            }
          >
            Word Cloud Of Audio Clips
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item
            href="#"
            onClick={() => this.handleClick("/statistics/categoriesofvideos")}
          >
            Categories Of Videos
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item
            href="#"
            onClick={() => this.handleClick("/statistics/summaryoftimerange")}
          >
            Summary Of Time Range
          </NavDropdown.Item>
        </NavDropdown>
      );
    }
    if (localStorage.getItem("adminLevel")) {
      modules.push(
        <Nav.Link
          key="signout"
          style={{ fontSize: 20 }}
          className="ml-auto"
          href="#"
          onClick={() => this.handleSignOut()}
        >
          SignOut
        </Nav.Link>
      );
    }
    this.setState({
      modules: modules
    });
  }

  handleClick(url) {
    location.href = url;
  }

  handleVideoKeywordChange(event) {
    this.setState({
      videoKeyword: event.target.value
    });
  }

  handleDescriptionKeywordChange(event) {
    this.setState({
      descriptionKeyword: event.target.value
    });
  }

  handleSignOut() {
    localStorage.clear();
    window.location.href = "/admin/signin";
  }

  render() {
    return (
      // https://react-bootstrap.github.io/components/navbar/
      <div>
        <header className="w3-container w3-indigo">
          <h2
            style={{
              fontSize: 20,
              lineHeight: 1.5,
              marginTop: 10,
              marginBottom: 10
            }}
          >
            ADMIN PANEL
          </h2>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          />
        </header>
        <div className="top-navbar">
          <nav>
            <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav" className="mr-auto">
                {this.state.modules}
              </Navbar.Collapse>
            </Navbar>
          </nav>
        </div>
      </div>
    );
  }
}

export default AdminNav;
