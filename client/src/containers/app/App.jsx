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
      data: [],
    };

    this.getState = this.getState.bind(this);
    this.publishVideo = this.publishVideo.bind(this);
    this.addAudioClipTrack = this.addAudioClipTrack.bind(this);
    this.recordAudioClip = this.recordAudioClip.bind(this);
  }

  getState() {
    return this.state;
  }

  publishVideo() {
    alert('published');
  }

  addAudioClipTrack(type, color) {
    const newTrackId = this.state.trackCount + 1;
    const tracks = this.state.tracks.slice();
    tracks.push(<Track key={newTrackId} color={'w3-' + color} text={type} id={this.state.trackCount} recordAudioClip={this.recordAudioClip} />);
    this.setState({ tracks, trackCount: newTrackId });
  }

  recordAudioClip(e) {
    const tracks = this.state.tracks.slice();
    if (e.target.className === 'fa fa-circle') {
      console.log('Start recording');
      startRecording();
      e.target.className = 'fa fa-stop';
    } else if (e.target.className === 'fa fa-stop') {
      console.log('Stop recording');
      stopRecording();
      e.target.className = 'fa fa-step-forward';
    } else {
      console.log('Just play');
    }
  }


  

  //search video on youtube
  // letFetch(searchValue){
  //     console.log('fetching the data to the state')
  //     let q = encodeURIComponent(searchValue);
  //     const serverVideoIds = [];
  //     let ids;
  //     let dbResponse;

  //     fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&maxResults=50&key=AIzaSyCG7xsho1pmQavWYYglY9E2VILAnOGsZls`)
  //     .then(response => response.json())
  //     .then((response) => {
  //       dbResponse = response.items;
  //       for (let i = 0; i < dbResponse.length; i += 1) {
  //         serverVideoIds.push(dbResponse[i].id.videoId);
  //       }
  //       ids = serverVideoIds.join(',');
  //     })
  //     .then(() => {
  //       // ids = 'poq6AoHn4HM,poq6AoHn4HM,poq6AoHn4HM,poq6AoHn4HM,poq6AoHn4HM,poq6AoHn4HM';
  //       const url = `https://www.googleapis.com/youtube/v3/videos?id=${ids}&part=snippet,statistics&key=AIzaSyCG7xsho1pmQavWYYglY9E2VILAnOGsZls`;
  //       fetch(url)
  //       .then(response => response.json())
  //       .then((data) => {
  //         this.setState({
  //           data: [dbResponse, data],
  //         }, () => {
  //           browserHistory.push('/search');
  //         });
  //       });
  //     });
  // }

  //fetch to youtube querry to get the video



  //fetch to YD database to get the video in that database



  //use algorithm to seperate 
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
            console.log('fetching to children: ', this.state.data)
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
          publishVideo: this.publishVideo,
          addAudioClipTrack: this.addAudioClipTrack,
          recordAudioClip: this.recordAudioClip,
        })}
        <Footer />
      </div>
    );
  }
}

export default App;
