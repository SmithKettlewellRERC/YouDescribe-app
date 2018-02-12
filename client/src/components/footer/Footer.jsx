import React from 'react';
import { Link } from 'react-router';
import path from 'path';

const getYear = () => {
  const date = new Date();
  return date.getFullYear();
}

const Footer = (props) => (
  <footer className="w3-center w3-indigo w3-padding-32">
    <div>
      <a href="https://itunes.apple.com/app/id1177344886">
        <img
          alt="YouDescribe is also available for iphone at Itunes Store"
          src={path.join(__dirname, 'assets', 'img', 'logo-apple-store.jpg')}
        />
      </a>
    </div>
    <h5>
      {props.translate('YouDescribe is a project of')} <a href="http://www.ski.org" title="External link">The Smith-Kettlewell Eye Research Institute</a>.
    </h5>
    <div>
      <Link to="/credits" className="footer-links">{props.translate('Credits')}</Link>
      <Link to="/contact" className="footer-links">{props.translate('Contact Us')}</Link>
      <Link to="/support" className="footer-links">{props.translate('Support')}</Link>
    </div>
    <h6>
      Copyright © {getYear()}, The Smith-Kettlewell Eye Research Institute, {props.translate('All rights reserved')}.
    </h6>
  </footer>
);

export default Footer;
