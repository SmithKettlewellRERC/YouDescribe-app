import React from 'react';
import { Link } from 'react-router';

const getYear = () => {
  const date = new Date();
  return date.getFullYear();
}

const Footer = (props) => (
  <footer className="w3-center w3-indigo w3-padding-32">
    <h5>
      {props.translate('YouDescribe is a project of')} <a href="http://www.ski.org" title="External link">The Smith-Kettlewell Eye Research Institute</a>.
    </h5>
    <div>
      <Link to="/credits" className="footer-links">{props.translate('Credits')}</Link>
      <Link to="/contact" className="footer-links">{props.translate('Contact Us')}</Link>
      <Link to="/faq" className="footer-links">{props.translate('Support')}</Link>
      <Link to="/faq" className="footer-links">FAQ</Link>
    </div>
    <h6>
      Copyright © {getYear()}, The Smith-Kettlewell Eye Research Institute, {props.translate('All rights reserved')}.
    </h6>
  </footer>
);

export default Footer;
