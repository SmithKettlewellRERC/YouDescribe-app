import React, { Component } from 'react';
import { IndexLink, Link } from 'react-router';
import path from 'path';
import NavLink from '../nav-link/NavLink.jsx';
import SearchBar from '../search-bar/SearchBar.jsx'
import SignInButton from '../sign-in-button/SignInButton.jsx';
// import SignOutButton from '../sign-out-button/SignOutButton.jsx';
import UserAvatar from '../user-avatar/UserAvatar.jsx';

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.navMenuOpen = this.navMenuOpen.bind(this);
  }

  // Toggle between showing and hiding the sidenav when clicking the menu icon
  navMenuOpen() {
    const mySidenav = document.getElementById('mySidenav');
    if (mySidenav.style.display === 'block') {
      mySidenav.style.display = 'none';
    } else {
      mySidenav.style.display = 'block';
    }
  }

  // Close the sidenav with the close button
  navMenuClose() {
    const mySidenav = document.getElementById('mySidenav');
    mySidenav.style.display = 'none';
  }

  userMenuToggle() {
    const userMenu = document.getElementById('user-menu');
    if (userMenu.style.display === 'block') {
      userMenu.style.display = 'none';
    } else {
      userMenu.style.display = 'block';
    }
  }

  render() {
    const isSignedIn = this.props.getAppState().isSignedIn;
    let signInComponent = null;
    if (isSignedIn) {
      signInComponent = <UserAvatar signOut={this.props.signOut} userMenuToggle={this.userMenuToggle} getAppState={this.props.getAppState} />;
    } else {
      signInComponent = <SignInButton />;
    }
    return (
      <header role="banner" id="navbar">
        <div className="skip"><a href="#main" title="Skip to main content">main</a></div>
        {/* Navbar (sit on top) */}
        <div className="w3-top">
          <div className="w3-bar w3-white w3-card-2 w3-text-indigo">
            <logo role="img" title="YouDescribe logo">
              <Link role="link" to="/" title="YouDescribe logo" id="logo" className="w3-bar-item w3-hide-small w3-hide-medium">
                <img
                  alt="YouDescribe logo"
                  height="100%"
                  src={path.join(__dirname, 'assets', 'img', 'youdescribe_logo_full_(indigo_and_grey).png')}
                />
              </Link>

              <Link role="link" to="/" id="logo" className="w3-bar-item w3-hide-large">
                <img
                  alt="YouDescribe logo"
                  height="100%"
                  src={path.join(__dirname, 'assets', 'img', 'youdescribe_logo_small_(indigo_and_grey).png')}
                />
              </Link>
            </logo>

            <div role="search" className="w3-left">
              <SearchBar updateSearch={searchValue => this.props.updateSearch(searchValue)} />
            </div>

            {/* Right-sided navbar links */}
            <div role="navigation" className="w3-right w3-hide-small w3-hide-medium">
              <Link to="/wishlist" className="w3-bar-item" style={{ position: 'relative', top: '8px' }}><i className="fa fa-heart">&nbsp;&nbsp;</i>WISH LIST</Link>
              <div className="w3-bar-item" style={{ position: 'relative', top: '2px' }}>
                {signInComponent}
              </div>
            </div>

            {/* Hide right-floated links on small screens and replace them with a menu icon */}
            <a href="javascript:void(0)" className="w3-bar-item w3-right w3-hide-large" style={{ position: 'relative', top: '8px' }} onClick={this.navMenuOpen}>
              <i className="fa fa-bars"></i>
            </a>
          </div>
        </div>

        {/* Sidenav on small screens when clicking the menu icon */}
        <div id="mySidenav" className="w3-sidenav w3-black w3-card-2 w3-animate-left w3-hide-large" style={{ display: 'none' }}>
          <a href="javascript:void(0)" onClick={this.navMenuClose} className="w3-large w3-padding-16">Close ×</a>
          <Link to="/wishlist" className="w3-bar-item w3-button"><i className="fa fa-heart"></i> WISH LIST</Link>
          {signInComponent}
        </div>
      </header>
    );
  }
}

export default Navbar;
