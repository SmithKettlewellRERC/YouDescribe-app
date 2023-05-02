import React, { Component } from "react";
import { Link } from "react-router";
import path from "path";
import SearchBar from "../search-bar/SearchBar.jsx";
import SignInButton from "../sign-in-button/SignInButton.jsx";
import UserAvatar from "../user-avatar/UserAvatar.jsx";
import { ExclamationTriangleFill } from "react-bootstrap-icons";

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.navMenuOpen = this.navMenuOpen.bind(this);
  }

  // Toggle between showing and hiding the sidenav when clicking the menu icon
  navMenuOpen() {
    const mySidenav = document.getElementById("mySidenav");
    if (mySidenav.style.display === "block") {
      mySidenav.style.display = "none";
    } else {
      mySidenav.style.display = "block";
    }
  }

  // Close the sidenav with the close button
  navMenuClose() {
    const mySidenav = document.getElementById("mySidenav");
    mySidenav.style.display = "none";
  }

  userMenuToggle() {
    const userMenu = document.getElementById("user-menu");
    if (userMenu.style.display === "block") {
      userMenu.style.display = "none";
    } else {
      userMenu.style.display = "block";
      document.getElementById("user-menu").focus();
    }
  }

  render() {
    const isSignedIn = this.props.getAppState().isSignedIn;
    let signInComponent = null;
    if (isSignedIn) {
      signInComponent = (
        <UserAvatar
          translate={this.props.translate}
          signOut={this.props.signOut}
          userMenuToggle={this.userMenuToggle}
          getAppState={this.props.getAppState}
        />
      );
    } else {
      signInComponent = <SignInButton translate={this.props.translate} />;
    }
    return (
      <React.Fragment>
        <nav id="navbar">
          {/* Navbar (sit on top) */}
          <div className="w3-top">
            <div className="w3-bar w3-white w3-card-2 w3-text-indigo">
              <Link
                to="/"
                id="logo"
                className="w3-bar-item w3-hide-small w3-hide-medium"
              >
                <img
                  alt="YouDescribe home"
                  height="100%"
                  src={path.join(
                    __dirname,
                    "assets",
                    "img",
                    "youdescribe_logo_full_(indigo_and_grey).png"
                  )}
                />
              </Link>

              <Link to="/" id="logo" className="w3-bar-item w3-hide-large">
                <img
                  alt="YouDescribe home"
                  height="100%"
                  src={path.join(
                    __dirname,
                    "assets",
                    "img",
                    "youdescribe_logo_small_(indigo_and_grey).png"
                  )}
                />
              </Link>

              <div className="w3-left">
                <SearchBar
                  updateSearch={(searchValue) =>
                    this.props.updateSearch(searchValue)
                  }
                  translate={this.props.translate}
                />
              </div>

              {/* Right-sided navbar links */}
              <div className="w3-right w3-hide-small w3-hide-medium">
                <Link
                  to="/"
                  className="w3-bar-item w3-small"
                  style={{ position: "relative", top: "11px", padding: "8px" }}
                >
                  <i className="fa fa-home" aria-hidden="true">
                    &nbsp;&nbsp;
                  </i>
                  {this.props.translate("RECENT DESCRIPTIONS")}
                </Link>
                <Link
                  to="/wishlist"
                  className="w3-bar-item w3-small"
                  style={{ position: "relative", top: "11px", padding: "8px" }}
                >
                  <i className="fa fa-heart" aria-hidden="true">
                    &nbsp;&nbsp;
                  </i>
                  {this.props.translate("WISH LIST")}
                </Link>
                <Link
                  to="/support"
                  className="w3-bar-item w3-small"
                  style={{ position: "relative", top: "11px", padding: "8px" }}
                >
                  <i className="fa fa-question-circle" aria-hidden="true">
                    &nbsp;&nbsp;
                  </i>
                  {this.props.translate("SUPPORT")}
                </Link>
                <div
                  className="w3-bar-item"
                  style={{ position: "relative", top: "2px" }}
                >
                  {signInComponent}
                </div>
              </div>

              {/* Hide right-floated links on small screens and replace them with a menu icon */}
              <a
                aria-hidden="true"
                className="w3-bar-item w3-right w3-hide-large"
                style={{ position: "relative", top: "8px" }}
                onClick={this.navMenuOpen}
              >
                <i className="fa fa-bars" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Sidenav on small screens when clicking the menu icon */}
          <div
            id="mySidenav"
            className="w3-sidenav w3-black w3-card-2 w3-animate-left w3-hide-large"
            style={{ display: "none" }}
          >
            <a onClick={this.navMenuClose} className="w3-large w3-padding-16">
              {this.props.translate("Close")} ×
            </a>
            <Link
              to="/"
              className="w3-bar-item w3-button"
              onClick={() => document.getElementById("home-heading").focus()}
            >
              <i className="fa fa-home" aria-hidden="true" />{" "}
              {this.props.translate("HOME")}
            </Link>
            <Link
              to="/wishlist"
              className="w3-bar-item w3-button"
              onClick={() =>
                document.getElementById("wish-list-heading").focus()
              }
            >
              <i className="fa fa-heart" aria-hidden="true" />{" "}
              {this.props.translate("WISH LIST")}
            </Link>
            {signInComponent}
          </div>
        </nav>
        <div className="upgrade-notice">
          <ExclamationTriangleFill size={24} className="upgrade-icon"/>
          <span>
            We are upgrading our systems! Starting 05/08/2023 please refrain
            from creating audio descriptions until 05/15/2023 to make sure that
            none of your hard work is lost! Please see the&nbsp;
            <Link to="/support/describers" className="w3-bar-item">
              support page
            </Link>
            &nbsp;for more details
          </span>
        </div>
      </React.Fragment>
    );
  }
}

export default Navbar;
