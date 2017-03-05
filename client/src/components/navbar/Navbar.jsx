import React, { Component } from 'react';
import { IndexLink, Link } from 'react-router';
import path from 'path';

// import SearchBar from '../search-bar/SearchBar.jsx';
import NavLink from '../nav-link/NavLink.jsx';
import SignIn from '../sign-in/SignIn.jsx';
import SearchBar from '../search-bar/SearchBar.jsx'

class Navbar extends Component {
  constructor(props) {
    super(props);

    // function bindings
    this.menuOpen = this.menuOpen.bind(this);
    this.menuClose = this.menuClose.bind(this);


  }

  // functions
  // Toggle between showing and hiding the sidenav when clicking the menu icon


  menuOpen() {
    const mySidenav = document.getElementById('mySidenav');

    if (mySidenav.style.display === 'block') {
      mySidenav.style.display = 'none';
    } else {
      mySidenav.style.display = 'block';
    }
  }

  // Close the sidenav with the close button
  menuClose() {
    const mySidenav = document.getElementById('mySidenav');

    mySidenav.style.display = 'none';
  }

  render() {
    return (
      <div>
        {/* Navbar (sit on top) */}
        <div className="w3-top">
          <div className="w3-bar w3-white w3-card-2" id="myNavbar">
            <Link to="/" className="w3-bar-item w3-button w3-wide"><img width="117
              px" height="29px" src={path.join(__dirname, 'assets', 'img', 'logo_youdescribe.png')} /></Link>
            {/* Right-sided navbar links */}
            <div className="w3-right w3-hide-small">
              {/*<span className="w3-bar-item"><SearchBar /></span>*/}
              <Link to="/authoring-tool" className="w3-bar-item w3-button"><i className="fa fa-th"></i> AUTHORING TOOL</Link>
              <Link to="/video-page" className="w3-bar-item w3-button"><i className="fa fa-video-camera"></i> VIDEO PLAYER</Link>
              <Link to="/" className="w3-bar-item w3-button">SIGN IN</Link>
            </div>
            {/* Hide right-floated links on small screens and replace them with a menu icon */}

            <a href="javascript:void(0)" className="w3-bar-item w3-button w3-right w3-hide-large w3-hide-medium" onClick={this.menuOpen}>
              <i className="fa fa-bars w3-padding-right w3-padding-left"></i>
            </a>
          </div>
        </div>

        {/* Sidenav on small screens when clicking the menu icon */}
        <nav className="w3-sidenav w3-black w3-card-2 w3-animate-left w3-hide-medium w3-hide-large" style={{ display: 'none' }} id="mySidenav">
          <a href="javascript:void(0)" onClick={this.menuClose} className="w3-large w3-padding-16">Close ×</a>
          <a href="#about" onClick={this.menuClose}>ABOUT</a>
          <a href="#team" onClick={this.menuClose}>TEAM</a>
          <a href="#work" onClick={this.menuClose}>WORK</a>
          <a href="#pricing" onClick={this.menuClose}>PRICING</a>
          <a href="#contact" onClick={this.menuClose}>CONTACT</a>
        </nav>
      </div>
    );
  }
}

export default Navbar;
