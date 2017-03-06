import React, { Component } from 'react';
import { IndexLink, Link } from 'react-router';
import path from 'path';

// import SearchBar from '../search-bar/SearchBar.jsx';
import NavLink from '../nav-link/NavLink.jsx';
import SignIn from '../sign-in/SignIn.jsx';
import SearchBar from '../search-bar/SearchBar.jsx'

class NavbarMaterial extends Component {
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
        <div className="w3-row w3-padding-8 w3-theme-d2 w3-xlarge">
          <div className="w3-quarter">
            <div className="w3-bar">
              <a href="#" className="w3-bar-item w3-button"><i className="fa fa-bars"></i></a>
            </div>
          </div>

          <div className="w3-half">
            <input type="text" className="w3-amber w3-border-0 w3-padding" style={{ width: '100%' }} />
          </div>

          <div className="w3-quarter">
            <div className="w3-bar w3-xlarge">
              <a href="#" className="w3-bar-item w3-button w3-left"><i className="fa fa-search"></i></a>
              <a href="#" className="w3-bar-item w3-button w3-right"><img className="w3-hide-small w3-circle" src="img_avtar.jpg" style={{ height: '40px' }} /></a>
            </div>

          </div>
        </div>
    );
  }
}

export default NavbarMaterial;
