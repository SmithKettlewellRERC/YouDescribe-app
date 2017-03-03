
import React, {Component} from 'react';
import { Howl } from 'howler';
// import myYouTube from './myYouTube.jsx';

class VideoPlayer extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		//data need to reverse sorted by time so that time will go from
		//bigger to smaller, which mean the first videos are at the end 
		//of the array

		let testData = [
			{time: 10, url: 'http://www.kozco.com/tech/piano2.wav'},
			{time: 20, url: 'http://www.ee.columbia.edu/~dpwe/sounds/music/temple_of_love-sisters_of_mercy.wav'}
		];

		let arr = [
			'http://www.ee.columbia.edu/~dpwe/sounds/music/mambo_no_5-lou_bega.wav',
			'http://www.ee.columbia.edu/~dpwe/sounds/music/temple_of_love-sisters_of_mercy.wav',
			'http://www.ee.columbia.edu/~dpwe/sounds/music/beautiful_life-ace_of_base.wav',
			'http://www.kozco.com/tech/piano2.wav',
			'http://www.brainybetty.com/FacebookFans/Feb112010/ChillingMusic.wav',
			'http://www.ee.columbia.edu/~dpwe/sounds/music/dont_speak-no_doubt.wav',
			'http://www.ee.columbia.edu/~dpwe/sounds/music/around_the_world-atc.wav'
		];

		let i = 0; 

		arr.forEach( (url) => {
			let sound = new Howl({
				src: [url],
				html5: true,
				autoplay: false,
				onload: letplay
			});
		});

		function letplay() {
			if (i < arr.length - 1) {
				i+=1;
				console.log('how many video loaded ', i);
			} else {
				console.log('every video is loaded')

				let player = new YT.Player('player', {
					height: '390',
					width: '640',
					videoId: 'JW5meKfy3fY',
					events: {
						'onReady': onPlayerReady
					}
				});

				function onPlayerReady() {
					let time;
					let i = 0;
					let n = setInterval(function(){
						time = player.getCurrentTime();
						// console.log(time);
						let timedEvent;

						if (testData[i]) {
							timedEvent = Number(testData[i].time);
						} else {
							timedEvent = Infinity;
						}

						if (time > timedEvent) {
							playSound(testData[i].url, time);
							i = i + 1;
						}
					

						if (time > 30) {
							player.stopVideo();
							clearInterval(n);
						}
					}, 10);
				}
			}
		}

		function playSound(url, time) {
			let arr = [];
			arr.push(url);
			let audio = new Howl({
				src: arr,
				html5: true
			});

			audio.play();
			console.log(arr);
			console.log('PLAYING VIDEO XXXXXxxxXXXXXXXXXXXXXXXX');
			console.log('the audio is played at: ',time);
		}
	}

	render() {
		return (
		<div>:
			<div>Video Component</div>
			<div id="player">replace</div>
		</div>
		);
	}
}

export default VideoPlayer;