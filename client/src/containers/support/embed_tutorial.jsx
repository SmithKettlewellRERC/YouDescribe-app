import React, { Component } from 'react';
import SupportNav from './SupportNav.jsx';
import * as Icon from "react-bootstrap-icons";
// import embedded from './images/embedded_link.png';
import path from "path";


class Embed_Tutorial extends Component {
  componentDidMount() {
      // document.getElementById('support').focus();
    }
  render() {
    return (
      <div id="support" tabIndex="-1">

        <header role="banner" className="w3-container w3-indigo">
          <h2>A step-by-step embedding tutorial</h2>
        </header>

        <main className="w3-row">
          <SupportNav translate={this.props.translate} />
          <a name="top" className="anchor"></a>

          <h2>YouDescribe How to Embed Step By Step Instructions</h2>

          <h3>Anatomy of the YouDescribe selected video page.</h3>

          <p>Top: A tool bar along the top (from left to right): YouDescribe Home, Search Box, Recent Descriptions, Wish List, and the Sign In buttons.</p>
          <p>Left section: Left side links to social media like Facebook, Twitter, Email. Also, the two buttons below it links to the embedded link and html snippet.</p>
          <p>Center section: Thumbnail links to the selected video and below it there are two sections. One has the title of the video, views, date published and votes. The other section has options to rate description, turn off descriptions or add a new description. </p>
          <p>Bottom: Tool bar links to Smith-Kettlewell Eye Research Institute, Credits, Contact Us, and Support</p>

          <p><strong>Getting Started!</strong></p>
          
          <h3>Logging in:</h3>
          <p>Log in to your account using your Google ID at the top right by clicking the box that says “Signin with Google.” (you must have a google ID to add descriptions, if you don’t have one, an account is free and easy to get at: <a href="https://accounts.google.com/SignUp?hl=en">https://accounts.google.com/SignUp?hl=en</a>) You will be prompted to type in your google address, and password. Once you have logged in, you are ready to start describing, and will be able to save your work.</p>

          <h3>Finding the embedded link to the selected video:</h3>

          <p>If you click on <Icon.PlusSquareFill></Icon.PlusSquareFill> button, an embedded link to the video will be copied to the clipboard. You can use that link to directly access the video. </p>
          {/* <img src={embedded} alt="Embedded Link"></img> */}
          <img
            alt="yo"
            src={path.join(
            __dirname,
            "assets",
            "img",
            "embedded_link.png"
            )}
            className="w3-image"
          />
          <img
            alt="yo"
            src={path.join(
            __dirname,
            "assets",
            "img",
            "embedded_video.png"
            )}
            className="w3-image"
          />
          <h3>Finding the html snippet for the video:</h3>

          <p>If you click on <Icon.Code></Icon.Code> button, a html snippet will be copied to the clipboard. You can use that link to directly access the video. </p>
          <img
            alt="yo"
            src={path.join(
            __dirname,
            "assets",
            "img",
            "html_snippet.png"
            )}
            className="w3-image"
          />
          <img
            alt="yo"
            src={path.join(
            __dirname,
            "assets",
            "img",
            "html_code.png"
            )}
            className="w3-image"
          />
          <p><a href="#top">Back to top</a></p>

        </main>
      </div>
    );
  }
}
  
export default Embed_Tutorial;