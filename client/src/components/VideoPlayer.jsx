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
			{time: 120.040, url: 'http://www.kozco.com/tech/piano2.wav'},
			{time: 125, url: 'http://www.ee.columbia.edu/~dpwe/sounds/music/temple_of_love-sisters_of_mercy.wav'}
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

		let time = 0;


		let sound = new Howl({
			src: [			'http://www.ee.columbia.edu/~dpwe/sounds/music/temple_of_love-sisters_of_mercy.wav'],
			html5: true,
			autoplay: false,
			onload: letplay
		});

		sound.play();

		let n = setInterval( function () {
			console.log(time += 0.1);
			console.log('the state of audio is ',sound.state());
			console.log('buffered time is ', sound.buffered.end(0));
		}, 100)

		function letplay(){
			console.log('video is loaded')
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