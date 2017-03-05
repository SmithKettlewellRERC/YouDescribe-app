import React, { Component } from 'react';
import { IndexLink, Link } from 'react-router';

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <footer className="w3-center w3-indigo w3-padding-32">
        <p>
          YouDescribe is a project of <u>The Smith-Kettlewell Video Description Research and Development Center</u>.<br />
        Funding provided by the <u>U.S. Department of Education, OSEP</u> (disclaimer).
        </p>
        <p>Copyright © 2017, All rights reserved.</p>
      </footer>
    )
  }
};

export default Footer;
