import React, { Component } from 'react';
import Navbar from '../../components/navbar/Navbar.jsx';
import NavbarMaterial from '../../components/navbar/Navbar(material).jsx';
import Footer from '../../components/footer/Footer.jsx';
import { browserHistory } from 'react-router';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorTimerValue: 0,
      fetchJSONtoSearchPage: [],
    };

    // Global methods.
    this.getState = this.getState.bind(this);
    this.getVideoProgress = this.getVideoProgress.bind(this);
  }

  getState() {
    return this.state;
  }

  getVideoProgress(currentVideoProgress) {
    // if (this.state.editorTimerValue !== currentVideoProgress) {
    //   this.setState({ editorTimerValue: currentVideoProgress });
    // }
  }

  setActiveVideoIdAuthoringTool(videoId) {
    this.setState({ activeVideoIdAuthoringTool: videoId });
  }

  // use algorithm to seperate
  letFetch(searchValue) {
    console.log('fetching the data to the state')
    const q = encodeURIComponent(searchValue);
    const serverVideoIds = [];
    let ids;
    let dbResponse;
    let videoFromYDdatabase = [];
    const videoFoundOnYTIds = [];
    let videoFromYoutube = [];
    let idsYTvideo;

      fetch(`http://webng.io:8080/v1/videos/search?q=${q}`)
      .then(response => response.json())
      .then((response) => {
        dbResponse = response.result;
        for (let i = 0; i < dbResponse.length; i += 1) {
          serverVideoIds.push(dbResponse[i]._id);
        }
        ids = serverVideoIds.join(',');
      })
      .then(() => {
        // ids = 'poq6AoHn4HM,poq6AoHn4HM,poq6AoHn4HM,poq6AoHn4HM,poq6AoHn4HM,poq6AoHn4HM';
        const urlfForYT = `https://www.googleapis.com/youtube/v3/videos?id=${ids}&part=snippet,statistics&key=AIzaSyCG7xsho1pmQavWYYglY9E2VILAnOGsZls`;
        fetch(urlfForYT)
        .then(response => response.json())
        .then((videoDataFromYDdatabase) => {
          videoFromYDdatabase = videoDataFromYDdatabase.items;

          // replace data in the state with new data,
          // use ( and dont use) callback for next fetch
          const fetchData = this.state.fetchJSONtoSearchPage.slice();
          fetchData[0] = dbResponse;
          fetchData[1] = videoFromYDdatabase;
          fetchData[2] = [];
          // console.log(fetchData);
          this.setState({
            fetchJSONtoSearchPage: fetchData,
          }, () => {
            browserHistory.push('/search');
            // console.log('video from YD: ', videoFromYDdatabase);
            const urlForYD = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&maxResults=50&key=AIzaSyCG7xsho1pmQavWYYglY9E2VILAnOGsZls`;
            fetch(urlForYD)
            .then(response => response.json())
            .then((videos) => {
              for (let i = 0; i < videos.items.length; i += 1) {
                const temp = videos.items[i].id.videoId;
                if (!(ids.indexOf(temp) > -1)) {
                  videoFoundOnYTIds.push(videos.items[i].id.videoId);
                }
              }
              idsYTvideo = videoFoundOnYTIds.join(',');
            })
            .then(() => {
              const urlForYT = `https://www.googleapis.com/youtube/v3/videos?id=${idsYTvideo}&part=snippet,statistics&key=AIzaSyCG7xsho1pmQavWYYglY9E2VILAnOGsZls`;
              fetch(urlForYT)
                .then(response => response.json())
                .then((videoFromYoutubes) => {
                  videoFromYoutube = videoFromYoutubes.items;
                  let fetchData = this.state.fetchJSONtoSearchPage.slice();
                  fetchData[2] = videoFromYoutube;

                  console.log(fetchData);

                  this.setState({
                    fetchJSONtoSearchPage: fetchData,
                  }, () => {
                    browserHistory.push('/search');
                    // console.log('video from YT: ', videoFromYoutube);
                  });
                });
            });
          });
        });
      });
  }

  render() {
    return (
      <div>
        <Navbar updateSearch={searchValue => this.letFetch(searchValue)} />
        {React.cloneElement(this.props.children, {
          getState: this.getState,
          getVideoProgress: this.getVideoProgress,
        })}
        <Footer />
      </div>
    );
  }
}

export default App;
