import React from 'react';
import ReactDOM from 'react-dom';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';

import App from './components/App.jsx';
import Home from './components/Home.jsx';
import Video from './components/Video.jsx';
import NotFound from './components/NotFound.jsx';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path='/' component={App} >
      <IndexRoute component={Home} />
      <Route path="video" component={Video} />
      <Route path='life' component={NotFound} />
    </Route>
  </Router>
), document.getElementById('main-container'));

