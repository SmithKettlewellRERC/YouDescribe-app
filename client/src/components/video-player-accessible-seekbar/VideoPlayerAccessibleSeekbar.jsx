import React, { Component } from 'react';

class Slider extends Component {
  constructor(props) {
    super(props);
    // globals
    this.gDragging = '';
    this.gDragOffset = 0;
    //
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
    // this.updateValueIndicator = this.updateValueIndicator.bind(this);
    this.setHandlers = this.setHandlers.bind(this);
    this.cancelEvent = this.cancelEvent.bind(this);
    this.init = this.init.bind(this);
  }

  componentDidMount() {
    // console.log('INIT', this.init());
    this.init();
  }

  $(id) {
    return document.getElementById(id);
  }

  // get the ratio between the slider length and the slider's value maximum
  calibrate(target) {
    const rail = target.parentNode;
    const sliderLength = rail.clientWidth - target.clientWidth;
    const max = parseInt(target.getAttribute('aria-valuemax'));
    return sliderLength / max;
  }

  // get the left offset of the rail, needed for conversion of mouse coordinates
  getHOffset(elem) {
    let node = elem;
    let offset = node.offsetLeft;
    while (node.offsetParent) {
      node = node.offsetParent;
      if (node.nodeName.toLowerCase() != "html") {
        offset += node.offsetLeft;
      }
    }
    return offset;
  }

  getHScrollOffset() {
    let scrollOffset;
    if (window.pageLeft !== undefined) {
      scrollOffset = window.pageLeft;
    } else if (document.documentElement && document.documentElement.scrollLeft !== undefined) {
      scrollOffset = document.documentElement.scrollLeft;
    } else if (document.body.scrollLeft !== undefined) {
      scrollOffset = document.body.scrollLeft;
    }
    return scrollOffset;
  }

  handleKeyDown(event = window.event) {
    const keyCode = event.keyCode || event.charCode;
    const target = event.target || event.srcElement;
    let passThrough = true;
    switch (keyCode) {
      case 37: // left arrow
        this.decrement(target, false);
        passThrough = false;
        break;
      case 39: // right arrow
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

  handleRailMouseDown(event = window.event) {
    const target = event.target || event.srcElement;
    const thumb = this.$(target.id.replace(/rail/, 'thumb1'));
    const newPos = event.clientX - this.getHOffset(target) + this.getHScrollOffset() - (thumb.clientWidth / 2);
    this.changeValue(thumb, this.mapPositionToValue(thumb, newPos));
    if (!document.activeElement || !document.activeElement !== thumb) {
      thumb.focus();
    }
    return false;
  }

  handleThumbMouseDown(event = window.event) {
    const target = event.target || event.srcElement;
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

  handleDrag(event = window.event) {
    if (this.gDragging === '') {
      return;
    } else {
      const target = this.$(this.gDragging);
      const newPos = event.clientX - this.getHOffset(target.parentNode) + this.getHScrollOffset() - this.gDragOffset;
      this.changeValue(target, this.mapPositionToValue(target, newPos));
    }
  }

  stopDrag(event) {
    this.gDragging = '';
    this.gDragOffset = 0;

    document.onmousemove = null;
    document.onmouseup = null;
  }

  mapPositionToValue(target, pos) {
    return Math.round(pos / this.calibrate(target));
  }

  increment(target, byChunk) {
    let newValue = parseInt(target.getAttribute('aria-valuenow')) + (byChunk
      ? 10
      : 1);

    this.changeValue(target, newValue);
  }

  decrement(target, byChunk) {
    let newValue = parseInt(target.getAttribute('aria-valuenow')) - (byChunk
      ? 10
      : 1);
    this.changeValue(target, newValue);
  }

  changeValue(target, value) {
    // console.log('SEEKBAR TARGET', target);
    const ratio = this.calibrate(target);
    // console.log(target.getAttribute('aria-valuemin'), target.getAttribute('aria-valuemax'));
    const min = parseInt(target.getAttribute('aria-valuemin'));
    const max = parseInt(target.getAttribute('aria-valuemax'));
    // console.log(min, max);
    const newValue = Math.min(Math.max(value, min), max);
    const newPos = Math.round(newValue * ratio);
    target.style.left = newPos - 6 + "px";

    target.setAttribute('aria-valuenow', newValue);
    target.setAttribute('aria-valuetext', newValue + "%");
    // this.updateValueIndicator(target.id.replace(/Thumb/, 'Value'), newValue + "%");
    // this.setState({ videoPlayerAccessibilitySeekbarValue: newValue })
    this.props.resetPlayedAudioClips();
    this.props.videoPlayer.seekTo((newValue / 100) * this.props.videoDurationInSeconds);
  }

  // updateValueIndicator(id, value) {
  // 	let elem = this.$(id);
  // 	elem.replaceChild(document.createTextNode(value), elem.firstChild);
  // }

  setHandlers(slider) {
    slider.parentNode.onmousedown = this.handleRailMouseDown;
    slider.onmousedown = this.handleThumbMouseDown;
    slider.onkeydown = this.handleKeyDown;

    slider.parentNode.onfocus = function (event) { // temp IE fix
      event = event || window.event;
      const target = event.target || event.srcElement;
      const thumb = this.$(target.id.replace(/Rail/, 'Thumb'));
      if (thumb) thumb.focus();
    };
  }

  cancelEvent(event) {
    if (typeof event.stopPropagation === "function") {
      event.stopPropagation();
    } else if (typeof event.cancelBubble !== "undefined") {
      event.cancelBubble = true;
    }
    if (event.preventDefault) {
      event.preventDefault();
    }
    return false;
  }

  init() {
    this.setHandlers(this.$('seekbar-slider-thumb1'));
  }

  render() {
    return (
      <div className="seekbar" title="video seekbar">
        <div id="seekbar-slider-rail" className="seekbar-slider-rail floatLeft">
          <button
            className="seekbar-slider-thumb"
            id="seekbar-slider-thumb1"
            role="slider"
            aria-labelledby="sliderLabel"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow="0"
            aria-valuetext="0%"
            accessKey="j"
            style={{ left: `calc(${this.props.videoPlayerAccessibilitySeekbarValue * 100}% - 6px)` }}
          />
        </div>
      </div>
    );
  }
}

export default Slider;
