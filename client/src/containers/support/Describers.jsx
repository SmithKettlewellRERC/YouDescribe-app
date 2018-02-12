import React, { Component } from 'react';
import SupportNav from './SupportNav.jsx';

class Describers extends Component {
  componentDidMount() {
    // document.getElementById('support').focus();
  }

  render() {
    return (
      <div id="support" tabIndex="-1">

        <header role="banner" className="w3-container w3-indigo">
          <h2>FAQ for describers</h2>
        </header>

        <main className="w3-row">
          <SupportNav translate={this.props.translate} />
          <a name="top" className="anchor"></a>

          <h2>For Describers</h2>

          <p>Many frequently asked questions are answered in our description tutorial playlist. Go to our <a href="https://www.youtube.com/playlist?list=PLNJrbI_nyy9uzywoJfyDRoeKA1SaIEFJ7">Description Tutorial Playlist</a></p>

          <h3>Q: Do I need any kind of training or certification to be a YouDescribe describer?</h3>
          <p>A: No, but the more you know about good audio description, the better and more useful your descriptions will be. Go to <a href="https://www.youtube.com/playlist?list=PLNJrbI_nyy9uzywoJfyDRoeKA1SaIEFJ7">Description Tutorial Playlist</a> to learn the basics of good AD.</p>

          <h3>Q: How do I describe a video with YouDescribe?</h3>
          <p>A: To contribute descriptions toYouDescribe, you first need to be a registered user. Log in to your account using a Google ID (you must have a google ID to rate and add descriptions. If you don’t have a Google ID, an account is free and easy to get at <a href="https://accounts.google.com/SignUp?hl=en">Google Accounts page</a>. At YouDescribe you will be prompted to type in your google address, and password. Once you have logged in, you are ready to start rating videos, and doing audio description (AD).</p>

          <h3>Q: What equipment do I need to use YouDescribe?</h3>
          <p>A: To record descriptions for YouDescribe you only need an Internet connection, a browser that supports YouDescribe (Chrome is the most consistent) and a microphone. Many computers have built-in microphones, but it’s best to use an external microphone to minimize room noise and get the best voice quality.</p>

          <h3>Q: What kind of microphone works best with YouDescribe?</h3>
          <p>A: We’ve had the best results with USB headset microphones such as those used for Skype, gaming, or other voice applications. These headsets are inexpensive and easy to use. Of course, you can use fancier microphones as well, but these simple USB headset mics work great!</p>

          <h3>Q: What videos should I describe?</h3>
          <p>A: It depends. The most important things to describe are the things that people need. Let your blind students, friends, and family members be the guides. YouDescribe keeps a wish list of videos in need of AD. To find something on the wish list, click the Wish List button at the top tool bar, it has a heart next to it. Now you are on the main Wish List page. Videos with more votes for AD are at the top, the latest wish list requests are at the bottom. Select a video to describe from the wish list by clicking the Describe button in the lower right hand corner of the video thumbnail. If you want to vote a video to the top of the wish list queue, click the heart in the lower left hand corner of the video thumbnail. Don’t see anything you like? Try clicking the Load More button, bottom center of page, to see the next page of wish list items. Click the thumbnail to select the video and start adding AD.</p>

          <h3>Q: What kinds of things should I describe in a video?</h3>
          <p>
            <ul>
              <li>Describe what you see.</li>
              <li>Be concise and speak comfortably but quickly.</li>
              <li>Always read on-screen text exactly as they appear.</li>
              <li>Be factual.</li>
              <li>Use proper terminology and names whenever possible.</li>
              <li>Write a script.</li>
              <li>Use inline description when possible, extended when necessary</li>
              <li>Try to match the mood of the video.</li>
            </ul>
          </p>

          <h3>Q: What kinds of things should I not describe?</h3>
          <p>
            <ul>
              <li>Don’t talk over the dialog.</li>
              <li>Don’t describe what can be inferred from the audio.</li>
              <li>Don’t over-describe - less is more.</li>
              <li>Don’t interpret or editorialize.</li>
              <li>Don’t give away secrets, surprises, or sight gags before they happen.</li>
              <li>Don’t censor (sex, violence, gore, emotions).</li>
              <li>Don’t overuse extended description.</li>
              <li>Do not describe obvious sound cues such as a phone ringing or a dog barking.</li>
            </ul>
          </p>

          <h3>Q: Are colors important to describe?</h3>
          <p>A: Describe color only when it is vital to the comprehension of content.</p>

          <h3>Q: Where can I learn more about how to create high quality description?</h3>
          <p>
            <ul>
              <li><a href="http://www.acb.org/adp/guidelines.html">The ACB Audio Description Project Guidelines</a></li>
              <li><a href="http://www.audiodescriptioncoalition.org/standards.html">The Audio Description Coalition Standards</a></li>
              <li><a href="http://www.descriptionkey.org/index.html">The Description Key by DCMP</a></li>
              <li><a href="https://www.ofcom.org.uk/about-ofcom/website/regulator-archives">The Independent Television Commission Guidance on Standards</a></li>
              <li><a href="http://main.wgbh.org/wgbh/pages/mag/services/description/dvs-faq.html">The Media Access Group at WGBH Strategies and Techniques</a></li>
              <li><a href="https://www.youtube.com/watch?v=JZlNVajYx9s">The Do’s and Don’ts of Description – Video Tutorial by Rick Boggs.</a></li>
            </ul>
          </p>
        </main>
      </div>
    );
  }
}

export default Describers;
