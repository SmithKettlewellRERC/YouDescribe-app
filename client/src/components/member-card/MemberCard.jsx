import React, { Component } from "react";
import path from "path";

class MemberCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div
          id="video-card"
          className="w3-margin-top w3-left member-card"
          title=""
        >
          <div className="w3-card-2 w3-hover-shadow">
            <div id="card-thumbnail" aria-hidden="true">
              <img
                alt={this.props.desc}
                src={path.join(
                  __dirname,
                  "assets",
                  "img",
                  "creditPage",
                  `${this.props.img}`
                )}
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </div>
            <br></br>
            <div className="w3-container w3-padding-bottom member-text">
              <div id="card-title-container">
                <div id="card-title">
                  <h2>{this.props.name}</h2>
                </div>
                <div id="card-bio">
                  <span
                    style={{
                      background: "white",
                    }}
                  >
                    {this.props.designation}
                  </span>
                  <span
                    style={{
                      background: "white",
                    }}
                  >
                    {this.props.tenure}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MemberCard;
