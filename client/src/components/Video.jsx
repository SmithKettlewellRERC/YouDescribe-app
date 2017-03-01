import React, {Component} from 'react';
// import myYouTube from './myYouTube.jsx';

class Video extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		// console.log('componentDidmount');

		let player = new YT.Player('player', {
			height: '390',
			width: '640',
			videoId: 'JW5meKfy3fY',
			events: {
				'onReady': onPlayerReady
			}
		});

		function onPlayerReady() {
			player.seekTo(110);
			let time;
			let n = setInterval(function(){
				time = player.getCurrentTime();
				console.log(time);

				if (time > 120.040 && time < 120.050) {
					console.log('do this at 120.040');
				}

				if (time > 120.060 && time < 120.070 ) {
					console.log('do this at 120.060');
				}
           
				if (time > 120.080) {
					console.log('do this at 120.080');
					player.stopVideo();
					clearInterval(n);
				}
			}, 10); 
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