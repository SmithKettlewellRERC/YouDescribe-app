import React, {Component} from 'react';
// import myYouTube from './myYouTube.jsx';

class Video extends Component {
	constructor(props) {
		super(props);

		//data need to sorted by time first 
	}

	componentDidMount() {
		let testData = [
			{time: 120.25, url: 'http://www.kozco.com/tech/piano2.wav'},
			{time: 150.85, url: 'http://www.brainybetty.com/FacebookFans/Feb112010/ChillingMusic.wav'}
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
			let n = setInterval(function(){
				time = player.getCurrentTime();
				console.log(time);
			
				let play = function() {
					console.log(testData);

					playSound(testData[0].url, time);
				};

				let play2 = function() {
					console.log(testData);

					playSound(testData[1].url, time);
				}; 

				if (time > 120.040 && time < 120.050) {
					console.log('do this at 120.040');

					//play this audio when it get to 120.040
					// playSound('http://www.kozco.com/tech/piano2.wav');
					play();
				}

				if (time > 125 && time < 126) {
					console.log('do this at 120.060');

					//play this audio when it get to 120.040
					// playSound('http://www.kozco.com/tech/piano2.wav');

					play2();

				}
           
				if (time > 132) {
					console.log('do this at 132');
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