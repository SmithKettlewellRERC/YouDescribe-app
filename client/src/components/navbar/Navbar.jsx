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
    // <img
    //   alt="YouDescribe logo"
    //   height="24px"
    //   src={path.join(__dirname, 'assets', 'img', 'logo_youdescribe.png')}
    //   />
    return (
      <div>
        {/* Navbar (sit on top) */}
        <div className="w3-top">

          <div className="w3-bar w3-white w3-card-2" id="navbar">

            <Link to="/" id="logo" className="w3-bar-item w3-button w3-wide">
              <span>You</span><span className="w3-indigo curve">Describe</span>
            </Link>

            <div className="w3-left w3-padding">
              {/*<input type="text" className="w3-amber w3-border-0 w3-padding" style={{ width: '100%' }} />*/}
              <SearchBar updateSearch={(searchValue) => this.props.updateSearch(searchValue)} />
            </div>

            {/* Right-sided navbar links */}
            <div className="w3-right w3-hide-small">
              {/*<span className="w3-bar-item"><SearchBar /></span>*/}
              <Link to="/authoring-tool/hPLgfGX1I5Y" className="w3-bar-item w3-button"><i className="fa fa-th"></i> AUTHORING TOOL</Link>
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
            <Link to="/authoring-tool/hPLgfGX1I5Y" className="w3-bar-item w3-button"><i className="fa fa-th"></i> AUTHORING TOOL</Link>
            <Link to="/video-page" className="w3-bar-item w3-button"><i className="fa fa-video-camera"></i> VIDEO PLAYER</Link>
            <Link to="/" className="w3-bar-item w3-button">SIGN IN</Link>
        </nav>
      </div>
    );
  }
}

export default Navbar;
