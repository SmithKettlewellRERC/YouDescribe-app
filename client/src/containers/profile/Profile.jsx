import React, { Component } from "react";
import {
  ButtonToolbar,
  Button,
  FormControl,
  Form,
  Table
} from "react-bootstrap";
import {
  ourFetch,
  convertTimeToCardFormat,
  convertViewsToCardFormat
} from "../../shared/helperFunctions";
import { browserHistory, Router, useHistory } from "react-router";

const conf = require("../../shared/config")();

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optInChoices: [false, false, false],
      optIn: false,
      reviewStatus: "",
      userId: this.props.params.userId
    };
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleRadioButtonChange = this.handleRadioButtonChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentWillMount() {
    document.title = this.props.translate("My profile");
    this.loadUser();
  }

  loadUser() {
    const url = `${conf.apiUrl}/users/${this.state.userId}`;
    ourFetch(url).then(response => {
      const user = response.result;
      const optInChoices = [false, false, false];
      user.opt_in.forEach(index => {
        optInChoices[index] = true;
      });
      this.setState({
        optInChoices: optInChoices,
        optIn: user.opt_in.length > 0 ? true : false,
        reviewStatus: user.policy_review
      });
    });
  }

  handleCheckBoxChange(event) {
    let optInChoices = this.state.optInChoices;
    const index = event.target.id;
    if (index == 3) {
      optInChoices = event.target.checked
        ? [true, true, true]
        : [false, false, false];
    } else {
      optInChoices[index] = event.target.checked;
    }
    this.setState({
      optInChoices: optInChoices,
      optIn: true,
      reviewStatus: "reviewed"
    });
  }

  handleRadioButtonChange(event) {
    const value = event.target.value;
    if (value == "off") {
      this.setState({
        optInChoices: [false, false, false],
        optIn: false,
        reviewStatus: "reviewed"
      });
    } else {
      this.setState({
        optIn: true,
        reviewStatus: "reviewed"
      });
    }
  }

  handleSave() {
    if (this.state.reviewStatus != "reviewed") {
      alert("Sorry, you have not made any choice yet.");
      return;
    } else if (
      this.state.optIn &&
      !this.state.optInChoices[0] &&
      !this.state.optInChoices[1] &&
      !this.state.optInChoices[2]
    ) {
      alert("Sorry, you have not selected any opt-in checkbox.");
      return;
    }
    const url = `${conf.apiUrl}/users/updateoptin`;
    const optionObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: this.state.userId,
        choices: this.state.optInChoices
      })
    };
    ourFetch(url, true, optionObj).then(response => {
      alert(
        "Your opt-in choices have been successfully saved! You will now be redirected to the home page"
      );
      browserHistory.goBack();
    });
  }

  render() {
    return (
      <div>
        <header className="w3-container w3-indigo">
          <h2
            style={{
              fontSize: 20,
              lineHeight: 1.5,
              marginTop: 10,
              marginBottom: 10
            }}
            tabIndex="0"
          >
            MY PROFILE
          </h2>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          />
        </header>

        <main style={{ minHeight: 450 }}>
          <br></br>

          <div className="w3-row container">
            <p tabIndex="0">
              YouDescribe is now using an optional email notification system. In
              the form below, please select your desired notification options.
              These can be changed later in the My Profile tab, found in your
              user menu.
            </p>
            <Form.Check
              type="radio"
              checked={
                this.state.reviewStatus == "reviewed" && this.state.optIn
              }
              label="A. Yes I want to be notified by email when:"
              id="yes"
              name="optionchoices"
              value="on"
              onChange={event => this.handleRadioButtonChange(event)}
            ></Form.Check>
            <Form.Check
              style={{ marginLeft: 20 }}
              type="checkbox"
              checked={this.state.optInChoices[0]}
              name="optinchoices"
              label="My wishlist selection has been described and published"
              id="0"
              onChange={event => this.handleCheckBoxChange(event)}
            ></Form.Check>
            <Form.Check
              style={{ marginLeft: 20 }}
              type="checkbox"
              checked={this.state.optInChoices[1]}
              name="optinchoices"
              label="My audio description has been viewed"
              id="1"
              onChange={event => this.handleCheckBoxChange(event)}
            ></Form.Check>
            <Form.Check
              style={{ marginLeft: 20 }}
              type="checkbox"
              checked={this.state.optInChoices[2]}
              name="optinchoices"
              label="I wish to receive automated feedback on my published audio descriptions"
              id="2"
              onChange={event => this.handleCheckBoxChange(event)}
            ></Form.Check>
            <Form.Check
              style={{ marginLeft: 20 }}
              type="checkbox"
              checked={
                this.state.optInChoices[0] &&
                this.state.optInChoices[1] &&
                this.state.optInChoices[2]
              }
              label="I would like to receive all notifications"
              id="3"
              onChange={event => this.handleCheckBoxChange(event)}
            ></Form.Check>
            <br />
            <Form.Check
              type="radio"
              checked={
                this.state.reviewStatus == "reviewed" && !this.state.optIn
              }
              label="B. I do not want any automated notifications from YouDescribe."
              name="optin"
              value="off"
              id="no"
              onChange={event => this.handleRadioButtonChange(event)}
            ></Form.Check>
            <br />
            <b tabIndex="0">
              If you feel you are bothered by too many emails, you may opt out
              AT ANY TIME.
            </b>
          </div>
          <div style={{ marginTop: 20, marginBottom: 20, textAlign: "center" }}>
            <Button
              type="submit"
              style={{ marginTop: 20, marginBottom: 20 }}
              variant="outline-success"
              onClick={this.handleSave}
            >
              Save
            </Button>
          </div>
        </main>
      </div>
    );
  }
}

export default Profile;
