import React, {Component} from 'react';
// import myYouTube from './myYouTube.jsx';

class Video extends Component {
	constructor(props) {
		super(props);
		this.testData = [
			{time: 120.25, url: 'url'},
			{time: 150.85, url: 'url2'}
		];
	}

	componentDidMount() {
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

				if (time > 120.040 && time < 120.050) {
					console.log('do this at 120.040');

					//play this audio when it get to 120.040
					// playSound('http://www.kozco.com/tech/piano2.wav');
					const play = function() {
						playSound('http://www.kozco.com/tech/piano2.wav', time);
						
					};

					play();
				}

				if (time > 120.060 && time < 120.070 ) {
					console.log('do this at 120.060');

				}
           
				if (time > 140) {
					console.log('do this at 121');
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