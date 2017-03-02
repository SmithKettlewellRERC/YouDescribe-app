import React, {Component} from 'react';
// import myYouTube from './myYouTube.jsx';

class Video extends Component {
	constructor(props) {
		super(props);

	}

	componentDidMount() {
		//data need to reverse sorted by time so that time will go from
		//bigger to smaller, which mean the first videos are at the end 
		//of the array

		let testData = [
			{time: 120.040, url: 'http://www.kozco.com/tech/piano2.wav'},
			{time: 125, url: 'http://www.brainybetty.com/FacebookFans/Feb112010/ChillingMusic.wav'}
		];

		let player = new YT.Player('player', {
			height: '390',
			width: '640',
			videoId: 'JW5meKfy3fY',
			events: {
				'onReady': onPlayerReady
			}
		});

		function onPlayerReady() {
			player.seekTo(116);
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
			

				if (time > 128) {
					player.stopVideo();
					clearInterval(n);
				}
			}, 10); 
		}

		// function to play video with url input
		function playSound(url, time) {
			let audio = new Audio(url);
			audio.play();
			console.log('PLAYING VIDEO XXXXXxxxXXXXXXXXXXXXXXXX');
			console.log('the video is played at: ',time);
		}
	}

	render() {
		return (
		<div>
				<div>Video Component</div>
				<div id="player">replace</div>
		</div>
		);
	}
}

export default Video;