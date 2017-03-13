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
      <div id="navbar">
        {/* Navbar (sit on top) */}
        <div className="w3-top">
          <div className="w3-bar w3-white w3-card-2">
            <div role="logo">
              <Link to="/" id="logo" className="w3-bar-item w3-button w3-wide w3-hide-small w3-hide-medium"> 
                {/*<img
                  alt="YouDescribe logo"
                  height="24px"
                  src={path.join(__dirname, 'assets', 'img', 'logo_youdescribe.png')}
                  />*/}
                  <span>You</span><span className="w3-indigo curve">Describe</span>
                </Link>

                <Link to="/" id="logo" className="w3-bar-item w3-button w3-wide w3-hide-large">
                  <span>Y</span><span className="w3-indigo curve">D</span>
                </Link>
            </div>

            <div role="searchbar" className="w3-left">
              {/*<input type="text" className="w3-amber w3-border-0 w3-padding" style={{ width: '100%' }} />*/}
              <SearchBar updateSearch={(searchValue) => this.props.updateSearch(searchValue)} />
            </div>

            {/* Right-sided navbar links */}
            <nav role="navigation" className="w3-right w3-hide-small w3-hide-medium">
              {/*<span className="w3-bar-item"><SearchBar /></span>*/}
              <Link to="/authoring-tool/6hk6y8dhkeE" className="w3-bar-item w3-button"><i className="fa fa-th"></i> AUTHORING TOOL</Link>
              <Link to="/wishlist" className="w3-bar-item w3-button"><i className="fa fa-heart"></i> WISH LIST</Link>
              <Link to="/" className="w3-bar-item w3-button">SIGN IN</Link>
            </nav>
            {/* Hide right-floated links on small screens and replace them with a menu icon */}

            <a href="javascript:void(0)" className="w3-bar-item w3-button w3-right w3-hide-large" onClick={this.menuOpen}>
              <i className="fa fa-bars"></i>
            </a>
          </div>
        </div>

        {/* Sidenav on small screens when clicking the menu icon */}
        <nav className="w3-sidenav w3-black w3-card-2 w3-animate-left w3-hide-large" style={{ display: 'none' }}>
          <a href="javascript:void(0)" onClick={this.menuClose} className="w3-large w3-padding-16">Close ×</a>
            <Link to="/authoring-tool/6hk6y8dhkeE" className="w3-bar-item w3-button"><i className="fa fa-th"></i> AUTHORING TOOL</Link>
            <Link to="/wishlist" className="w3-bar-item w3-button"><i className="fa fa-heart"></i> WISH LIST</Link>
            <Link to="/" className="w3-bar-item w3-button">SIGN IN</Link>
        </nav>
      </div>
    );
  }
}

export default Navbar;
