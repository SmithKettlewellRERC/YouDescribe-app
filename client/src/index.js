import React from "react";
import ReactDOM from "react-dom";
import { Router, IndexRoute, Route, browserHistory } from "react-router";
import { withRouter } from "react-router-dom";
import styles from "./main.scss";

// regular user
import App from "./containers/app/App.jsx";
import Home from "./containers/home/Home.jsx";
import SearchPage from "./containers/search-page/SearchPage.jsx";
import AuthoringTool from "./containers/authoring-tool/AuthoringTool.jsx";
import VideoPage from "./containers/video-page/VideoPage.jsx";
import NotFound from "./containers/not-found/NotFound.jsx";
import WishList from "./containers/wish-list/WishList.jsx";
import UserVideosPage from "./containers/user-videos-page/UserVideosPage.jsx";
import Profile from "./containers/profile/Profile.jsx";
import Credits from "./containers/credits/Credits.jsx";
import CreditsPage from "./containers/credits/CreditsPage.jsx";
import Contact from "./containers/contact/Contact.jsx";
import Support from "./containers/support/Support.jsx";
import About from "./containers/support/About.jsx";
import Describers from "./containers/support/Describers.jsx";
import Tutorial from "./containers/support/Tutorial.jsx";
import Viewers from "./containers/support/Viewers.jsx";
import Privacy from "./containers/support/Privacy.jsx";
import UnsupportedBrowser from "./containers/unsupported-browser/UnsupportedBrowser.jsx";

// video indexer
import VideoIndexerMerge from "./containers/video-indexer/VideoIndexerMerge.jsx";
import VideoIndexerDescription from "./containers/video-indexer/VideoIndexerDescription.jsx";
import Waitlist from "./containers/video-indexer/Waitlist.jsx";

// admin user
import Descriptions from "./containers/admin/Descriptions.jsx";
import DescriptionDetail from "./containers/admin/DescriptionDetail.jsx";
import Videos from "./containers/admin/Videos.jsx";
import VideoDetail from "./containers/admin/VideoDetail.jsx";
import Signin from "./containers/admin/Signin.jsx";

// statistics
import AudioClipsOfDescriptions from "./containers/statistics/AudioClipsOfDescriptions.jsx";
import TimeLengthOfAudioClips from "./containers/statistics/TimeLengthOfAudioClips.jsx";
import WordCountOfAudioClips from "./containers/statistics/WordCountOfAudioClips.jsx";
import WordCloudOfAudioClips from "./containers/statistics/WordCloudOfAudioClips.jsx";
import SummaryOfDataRecords from "./containers/statistics/SummaryOfDataRecords.jsx";
import CategoriesOfVideos from "./containers/statistics/CategoriesOfVideos.jsx";
import TagsOfVideos from "./containers/statistics/TagsOfVideos.jsx";
import SummaryOfTimeRange from "./containers/statistics/SummaryOfTimeRange.jsx";
import DailyCountOfDataRecords from "./containers/statistics/DailyCountOfDataRecords.jsx";

//Google Analytics
import ReactGA from "react-ga";
import { createBrowserHistory } from "history";
const history = createBrowserHistory();
//const trackingId = "UA-171142756-3"; //live site key
const trackingId = "UA-174046676-1"; //dev key
ReactGA.initialize(trackingId);

history.listen(location => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

ReactDOM.render(
  <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
    <Route path="/" component={App}>
      // website
      <IndexRoute component={Home} />
      <Route path="/authoring-tool/:videoId" component={AuthoringTool} />
      <Route path="/search" component={SearchPage} />
      <Route path="/video/:videoId" component={VideoPage} />
      <Route path="/wishlist" component={WishList} />
      <Route path="/videos/user/:userId" component={UserVideosPage} />
      <Route path="/profile/:userId" component={Profile} />
      <Route path="/credits" component={Credits} />
      <Route path="/creditspage" component={CreditsPage} />
      <Route path="/contact" component={Contact} />
      <Route path="/support" component={Support} />
      <Route path="/support/about" component={About} />
      <Route path="/support/describers" component={Describers} />
      <Route path="/support/tutorial" component={Tutorial} />
      <Route path="/support/viewers" component={Viewers} />
      <Route path="/support/privacy" component={Privacy} />
      <Route path="/unsupported-browser" component={UnsupportedBrowser} />
      // Video Indexer
      <Route path="/video-indexer-merge" component={VideoIndexerMerge} />
      <Route
        path="/video-indexer-description"
        component={VideoIndexerDescription}
      />
      <Route path="/waitlist" component={Waitlist} />
      // admin panel
      <Route path="/admin" component={Videos} />
      <Route path="/admin/signin" component={Signin} />
      <Route path="/admin/descriptions" component={Descriptions} />
      <Route path="/admin/descriptions/search" component={Descriptions} />
      <Route
        path="/admin/description/detail/:id"
        component={DescriptionDetail}
      />
      <Route path="/admin/videos" component={Videos} />
      <Route path="/admin/videos/search" component={Videos} />
      <Route path="/admin/video/detail/:id" component={VideoDetail} />
      // statistics
      <Route
        path="/statistics/audioclipsofdescriptions"
        component={AudioClipsOfDescriptions}
      />
      <Route
        path="/statistics/timelengthofaudioclips"
        component={TimeLengthOfAudioClips}
      />
      <Route
        path="/statistics/wordcountofaudioclips"
        component={WordCountOfAudioClips}
      />
      <Route
        path="/statistics/wordcloudofaudioclips"
        component={WordCloudOfAudioClips}
      />
      <Route
        path="/statistics/summaryofdatarecords"
        component={SummaryOfDataRecords}
      />
      <Route
        path="/statistics/categoriesofvideos"
        component={CategoriesOfVideos}
      />
      <Route
        path="/statistics/summaryoftimerange"
        component={SummaryOfTimeRange}
      />
      <Route path="/statistics/tagsofvideos" component={TagsOfVideos} />
      <Route
        path="/statistics/dailycountofdatarecords"
        component={DailyCountOfDataRecords}
      />
      // misc (error) pages
      <Route path="*" component={NotFound} />
    </Route>
  </Router>,
  document.getElementById("app")
);
