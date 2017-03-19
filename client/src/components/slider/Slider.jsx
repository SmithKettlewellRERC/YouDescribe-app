import React, { Component } from 'react';
// const noUiSlider = require('nouislider');

class Slider extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
      console.log('componentDidMount')
      const slider = document.getElementById('slider');
      console.log(slider);
      noUiSlider.create(slider, {
        start: 50,
        connect: true,
        range: {
          min: 0,
          max: 100,
        },
      });

      slider.noUiSlider.on('change', function(){
	      let newVolumeValue = slider.noUiSlider.get();
        console.log(newVolumeValue);
      });
  }

  render() {
    return (
      <div id="slider"></div>
    );
  }
}

export default Slider;
