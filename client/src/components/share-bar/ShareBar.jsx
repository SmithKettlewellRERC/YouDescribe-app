import React, { Component } from 'react';
import Button from '../button/Button.jsx';
import { browserHistory } from 'react-router';

class ShareBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const twitterText = `Check out ${this.props.videoTitle.substring(0,50)} w/ #AudioDescription on YouDescribe ${window.location.href} #a11y @SKERI_YD`;

    const emailText = `Watch this video with audio description on YouDescribe:\n\n${this.props.videoTitle}\n${window.location.href}\n\nTo learn more about accessible video with audio description,\nfollow YouDescribe on Twitter or Facebook:\n\nhttp://twitter.com/SKERI_YD\nhttp://facebook.com/YouDescribe`;

    return (<div className="ssk-sticky ssk-left ssk-center ssk-lg" style={{ position: 'relative' }}>
        <a href="#" className="ssk ssk-facebook" aria-label="Share this video on Facebook"></a>
        <a href="#" className="ssk ssk-twitter" aria-label="Share this video on Twitter" data-text={twitterText}></a>
        <a href="#" className="ssk ssk-email" aria-label="Share this video by e-mail" data-text={emailText}></a>
    </div>);
  };
};

export default ShareBar;
