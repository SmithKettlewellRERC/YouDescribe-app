import React from 'react';
import Button from '../button/Button.jsx';
import { browserHistory } from 'react-router';

const ShareBar = (props) => {
  return (
    <div className="ssk-sticky ssk-left ssk-center ssk-lg">
        <a href="" className="ssk ssk-facebook" title="Share this video on Facebook"></a>
        <a href="" className="ssk ssk-twitter" title="Share this video on Twitter"></a>
        <a href="" className="ssk ssk-email" title="Share this video by e-mail"></a>
    </div>
  );
};

export default ShareBar;
