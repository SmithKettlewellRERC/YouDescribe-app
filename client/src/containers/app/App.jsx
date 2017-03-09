import React, { Component } from 'react';
import Navbar from '../../components/navbar/Navbar.jsx';
import NavbarMaterial from '../../components/navbar/Navbar(material).jsx';
import Footer from '../../components/footer/Footer.jsx';
import Track from '../../components/track/Track.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tracks: [],
      trackCount: 0,
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

  render() {
    return (
      <div>
        <Navbar />
        {React.cloneElement(this.props.children, {
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
