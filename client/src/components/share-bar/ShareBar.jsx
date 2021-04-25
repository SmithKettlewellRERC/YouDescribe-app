import React from "react";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { store } from "react-notifications-component";

const ShareBar = (props) => {
  const twitterText = `Check out ${props.videoTitle.substring(
    0,
    50
  )} w/ #AudioDescription on YouDescribe ${
    window.location.href
  } #a11y @SKERI_YD`;
  const emailText = `Watch this video with audio description on YouDescribe:\n\n${props.videoTitle}\n${window.location.href}\n\nTo learn more about accessible video with audio description,\nfollow YouDescribe on Twitter or Facebook:\n\nhttp://twitter.com/SKERI_YD\nhttp://facebook.com/YouDescribe`;

  return (
    <div id="share-bar" className="ssk-sticky ssk-left ssk-center ssk-lg">
      <a
        href="#"
        className="ssk ssk-facebook"
        aria-label="Share this video on Facebook"
      ></a>
      <a
        href="#"
        className="ssk ssk-twitter"
        aria-label="Share this video on Twitter"
        data-text={twitterText}
      ></a>
      <a
        href="#"
        className="ssk ssk-email"
        aria-label="Share this video by e-mail"
        data-text={emailText}
      ></a>
      {/* <a
        href="#"
        
        className="ssk"
        aria-label="Embed this video, the link will be copied to the clipboard"
        onClick={() => {
          navigator.clipboard.writeText(
            window.location.href.replace("video", "embed") //returns link to the embed page with video id
          );
          store.addNotification({
            title: "",
            message: "The embed link has been copied to your clipboard!",
            type: "default",
            insert: "top",
            container: "bottom-center",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 2000,
              onScreen: true
            }
          });
        }}
      ></a> */}
    </div>
  );
};

export default ShareBar;
