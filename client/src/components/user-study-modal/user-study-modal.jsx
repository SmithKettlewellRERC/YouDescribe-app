import React, { Component } from "react";
import { ButtonToolbar, Button, FormControl, Table } from "react-bootstrap";
import {
  ourFetch,
  convertTimeToCardFormat,
  convertViewsToCardFormat
} from "../../shared/helperFunctions";
import { Jumbotron, Form } from "react-bootstrap";
import Modal from "react-modal";
import { browserHistory, Router, useHistory } from "react-router";

const conf = require("../../shared/config")();

class UserStudyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optIn: false,
      choice: 0,
      reviewStatus: ""
    };

    this.handleRadioButtonChange = this.handleRadioButtonChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
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

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleRadioButtonChange(event) {
    const value = event.target.value;

    this.setState({
      choice: value
    });
  }

  handleSave() {
    if (this.state.choice == 1 || this.state.choice == 2) {
      alert("Thank you. You will be redirected to a consent form.");
      this.props.history.push("/path");
    }
  }

  render() {
    return (
      <div>
        <Jumbotron>
          <h1>
            Attention: Are you interested in participating in a paid user study
            for AI descriptions?
          </h1>

          <Button onClick={this.handleOpenModal} style={{ margin: "10   px" }}>
            Click the here for more information.
          </Button>
        </Jumbotron>
        <Modal shouldCloseOnOverlayClick isOpen={this.state.showModal}>
          <Button variant="outline-primary" onClick={this.handleCloseModal}>
            X
          </Button>
          <h1 tabIndex="0">
            Please answer the following question: How do you typically navigate
            information on a computer or smartphone?
          </h1>

          <Form.Check
            type="radio"
            tabIndex="0"
            checked={this.state.choice == 1}
            label=" A. With magnification"
            id="yes"
            name="optionchoices"
            value="1"
            onChange={event => this.handleRadioButtonChange(event)}
          ></Form.Check>
          <br></br>
          <Form.Check
            type="radio"
            tabIndex="0"
            checked={this.state.choice == 2}
            label=" B. With a screenreader "
            name="optinchoices"
            value="2"
            id="no"
            onChange={event => this.handleRadioButtonChange(event)}
          ></Form.Check>
          <br />
          <Form.Check
            type="radio"
            tabIndex="0"
            checked={this.state.choice == 3}
            label=" C. With a mouse or standard gestures  "
            name="optinchoices"
            value="3"
            id="no"
            onChange={event => this.handleRadioButtonChange(event)}
          ></Form.Check>

          <div style={{ marginTop: 20, marginBottom: 20, textAlign: "center" }}>
            <Button
              type="submit"
              style={{ marginTop: 20, marginBottom: 20 }}
              variant="outline-success"
              onClick={this.handleSave}
            >
              Submit
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default UserStudyModal;
