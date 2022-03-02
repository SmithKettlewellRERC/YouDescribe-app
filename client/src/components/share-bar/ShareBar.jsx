import React from "react";

import * as Icon from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        title="Share this video on Facebook"
      ></a>
      <a
        href="#"
        className="ssk ssk-twitter"
        aria-label="Share this video on Twitter"
        data-text={twitterText}
        title="Share this video on Twitter"
      ></a>
      <a
        href="#"
        className="ssk ssk-email"
        aria-label="Share this video by e-mail"
        data-text={emailText}
        title="Share via Email"
      ></a>
      <a
        title="Embed this video"
        href="#"
        className="ssk embed"
        aria-label="Embed this video, the link will be copied to the clipboard"
        onClick={() => {
          navigator.clipboard.writeText(
            window.location.href.replace("video", "embed") //returns link to the embed page with video id
          );
          toast.info("The embed link has been copied to your clipboard!", {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }}
      >
        <Icon.PlusSquareFill></Icon.PlusSquareFill>
      </a>
      <a
        title="Create an html snippet"
        href="#"
        className="ssk embed"
        aria-label="Embed this video, the snippet will be copied to the clipboard"
        onClick={() => {
          navigator.clipboard.writeText(
            "<iframe " +
              'width="56s "' +
              'height="315 "' +
              'class="leftSide "' +
              `src=${window.location.href.replace("video", "embed")} />`
          );

          toast.info("The snippet has been copied to your clipboard!", {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }}
      >
        <Icon.Code></Icon.Code>
      </a>
    </div>
  );
};

export default ShareBar;
