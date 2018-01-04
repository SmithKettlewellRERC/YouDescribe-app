import React, { Component } from 'react';

class Faq extends Component {
  componentDidMount() {
    // document.getElementById('support').focus();
  }

  render() {
    return (
      <div id="faq" tabIndex="-1">

        <header role="banner" className="w3-container w3-indigo">
          <h2>Help and Support page</h2>
        </header>

        <main className="w3-row">
          <a name="top" className="anchor"></a>
          <h2>Welcome to the YouDescribe Help and Support page. We have many resources here for you.</h2>

          <ul>
            <li><a href="#general">General information about YouDescribe</a></li>
            <li><a href="#viewers">FAQ pages for viewers</a></li>
            <li><a href="#describers">FAQ for describers</a></li>
            <li><a href="#tutorial">A step-by-step audio description tutorial with a trouble shooting section</a></li>
          </ul>

          <p>One can read the whole thing through or head right to the section you are most interested in reading.</p>

          <p>Many of the content here are covered in our <a href="https://www.youtube.com/playlist?list=PLNJrbI_nyy9sjqZ-Wcn6sX868i9KtdNrT">YouDescribe playlist at YouTube!</a></p>

          <p>If you cannot find an answer to your question, please email <a href="mailto: info@youdescribe.org">info@youdescribe.org</a></p>

          <h2><a name="general" className="anchor">General information about YouDescribe</a></h2>

          <h3>Q: Is YouDescribe really free?</h3>
          <p>A: Yes! Anyone can play or describe YouTube videos for free using YouDescribe.</p>

          <h3>Q: Who should be using YouDescribe?</h3>
          <p>A: Everyone who supports or needs audio description can use YouDescribe. People with visual disabilities who cannot see what is going on in a video can benefit from descriptions recorded by sighted describers, but other viewers like individuals on the autism spectrum, or those learning a new language can benefit from AD as well. Descriptions can be contributed by anyone with the time, skill, and inclination, including parents, teachers, and friends and fans. Many people may just think YouDescribe is cool and want to try it.</p>

          <h3>Q: What is so important about description?</h3>
          <p>A: In addition to video’s enormous entertainment, and cultural importance, video is being used in more and more educational and employment situations. While videos can sometimes be completely understandable by a blind viewer simply by listening to the sound track, usually there are visual elements that have no audible equivalent. For example, when someone demonstrating a yoga pose says, “Hold your arms like this,” or a crafting demonstrator says, “Glue this piece like this,” the blind viewer is barred from using that video as a learning tool. On-screen text, scene changes, and body language are all video elements that may need some description in order for a blind viewer to follow a story. Adding description makes video accessible. That’s important!</p>

          <h3>Q: What’s so cool about YouDescribe?</h3>
          <p>A: YouDescribe is unique in that it allows anybody, anywhere to contribute description of an existing video and let a visually-impaired viewer check it out right away. The best part is that it does so without modifying or redistributing the existing YouTube video. It is not a separate version, it’s the same version with description added while you watch.</p>

          <h3>Q: How does YouDescribe work?</h3>
          <p>A: Sighted people view YouTube videos and record descriptions of what they see. When the video is played with YouDescribe, the descriptions are played back with the video. Underneath the hood, YouDescribe uses the Descriptive Video Exchange (DVX) to store description clips and information about them. DVX knows what video each clip belongs to and what time the clip should be played. Lots of other information is stored along with the descriptions, including who recorded it, when it was recorded, how popular it is, etc. YouDescribe is the first video service to use DVX to allow anybody, anywhere, to record and upload video descriptions to the cloud. It provides a unique way for people to get descriptions for the instructional, informational, and entertainment videos offered on YouTube.</p>

          <h3>Q: Can YouDescribe be used for videos other than those on YouTube?</h3>
          <p>A: No. The video must be up at YouTube for you to add description. If it has not been shared at YouTube, you can create a channel of your own to upload the content you want. Directions supplied here - Google Support - How to create your own YouTube channel.</p>

          <h3>Q: Who built YouDescribe?</h3>
          <p>A: The Smith-Kettlewell Video Description Research and Development Center developed the Descriptive Video Exchange and YouDescribe. YouDescribe was developed in collaboration with The Ideal Group and the Description Leadership Network.</p>

          <h3>Q: How do I play a described video with YouDescribe?</h3>
          <p>A: To play a YouDescribe video, you do not need to be logged in. Simply go to the main search page of YouDescribe and click on the title of any of the videos listed. The most recently described videos appear at the top of the list. Find any video by using the search field on this page. While videos with descriptions are listed first, search results will yield undescribed videos as well. Just click on the title to play the video you want to watch.</p>

          <h3>Q: What browsers are compatible with YouDescribe?</h3>
          <p>A: YouDescribe works with most browsers: Chrome, Firefox, Edge, and Safari. (Chrome tends to work best, especially if the internet conection is slow).</p>

          <h3>Q: What operating systems are compatible with YouDescribe?</h3>
          <p>A: YouDescribe is compatible with any Mac or PC-based operating system. Currently, YouDescribe is not compatible on mobile devices but they are in the works and will be launched very soon.</p>

          <h3>Q: How do I share a described video with a friend or embed it in a webpage?</h3>
          <p>A: Sharing can be done in a couple of ways. On the left of every video is a quick share link for email, Facebook, and twitter. It generates an easy to share template for each social media platform. To share on a webpage one can copy the web address from the browser field at the top and use iframe or an object tag to embed the desired video.</p>

          <h3>Q: How can I send feedback or reach technical support?</h3>
          <p>A: Please email us at: info@youdescribe.org</p>

          <p><a href="#top">Back to top</a></p>

          <h2><a name="viewers" className="anchor">FAQ pages for viewers</a></h2>

          <h3>Q: How can I find YouTube videos that have descriptions?</h3>
          <p>A: There are two ways to locate videos! Both require you to visit <a href="www.youdescribe.org">www.youdescribe.org</a></p>
          <p><strong>Search Box:</strong> If you know what video you are seeking, type the name/description/key word into the search box in the upper tool bar. Click through the search results until you find the one you want. Described videos are listed first, then those without AD.</p>
          <p><strong>Browse:</strong> Recently described videos are in the center section of the homepage, newly posted first. One can load more by clicking the Load More button.</p>

          <h3>Q: Can I request a description for a particular video?</h3>
          <p>A: Yes! YouDescribe keeps a Wish List of videos in need of AD. At <a href="www.youdescribe.org">www.youdescribe.org</a>, use the search box (top tool bar, center left). The videos will appear as thumb nails. In the left hand corner of each video on the screen is a heart. Click the heart to add it to the wish list. Videos with more votes for AD are at the top, the latest wish list requests are at the bottom. If you want to vote a video to the top of the wish list queue, click the icon in the lower left hand corner of the video thumbnail. There is not currently a way to add a video to the wish list if it has been opened in YouDescribe. Try going back to the search results page with the thumbnails, and click the icon in the lower left corner. Not finding anything you like? Try clicking the Load More button, bottom center of page, to see the next page of Wish List items.</p>

          <h3>Q: Can I rewind and fast-forward and stuff like that?</h3>
          <p>A: Of course! The YouDescribe player frame includes buttons for Stop, Pause/Play, Rewind, and Fast-Forward. A box below and to the right of every video allows you to turn off descriptions entirely or select from different describers if there is more than one description available for the video.</p>

          <h3>Q: I’m playing the video but the volume of the video and describer is all wrong, how do I fix that?</h3>
          <p>A: There is a slide bar under each video labeled V-- -- -- -- D. Slide the bar to the left to have more Video volume, to the right to have more Describer volume.</p>

          <h3>Q: I want someone to add audio description for a video I own, can they use YouDescribe?</h3>
          <p>A: Yes, as long as the video is posted at YouTube. You can create a channel of your own to upload the content you want. Directions supplied at <a href="https://support.google.com/youtube/answer/1646861?hl=en">Google Support - How to create your own YouTube channel</a>.</p>

          <h3>Q: How can I send feedback or reach technical support?</h3>
          <p>A: Please email us at: <a href="mailto: info@youdescribe.org">info@youdescribe.org</a></p>

          <p><a href="#top">Back to top</a></p>

          <h2><a name="describers" className="anchor">FAQ for describers</a></h2>

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

          <h2><a name="tutorial" className="anchor">A step-by-step audio description tutorial with a trouble shooting section</a></h2>

          <p>Go to <a href="www.youdescribe.org">www.youdescribe.org</a></p>

          <h3>Anatomy of the YouDescribe welcome page.</h3>
          <p>Top: A tool bar along the top (from left to right): YouDescribe Home, Search Box, Recent Descriptions, Wish List, and the Sign In buttons.</p>
          <p>Center section: Thumbnail links to recent videos posted with YouDescribe audio description (AD).</p>
          <p>Bottom: Tool bar links to Smith-Kettlewell Eye Research Institute, Credits, Contact Us, and Support</p>

          <p><strong>Getting Started!</strong></p>
          
          <h3>Logging in:</h3>
          <p>Log in to your account using your Google ID at the top right by clicking the box that says “Signin with Google.” (you must have a google ID to add descriptions, if you don’t have one, an account is free and easy to get. https://accounts.google.com/SignUp?hl=en) You will be prompted to type in your google address, and password. Once you have logged in, you are ready to start describing, and will be able to save your work.</p>

          <h3>Finding your desired YouTube Video:</h3>
          <p>There are two ways to locate videos!</p>

          <p><strong>Search Box</strong>: If you know what video you are seeking, type the name/description/channel into the search box in the upper tool box, center-left of page. The video must be up at YouTube for you to add description. (If it has not been shared at YouTube, you can create a channel of your own to upload the content you want. Directions supplied <a href="https://support.google.com/youtube/answer/1646861?hl=en">here</a>. Click through the search results until you find the one you want. Sometimes there are multiple copies of the video- pick the best quality and most official one. For example- a Sesame Street video in HD posted by PBS will be of better quality and most likely be at YouTube longer than one who filmed from the TV screen, and loaded to an obscure YouTube Channel. Click the thumbnail to open a new window and start adding AD.</p>

          <p><strong>Wish List</strong>: YouDescribe keeps a wish list of videos in need of AD. To find something on the wish list, click the Wish List button at the top tool bar, it has a heart next to it. Now you are on the main Wish List page. Videos with more votes for AD are at the top, the latest wish list requests are at the bottom. Select a video to describe from the wish list by clicking the Describe button in the lower right hand corner of the video thumbnail. If you want to vote a video to the top of the wish list queue, click the heart in the lower left hand corner of the video thumbnail. Don’t see anything you like? Try clicking the Load More button, bottom center of page, to see the next page of wish list items. Click the thumbnail to select the video and start adding AD.</p>

          <h3>Adding something to the wish list:</h3>
          <p>At YouDescribe, use the search box. The videos will appear as thumb nails. In the left hand corner of each video on the screen is a heart. Click the heart to add it to the wish list. There is not currently a way to add a video to the wish list if it has been opened in YouDescribe. Try going back to the search results page with the thumbnails, and click the heart icon in the lower left corner.</p>

          <h3>Add Audio Description (AD) to your Video:</h3>
          <p>The Video you want to describe should be in the center of the page. If the video does not already have AD, there will be Add Description button under the video screen and to the right. Click there to add your description. (If that video has AD you have two other buttons available as well-rate Description, and Turn off descriptions. Rate description allows you to rate the describer on that particular video. Turn Off descriptions allows you to stop the AD while you view the video. Videos may have multiple descriptions available). To begin - select Add Description. You can add description to any video- even if it has already been described.</p>

          <h3>Anatomy of the YouDescribe AD tools.</h3>
          <p>The video is in the upper left corner with standard YouTube play pause buttons. Stop/start is controlled by the standard YouTube tool bar on the video in the left hand corner. On the right is a section labeled Notes. Under the video is a long tool bar. At the far left of the tool bar are two buttons, a yellow Add Inline button, and a magenta Add extended. Inline is an audio track that plays over the video, it needs to be timed so as not to disrupt the dialog, and original audio. Extended description stops the video while the AD is played. Even with extended description, it is best to say only as much as it strictly necessary so the viewer can get back to watching the video. You will need to be familiar with both the YouTube play/pause buttons, as well as the YouDescribe tool bars.</p>

          <h3>Make an anchor track:</h3>
          <p>To begin, we recommend you record an anchor track. YouDescribe works best if you record a short extended or inline audio track before you proceed to other steps. Often it is the title shown on the screen, or a brief description of the setting.</p>

          <p>Click the Add extended, a space will appear so you can label your first track. Pick something brief but descriptive for each track title, it makes finding the tracks, and editing easier later. Under the label box there are two symbols- a red record button, and a trash can. Mouse up to the controls on the video, and press play. Get the curser ready to click the red record button under the Extended audio track you have set up. When you want to record your first track, click the red record button. Once you have clicked the red button, it will be replaced with a white square. This is now the stop recording button. Click the white square when you are done speaking. Use the control buttons on the video to back up and hear your first track. If you are happy with it, press the save button. To delete a recorded track, click the trash can button. Now you can re-record your anchor track. Once you are happy with it, press save. It is best practice not to delete your anchor track once you are satisfied.</p>

          <h3>Deleting a track:</h3>
          <p>Click the trashcan symbol under the track. Easy! A note of caution, once deleted one cannot bring the track back.</p>

          <h3>Using the Notes section:</h3>
          <p>Now watch the entire video and make your notes for each track in the section to the right of the video. Be brief, be descriptive. Please read anything printed. A full tutorial on good audio description can be found <a href="https://www.youtube.com/watch?v=24Pmmo9wKik&amplist=PLNJrbI_nyy9uzywoJfyDRoeKA1SaIEFJ7">here</a>. Once you have all your notes written start recording! Pick either inline or extended, and follow the steps above.</p>

          <h3>Saving your work:</h3>
          <p>Save your work often. The save button is on the right hand side, towards the bottom of the audio tracks. Click that save button before you delete anything, or refresh the video.</p>

          <h3>Tool bar for recorded tracks:</h3>
          <p>Under each recorded audio track is a tool bar with 5 functions: a start/stop button (shown as play/pause), a switch between inline and extended track (shown as the Rightwards Arrow Over Leftwards Arrow), left arrow (move the audio track a little earlier), right arrow (move the audio track a little later) and a delete button (classic trash can).</p>

          <p><strong>Editing</strong>:</p>

          <h3>Converting Inline/Extended:</h3>
          <p>You can use a mix of inline and extended audio tracks, and they can be converted from Extended to Inline using the rightwards arrow over leftwards arrow under each track.</p>

          <h3>Using the Nudge feature:</h3>
          <p>To move the track half a second sooner, click the left arrow button, to move it half a second later click the right arrow button. You can click it as many times as you need to get it to settle in exactly the right spot. Play the video to hear if it is just right by using the control panel located on the video (the regular YouTube controls), then save your work by pressing the save button in the lower right corner. Save your work often.</p>

          <p><strong>Troubleshooting your recordings:</strong></p>
          
          <h3>Q: I am playing the video back, but my audio is not playing.</h3>
          <p>A: First of all, make sure that your mic is turned on, your computer’s mic settings are un-muted, and the mic volume is turned up. You can test you mic using a number of online programs. <a href="https://www.onlinemictest.com/">Here is one</a>. YouTube and YouDescribe are sometimes misaligned and the tracks play out of sync, especially if you have used the delete, nudge, or inline/extended edit tools. They are usually still there! Save your work by pressing the save button, then refresh the page - your tracks should now play. If you are on a very slow connection, or are running a lot of programs sometimes there is a lag in processing and saving your tracks. One thing that can help is shutting down any unneeded applications, getting to a better internet or waiting a few more seconds after pressing save before moving onto the next task.</p>

          <h3>Q: My audio track is just a little off, is there anything I can do?</h3>
          <p>A: This is where the nudge feature is your friend. Click the left or right arrows to move it 0.15 seconds sooner or later.</p>

          <h3>Q: What is the difference between inline description and extended description again?</h3>
          <p>A: Most description that has been created over the last few decades is Inline description. This means that the description is carefully dubbed into available spaces in the existing soundtrack. This sometimes left very little space for a describer to say anything, leading to extremely hard choices about what they could describe. With streaming video available on demand, it is no longer necessary to restrict the available time for description. Extended description automatically pauses the video to give the describer as much time as necessary to tell the blind viewer what is going on. Of course, even with extended description, it is best to say only as much as it strictly necessary so you can get back to watching the video.</p>

          <h3>Q: I recorded an inline track but it is too long and is getting in the way of the dialog. Help!</h3>
          <p>A: Try converting it to extended using the double arrow button under the track, then the video will stop so you can get your script in there. If it is too long, you might want to delete it and re-record another one with a shorter description.</p>

          <h3>Q: I made a lot of extended tracks an now the video is super long, and boring.</h3>
          <p>A: It happens to the best of us. We want to be thorough and get everything in there! Chances are the video is a little over described. Try cutting down your script, and re-recording a few tracks.</p>

          <h3>Q: I missed a section I needed to describe, how do I fix it?</h3>
          <p>A: Save your work, then refresh the video so you can play it from the beginning. At the bottom, label the track you want to record. Advance the video until you are in the right spot and click the red dot to start recording, click the white square when you are finished speaking. The tag for the track will not be in play order, but it will play in the correct spot on the video.</p>

          <h3>Q: How long will my content be saved on YouDescribe?</h3>
          <p>A: Your descriptions will be stored on YouDescribe until you delete them.</p>

          <h3>Q: Can I download my descriptions for my own use off-line?</h3>
          <p>A: This feature is not currently available, but stay tuned for possible developments in this area.</p>

          <h3>Q: Can I edit descriptions recorded by other users?</h3>
          <p>A: No, (and they can’t edit yours either). However, you can record a new description of your own for that video. Then users will have access to both descriptions and can choose which one they want.</p>

          <h3>Q: How long will my content be saved on YouDescribe?</h3>
          <p>A: Your descriptions will be stored on YouDescribe until you delete them.</p>

          <h3>Q: How can I send feedback or reach technical support?</h3>
          <p>A: Please email us at: <a href="mailto: info@youdescribe.org">info@youdescribe.org</a> or join our online community at <a href="https://www.facebook.com/youdescribe/">Facebook</a>.</p>

          <p><a href="#top">Back to top</a></p>

        </main>
      </div>
    );
  }
}

export default Faq;
