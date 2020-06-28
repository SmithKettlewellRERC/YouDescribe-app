import React from "react";

const Instructions = () => (
  <div id="unsupported-browser" tabIndex="-1">
    <header role="banner" className="w3-container w3-indigo">
      <h2 style={{display: "flex", justifyContent: "center"}}>Thank You for choosing the new version of YOUDESCRIBE. </h2>
    </header>
    <div style={{paddingLeft: 50, paddingRight: 50}}>
      <h2>Instructions:</h2>
      <p>Your YouTube video has been processed! A series of computer driven algorithms have made some initial descriptions and broken down the video into segments.</p>
      <p><b>Step 1</b> Please watch the video through once, giving special attention to the scene pacing. Your first job is to merge any scenes that are too choppy for good audio description. There is a note taking section for any random thoughts or words you might want to use on your next viewing.</p>
      <p><b>Step 2</b> After merging scenes as best you can, you can start in on writing the script into the text box. Some computer generated sample text is there to help guide you. Speech to text capability means you won’t need a microphone to record your own voice, but it does mean you need to be careful about typos and punctuation!</p>
    </div>
  </div>
);

export default Instructions;
