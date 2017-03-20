import React from 'react';
import { Link } from 'react-router';

const Footer = () => (
  <footer className="w3-center w3-indigo w3-padding-32">
    <h5>
      YouDescribe is a project of <a href="http://www.vdrdc.org/">The Smith-Kettlewell Video Description
      Research and Development Center</a>.<br />
    Funding provided by the <a href="https://www2.ed.gov/about/offices/list/osers/osep/index.html" >U.S. Department of Education, OSEP</a>&nbsp;
    (<Link to="/disclaimer" title="YouDescribe logo">disclaimer</Link>).
    </h5>
    <h6>Copyright © 2017, All rights reserved.</h6>
  </footer>
);

export default Footer;
