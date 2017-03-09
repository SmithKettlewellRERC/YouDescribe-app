import React, { Component } from 'react';
import Navbar from '../../components/navbar/Navbar.jsx';
import NavbarMaterial from '../../components/navbar/Navbar(material).jsx';
import Footer from '../../components/footer/Footer.jsx';
import Track from '../../components/track/Track.jsx';
import { browserHistory } from 'react-router';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tracks: [],
      trackCount: 0,

      // search: '',
      data: [],
    };

    this.getState = this.getState.bind(this);
    this.publishClick = this.publishClick.bind(this);
    this.addInlineClick = this.addInlineClick.bind(this);
    this.addExtendedClick = this.addExtendedClick.bind(this);
    this.actionClick = this.actionClick.bind(this);
  }

  getState() {
    return this.state;
  }

  publishClick() {
    alert('published');
  }

  addInlineClick() {
    const tracks = this.state.tracks.slice();
    tracks.push(<Track color="w3-yellow" text="I" id={this.state.trackCount} actionClick={this.actionClick} />);
    this.setState({ tracks, trackCount: this.state.trackCount + 1 });
  }

  addExtendedClick() {
    const tracks = this.state.tracks.slice();
    tracks.push(<Track color="w3-purple" text="E" id={this.state.trackCount} actionClick={this.actionClick} />);
    this.setState({ tracks, trackCount: this.state.trackCount + 1 });
  }

  actionClick(e) {
    const tracks = this.state.tracks.slice();
    if (e.target.className === 'fa fa-circle') {
      e.target.className = 'fa fa-stop';
    } else if (e.target.className === 'fa fa-stop') {
      e.target.className = 'fa fa-step-forward';
    }
  }

  // updateSearch(searchValue) {
  //   // this.setState({
  //   //   search: searchValue,
  //   // })
  //   console.log('search value is: ', searchValue)
  // }

  letFetch(searchValue){
      console.log('fetching the data to the state')
      let q = encodeURIComponent(searchValue);
      const serverVideoIds = [];
      let ids;
      let dbResponse;

      fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&maxResults=50&key=AIzaSyCG7xsho1pmQavWYYglY9E2VILAnOGsZls`)
      .then(response => response.json())
      .then((response) => {
        dbResponse = response.items;
        for (let i = 0; i < dbResponse.length; i += 1) {
          serverVideoIds.push(dbResponse[i].id.videoId);
        }
        ids = serverVideoIds.join(',');
      })
      .then(() => {
        // ids = 'poq6AoHn4HM,poq6AoHn4HM,poq6AoHn4HM,poq6AoHn4HM,poq6AoHn4HM,poq6AoHn4HM';
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${ids}&part=snippet,statistics&key=AIzaSyCG7xsho1pmQavWYYglY9E2VILAnOGsZls`;
        fetch(url)
        .then(response => response.json())
        .then((data) => {
          this.setState({
            data: [dbResponse, data],
          }, () => {
            browserHistory.push('/search');
          });
        });
      });
  }

  render() {
    
    return (
      <div>
        <Navbar updateSearch={(searchValue) => this.letFetch(searchValue)}
        />
        {React.cloneElement(this.props.children, {
          state: this.state,
          updateState: this.updateState,
          getState: this.getState,
          publishClick: this.publishClick,
          addInlineClick: this.addInlineClick,
          addExtendedClick: this.addExtendedClick,
          actionClick: this.actionClick,
        })}
        <Footer />
      </div>
    );
  }
}

export default App;
