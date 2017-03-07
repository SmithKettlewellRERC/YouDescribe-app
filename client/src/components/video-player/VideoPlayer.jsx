import React, { Component } from 'react';
import { Howl } from 'howler';
// import myYouTube from './myYouTube.jsx';

class VideoPlayer extends Component {

  componentDidMount() {
    // data need to reverse sorted by time
    const testData = [
      {
        time: 10,
        url: 'http://www.kozco.com/tech/piano2.wav',
        type: 'extends',
      }, {
        time: 20,
        url: 'http://www.kozco.com/tech/piano2.wav',
        type: 'inline',
      }, {
        time: 25,
        url: 'http://www.kozco.com/tech/piano2.wav',
        type: 'extends',
      },
    ];

    const timeArr = [10, 20, 25];

    const arr = [
      'http://www.ee.columbia.edu/~dpwe/sounds/music/mambo_no_5-lou_bega.wav',
      'http://www.ee.columbia.edu/~dpwe/sounds/music/temple_of_love-sisters_of_mercy.wav',
      'http://www.ee.columbia.edu/~dpwe/sounds/music/beautiful_life-ace_of_base.wav',
      'http://www.kozco.com/tech/piano2.wav',
      'http://www.brainybetty.com/FacebookFans/Feb112010/ChillingMusic.wav',
      'http://www.ee.columbia.edu/~dpwe/sounds/music/dont_speak-no_doubt.wav',
      'http://www.ee.columbia.edu/~dpwe/sounds/music/around_the_world-atc.wav',
    ];

    let i = 0;

    arr.forEach((url) => {
      const sound = new Howl({ src: [url], html5: true, autoplay: false, onload: letplay });
    });

    function nextNumber(time, arr) {
      for (let i = 0; i < arr.length; i += 1) {
        if (time < arr[i]) return i;
      }

      return -1;
    }

    function letplay() {
      if (i < arr.length - 1) {
        i += 1;
        console.log('how many video loaded ', i);
      } else {
        console.log('every video is loaded');

        const player = new YT.Player('player', {
          height: '315px',
          width: '560px',
          videoId: 'JW5meKfy3fY',
          events: {
            onReady: onPlayerReady
          }
        });

        function onPlayerReady() {
          let previousTime = 0;
          let time;
          let i = 0;
          const n = setInterval(() => {
            time = player.getCurrentTime();
            // console.log(time);

            if (Math.abs(time - previousTime) > 0.15) {
              i = nextNumber(time, timeArr);
              console.log('next number is ', i);
            }

            previousTime = time;

            let timedEvent;
            if (testData[i]) {
              timedEvent = Number(testData[i].time);
            } else {
              timedEvent = Infinity;
            }

            if (time > timedEvent) {
              if (testData[i].type === 'inline') {
                console.log('this is an inline audio');
                playSound(testData[i].url, time);
              } else {
                console.log('this is an extends audio');
                // pause the youtube video
                player.pauseVideo();
                playSound(testData[i].url, time, () => {
                  // when the audio ended, let the player go back to playing
                  console.log('the audio ended');
                  player.playVideo();
                });
              }
              i += 1;
            }

            if (time > 30) {
              player.stopVideo();
              clearInterval(n);
            }
          }, 10);
        }
      }
    }

    function playSound(url, time, callback = () => {}) {
      const arr = [];
      arr.push(url);
      const audio = new Howl({
        src: arr,
        html5: true,
        onend: () => {
          callback();
        },
      });

      audio.play();
      console.log('PLAYING VIDEO at: ', arr[0]);
      console.log('the audio is played at: ', time);
    }
  }

  render() {
    return (
      <div id="video" className="w3-card-2">
        <div className="w3-center">
          <div id="player" />
        </div>
      </div>
    );
  }
}

export default VideoPlayer;
