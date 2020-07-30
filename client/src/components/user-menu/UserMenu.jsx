import React, { Component } from "react";
import Button from "../button/Button.jsx";
import UserAvatar from "../user-avatar/UserAvatar.jsx";
import { Link } from "react-router";

class UserMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userAdmin: localStorage.getItem("userAdmin")
    };
  }

  render() {
    const myVideosUrl = `/videos/user/${this.props.getAppState().userId}`;
    alert(this.state.userAdmin);
    return (
      <div id="user-menu" tabIndex="-1">
        <div className="arrow-up"></div>
        <div className="w3-card-4">
          <div className="user-menu-header">
            <span aria-hidden="true">{this.props.getAppState().userName}</span>
          </div>
          <div className="my-described-videos-button">
            <Link
              to={myVideosUrl}
              title={this.props.translate("View my described videos")}
              onClick={this.props.userMenuToggle}
            >
              <i
                style={{ width: 50 }}
                className="fa fa-audio-description"
                aria-hidden="true"
              ></i>
              <span>{this.props.translate("My descriptions")}</span>
            </Link>
          </div>
          {/* <div className="my-described-videos-button">
            <Link to={`/profile/${this.props.getAppState().userId}`} title="View my profile" onClick={this.props.userMenuToggle}><i style={{width: 40}} className="fa fa-cog" aria-hidden="true"></i><span>{this.props.translate("My profile")}</span></Link>
          </div> */}
          {this.state.userAdmin !== "undefined" ? (
            <div className="my-described-videos-button">
              <Link
                to={`/admin`}
                title="Admin"
                onClick={this.props.userMenuToggle}
              >
                <i
                  style={{ width: 50 }}
                  className="fa fa-user"
                  aria-hidden="true"
                ></i>
                <span>{this.props.translate("Admin")}</span>
              </Link>
            </div>
          ) : (
            ""
          )}
          <hr />
          <div className="sign-out-button">
            <Button
              color="w3-indigo"
              text={this.props.translate("Sign out")}
              onClick={this.props.signOut}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default UserMenu;
