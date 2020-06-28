import React, { Component } from "react";
import { ButtonToolbar, Button, FormControl, Form, Table } from "react-bootstrap";
import { ourFetch, convertTimeToCardFormat, convertViewsToCardFormat } from "../../shared/helperFunctions";

const conf = require("../../shared/config")();

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optInChoices: [false, false, false],
      optIn: false,
      reviewStatus: "",
      userId: this.props.params.userId,
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
    const url = (`${conf.apiUrl}/users/${this.state.userId}`);
    ourFetch(url).then((response) => {
      const user = response.result;
      const optInChoices = [false, false, false];
      user.opt_in.forEach(index => {
        optInChoices[index] = true;
      });
      this.setState({
        optInChoices: optInChoices,
        optIn: (user.opt_in.length > 0) ? true : false,
        reviewStatus: user.policy_review,
      });
    });
  }

  handleCheckBoxChange(event) {
    let optInChoices = this.state.optInChoices;
    const index = event.target.id;
    if (index == 3) {
      optInChoices = event.target.checked ? [true, true, true] : [false, false, false];
    } else {
      optInChoices[index] = event.target.checked;
    }
    this.setState({
      optInChoices: optInChoices,
      optIn: true,
      reviewStatus: "reviewed",
    });
  }

  handleRadioButtonChange(event) {
    const value = event.target.value;
    if (value == "off") {
      this.setState({
        optInChoices: [false, false, false],
        optIn: false,
        reviewStatus: "reviewed",
      });
    } else {
      this.setState({
        optIn: true,
        reviewStatus: "reviewed",
      });
    }
  }

  handleSave() {
    if (this.state.reviewStatus != "reviewed") {
      alert("Sorry, you have not made any choice yet.");
      return;
    } else if (this.state.optIn && !this.state.optInChoices[0] && !this.state.optInChoices[1] && !this.state.optInChoices[2]) {
      alert("Sorry, you have not selected any opt-in checkbox.");
      return;
    }
    const url = `${conf.apiUrl}/users/updateoptin`;
    const optionObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: this.state.userId,
        choices: this.state.optInChoices,
      }),
    };
    ourFetch(url, true, optionObj).then((response) => {
      alert("Your opt-in choices have been successfully saved!");
    });
  }

  render() {
    return (
      <div>
        <header className="w3-container w3-indigo">
          <h2 style={{fontSize: 20, lineHeight: 1.5, marginTop: 10, marginBottom: 10}}>MY PROFILE</h2>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"/>
        </header>
        
        <main style={{minHeight: 450}}>
          <div className="w3-row container">
            <div style={{marginTop: 20, marginBottom: 20, textAlign: "center"}}>
              <h2>Data Policy For YouDescribe</h2>
            </div>
            <div style={{marginLeft: 50, marginRight: 50}}>
              Dear YouDescribe Community Member!
              <br/><br/>
              Updates for the California Consumer Privacy Act (CCPA)
              <br/><br/>
              At YouDescribe, we're committed to open, transparent communication that puts our people first. As we continue to expand YouDescribe’s functionality, 
              we've also updated our Privacy Policy, and we’re writing to make sure you know of the change. 
              <br/><br/>
              We made these changes with two priorities in mind:
              <br/>
              &emsp;&emsp;More Transparency: We've added additional information about the data we collect, why and how we use it, and how we may share it.
              <br/>
              &emsp;&emsp;More Choices: We've added information about new methods to exercise control over your personal information.
              <br/><br/>
              We encourage you to view our Privacy Policy in full. Thank you for being a valued YouDescribe Community Member!
              <br/><br/>
              When you log into YouDescribe you will be asked to choose the amount of engagement you want. While some portions are mandatory for you to use the tool 
              (like permission for us to contact you by email), some are optional (like the creation of a User Profile, and notifications about your videos 
              being described, viewed, or rated), and you will be able to opt in and out as desired.
              <br/><br/>
              What will YouDescribe do? 
              <br/><br/>
              Welcome! We are rolling out some new and needed features in the next few months. To that end, we are changing some login procedures, 
              updating our privacy policy, and asking you to choose your level of engagement.
              <br/><br/>
              When you sign in with your google ID you will be asked to create a user profile. Currently your user profile IS you google ID. 
              Creating a profile allows you an extra level of online safety and privacy. You can keep using your google ID and picture, 
              OR come up with a unique profile name and avatar. In the future, logged in members of the community will be able to search by user (to 
              more quickly find videos an individual has requested, and to find videos described by a particular community member).
              <br/><br/>
              Because we would like to be able to give you feedback about videos, we are asking for permission for an admin to contact you by email. 
              While you still can view videos without signing in, to place items on the wishlist, or to describe videos, you will need to give us 
              permission to contact you. Don’t worry, we will never give your email to a third party, and it will be only used to contact you 
              if it is important. No other YouDescribe users will be able to email you.
              <br/><br/>
              <Form.Check
                type="radio"
                checked={this.state.reviewStatus == "reviewed" && this.state.optIn}
                label="A. Yes I want to be notified by email when:"
                name="optin"
                value="on"
                onChange={(event) => this.handleRadioButtonChange(event)}
              >
              </Form.Check>
              <Form.Check
                style={{marginLeft: 20}}
                type="checkbox"
                checked={this.state.optInChoices[0]}
                name="optinchoices"
                label="My wishlist selection has been described and published"
                id="0"
                onChange={(event) => this.handleCheckBoxChange(event)}
              >
              </Form.Check>
              <Form.Check
                style={{marginLeft: 20}}
                type="checkbox"
                checked={this.state.optInChoices[1]}
                name="optinchoices"
                label="My audio description has been viewed"
                id="1"
                onChange={(event) => this.handleCheckBoxChange(event)}
              >
              </Form.Check>
              <Form.Check
                style={{marginLeft: 20}}
                type="checkbox"
                checked={this.state.optInChoices[2]}
                name="optinchoices"
                label="I wish to receive automated feedback on my published audio descriptions"
                id="2"
                onChange={(event) => this.handleCheckBoxChange(event)}
              >
              </Form.Check>
              <Form.Check
                style={{marginLeft: 20}}
                type="checkbox"
                checked={this.state.optInChoices[0] && this.state.optInChoices[1] && this.state.optInChoices[2]}
                label="All notifications please" id="3" onChange={(event) => this.handleCheckBoxChange(event)}
              >
              </Form.Check>
              <br/>
              <Form.Check
                type="radio"
                checked={this.state.reviewStatus == "reviewed" && !this.state.optIn}
                label="B. I do not want any automated notifications from YouDescribe."
                name="optin"
                value="off"
                onChange={(event) => this.handleRadioButtonChange(event)}
              >
              </Form.Check>
              <br/>
              <b>If you feel you are bothered by too many emails, you may opt out AT ANY TIME :-)</b>
            </div>
            <div style={{marginTop: 20, marginBottom: 20, textAlign: "center"}}>
              <Button type="submit" style={{marginTop: 20, marginBottom: 20}} variant="outline-success" onClick={this.handleSave}>Save</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default Profile;
