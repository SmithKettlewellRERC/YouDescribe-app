import React from 'react';
import { Link } from 'react-router';

import SupportNav from './SupportNav.jsx';

const Support = (props) => (
  <div id="support" tabIndex="-1">

    <header role="banner" className="w3-container w3-indigo">
      <h2>Help and Support page</h2>
    </header>

    <main className="w3-row">
      <h2>Welcome to the YouDescribe Help and Support page.</h2>
      
      <p>We have many resources here for you.</p>

      <SupportNav translate={props.translate} />

      <p>If you cannot find an answer to your question, please email <a href="mailto: info@youdescribe.org">info@youdescribe.org</a></p>

    </main>
  </div>
);

export default Support;
