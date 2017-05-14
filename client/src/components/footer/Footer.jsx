import React from 'react';
import { Link } from 'react-router';

const getYear = () => {
  const date = new Date();
  return date.getFullYear();
}

const Footer = () => (
  <footer className="w3-center w3-indigo w3-padding-32">
    <h5>
      YouDescribe is a project of <a href="http://www.ski.org" title="External link">The Smith-Kettlewell Eye Research Institute</a>.
    </h5>
    <div>
      <Link to="/credits" className="footer-links">Credits</Link>
      <Link to="/contact" className="footer-links">Contact Us</Link>
      <Link to="/support" className="footer-links">Support</Link>
    </div>
    <h6>
      Copyright © {getYear()}, The Smith-Kettlewell Eye Research Institute, All rights reserved.
    </h6>
  </footer>
);

export default Footer;
