import React, { Component } from 'react';
import Navbar from '../../components/navbar/Navbar.jsx';
import NavbarMaterial from '../../components/navbar/Navbar(material).jsx';
import Footer from '../../components/footer/Footer.jsx';
import { browserHistory } from 'react-router';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // search: '',
      data: [],
    };

    this.updateState = this.updateState.bind(this);
    this.getState = this.getState.bind(this);
  }

  getState() {
    return this.state;
  }

  updateState(stateObj) {
    this.setState(stateObj);
  }

  componentDidMount() {
    // console.log('componentDidMount');
  }

  updateSearch(searchValue) {
    // this.setState({
    //   search: searchValue,
    // })
    this.search = searchValue;
  }

  letFetch(){
      console.log('fetching the data to the state')
      let q = encodeURIComponent('bruce lee');
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
            

          // console.log('going to search now')
          // console.log(this.state.data)
        });
      });
  }

  render() {
    
    return (
      <div>
        <Navbar updateSearch={(searchValue) => this.updateSearch(searchValue)}
                clickHandler={() => this.letFetch()}
        />
        {React.cloneElement(this.props.children, {
          search: this.search,
          state: this.state,
          updateState: this.updateState,
          getState: this.getState,
        })}
        <Footer />
      </div>
    );
  }
}

export default App;
