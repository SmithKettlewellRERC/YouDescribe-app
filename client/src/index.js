import React from 'react';
import ReactDOM from 'react-dom';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';
import styles from './main.scss';

import App from './containers/app/App.jsx';
import Home from './containers/home/Home.jsx';
import SearchPage from './containers/search-page/SearchPage.jsx';
import AuthoringTool from './containers/authoring-tool/AuthoringTool.jsx';
import VideoPage from './containers/video-page/VideoPage.jsx';
import NotFound from './containers/not-found/NotFound.jsx';
import WishList from './containers/wish-list/WishList.jsx';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/authoring-tool/:videoId" component={AuthoringTool} />
      <Route path="/search" component={SearchPage} />
      <Route path="/video/:videoId" component={VideoPage} />
      <Route path="/wishlist" component={WishList} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
), document.getElementById('app'));
