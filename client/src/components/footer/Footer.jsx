import React, { Component } from 'react';
import { IndexLink, Link } from 'react-router';

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <footer className="w3-center w3-indigo w3-padding-32">
        <h5>
          YouDescribe is a project of <u>The Smith-Kettlewell Video Description
          Research and Development Center</u>.<br />
          Funding provided by the <u>U.S. Department of Education, OSEP</u> (disclaimer).
        </h5>
        <h6>Copyright © 2017, All rights reserved.</h6>
      </footer>
    );
  }
}

export default Footer;
