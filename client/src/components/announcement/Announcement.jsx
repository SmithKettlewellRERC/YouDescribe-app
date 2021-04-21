import React, { Component } from "react";
import { Jumbotron, Form } from "react-bootstrap";

const Announcement = (props) => {
  return (
    <div className="announcement-text" role="banner">
      <Jumbotron>
        <h1 tabIndex="0">{props.text}</h1>
      </Jumbotron>
    </div>
  );
};

export default Announcement;
