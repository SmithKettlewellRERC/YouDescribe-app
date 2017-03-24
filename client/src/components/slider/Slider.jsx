import React, { Component } from 'react';

class Slider extends Component {
  constructor(props) {
    super(props);
    // globals
    this.gDragging = '';
    this.gDragOffset = 0;

    this.$ = this.$.bind(this);
    this.calibrate = this.calibrate.bind(this);
    this.getHOffset = this.getHOffset.bind(this);
    this.getHScrollOffset = this.getHScrollOffset.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleRailMouseDown = this.handleRailMouseDown.bind(this);
    this.handleThumbMouseDown = this.handleThumbMouseDown.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
    this.mapPositionToValue = this.mapPositionToValue.bind(this);
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.updateValueIndicator = this.updateValueIndicator.bind(this);
    this.setHandlers = this.setHandlers.bind(this);
    this.cancelEvent = this.cancelEvent.bind(this);
    this.init = this.init.bind(this);
  }

  componentDidMount() {
    console.log('INIT', this.init());
    this.init();
  }

  $(id) {
  	return document.getElementById(id);
  }

  //get the ratio between the slider length and the slider's value maximum
  calibrate(target) {
  	var rail = target.parentNode;
  	var sliderLength = rail.clientWidth - target.clientWidth;
  	var max = parseInt(target.getAttribute('aria-valuemax'));
  	return sliderLength / max;
  }

  //get the left offset of the rail, needed for conversion of mouse coordinates
  getHOffset(elem) {
  	var node = elem;
  	var offset = node.offsetLeft;
  		while(node.offsetParent) {
  			node = node.offsetParent;
  			if (node.nodeName.toLowerCase() != "html") {
  				offset += node.offsetLeft;
  			}
  		}
  	return offset;
  }

  getHScrollOffset() {
  	var scrollOffset
  	if (window.pageLeft !== undefined) {
  			scrollOffset = window.pageLeft;
  	}
  	else if (document.documentElement && document.documentElement.scrollLeft !== undefined) {
  		scrollOffset = document.documentElement.scrollLeft;
  	}
  	else if (document.body.scrollLeft !== undefined) {
  		scrollOffset = document.body.scrollLeft;
  	}
  	return scrollOffset;
  }

  handleKeyDown(event) {
    var event = event || window.event;
  	var keyCode = event.keyCode || event.charCode;
  	var target = event.target || event.srcElement;
  	var passThrough = true;
  	switch (keyCode) {
  		case 37: // left arrow
  			this.decrement(target, false);
  			passThrough = false;
  		break;
  		case 39: //right arrow
  			this.increment(target, false);

  			passThrough = false;
  		break;
  		case 33: // page up
  			this.increment(target, true);
  			passThrough = false;
  		break;
  		case 34: // page down
  			this.decrement(target, true);
  			passThrough = false;
  		break;
  		case 36: // home
  			this.changeValue(target, 0);
  			passThrough = false;
  		break;
  		case 35: // end
  			this.changeValue(target, 100);
  			passThrough = false;
  		break;
  		case 27: // escape
  			target.blur();
  			passThrough = false;
  		break;
  		default:
  			passThrough = true;
  		break;
  	}
      if (!passThrough) {
          return this.cancelEvent(event);
      }
  }

  handleRailMouseDown(event) {
  	event = event || window.event;
  	var target = event.target || event.srcElement;
  	var thumb = this.$(target.id.replace(/Rail/, 'Thumb'));
  	var newPos = event.clientX - this.getHOffset(target)+ this.getHScrollOffset() - (thumb.clientWidth / 2);
  	this.changeValue(thumb, this.mapPositionToValue(thumb, newPos));
  	if (!document.activeElement || !document.activeElement !== thumb) {
  		thumb.focus();
  	}
  	return false;
  }

  handleThumbMouseDown(event) {
  	event = event || window.event;
  	var target = event.target || event.srcElement;
  	this.gDragging = target.id;
  	this.gDragOffset = event.clientX - this.getHOffset(target.parentNode) - target.offsetLeft + this.getHScrollOffset();
  	document.onmousemove = this.handleDrag;
  	document.onmouseup = this.stopDrag;
  	if (!document.activeElement || document.activeElement !== target) {
  		target.focus();
  	}
  	this.cancelEvent(event);
  	return false;
  }

  handleDrag(event) {
  	event = event || window.event;
  	if (this.gDragging === "") {
  		return;
  	}
  	else {
  		var target = this.$(this.gDragging);
  		var newPos = event.clientX - this.getHOffset(target.parentNode) + this.getHScrollOffset() - this.gDragOffset;
  		this.changeValue(target, this.mapPositionToValue(target, newPos));
  	}
  }

  stopDrag(event) {
  	this.gDragging = "";
  	this.gDragOffset = 0;

  	document.onmousemove = null;
  	document.onmouseup = null;
  }

  mapPositionToValue(target, pos) {
  	return Math.round(pos / this.calibrate(target));
  }

  increment(target, byChunk) {

      var newValue = parseInt(target.getAttribute('aria-valuenow')) + (byChunk ? 10 : 1);

      this.changeValue(target, newValue);
  }

  decrement(target, byChunk) {
  	var newValue = parseInt(target.getAttribute('aria-valuenow')) - (byChunk ? 10 : 1);
  	this.changeValue(target, newValue);
  }

  changeValue(target, value) {
  	var ratio = this.calibrate(target);
  	var min = parseInt(target.getAttribute('aria-valuemin'));
  	var max = parseInt(target.getAttribute('aria-valuemax'));
  	var newValue = Math.min(Math.max(value, min), max);
  	var newPos = Math.round(newValue * ratio);
  	target.style.left = newPos + "px";

  	target.setAttribute('aria-valuenow', newValue);
  	target.setAttribute('aria-valuetext', newValue + "%");
  	this.updateValueIndicator(target.id.replace(/Thumb/, 'Value'), newValue + "%");
    this.props.updateState({ sliderValue: newValue });
  }

  updateValueIndicator(id, value) {
  	var elem = this.$(id);
  	elem.replaceChild(document.createTextNode(value), elem.firstChild);
  }

  setHandlers(slider) {
  	slider.parentNode.onmousedown = this.handleRailMouseDown;
  	slider.onmousedown 	= this.handleThumbMouseDown;
  	slider.onkeydown 	= this.handleKeyDown;

  	slider.parentNode.onfocus = function(event) { //temp IE fix
  		event = event || window.event;
  		var target = event.target || event.srcElement;
  		var thumb = this.$(target.id.replace(/Rail/, 'Thumb'));
  		if (thumb)
  			thumb.focus();
  	}
  }

  cancelEvent(event) {
  	if (typeof event.stopPropagation == "function") {
  		event.stopPropagation();
  	}
  	else if (typeof event.cancelBubble != "undefined") {
  		event.cancelBubble = true;
  	}
  	if (event.preventDefault) {
  		event.preventDefault();
  	}
  	return false;
  }

  init() {
  	this.setHandlers(this.$('sliderThumb1'));
  }

  render() {
    return (
      <div>
        <div className="clearfix">
          <span id="sliderLabel" className="floatLeft">Volume:</span>
          <div id="sliderRail1" className="sliderRail floatLeft">
            <button className="sliderThumb" id="sliderThumb1" role="slider" aria-labelledby="sliderLabel" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-valuetext="50%" accessKey="v"></button>
          </div>
          <span id="sliderValue1"className="floatLeft">
            50%
          </span>
        </div>
      </div>
    );
  }
}

export default Slider;
