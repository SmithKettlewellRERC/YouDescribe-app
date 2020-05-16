import React, { Component } from "react";
import { Navbar, Nav, NavDropdown, Button, FormControl, Form } from "react-bootstrap";
import { ourFetch } from "../../shared/helperFunctions";

const conf = require("../../shared/config")();

class Signin extends Component {
  constructor(props) {
    super(props);
  }

  handleSignIn (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const url = `${conf.apiUrl}/admins/signin`;
    const optionObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    };
    ourFetch(url, true, optionObj).then((response) => {
      if (response.code == 1022) {
        window.localStorage.setItem("adminToken", response.adminToken);
        window.localStorage.setItem("adminLevel", response.adminLevel);
        window.location.href = "/admin";
      } else {
        alert("Sorry, the username or password is not valid.");
      }
    });
  }

  render() {
    return (
      <div style={{height: '60vh', margin: 200}}>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"/>
        <Form method="POST">
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" id="username" name="username" placeholder="Enter username..." className="mr-sm-2" required/>
            <Form.Text className="text-muted">
              {/* We'll never share your email with anyone else. */}
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" id="password" name="password" placeholder="Enter password..." required/>
          </Form.Group>
          <Button variant="primary" type="submit" onClick={this.handleSignIn}>
            Sign In
          </Button>
        </Form>
      </div>
    );
  }
};

export default Signin;