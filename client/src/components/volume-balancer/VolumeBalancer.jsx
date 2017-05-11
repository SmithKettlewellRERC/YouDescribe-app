import React, {Component} from 'react';

class VolumeBalancer extends Component {
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
    // this.updateValueIndicator = this.updateValueIndicator.bind(this);
    this.setHandlers = this.setHandlers.bind(this);
    this.cancelEvent = this.cancelEvent.bind(this);
    this.init = this.init.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  $(id) {
    return document.getElementById(id);
  }

  // get the ratio between the slider length and the slider's value maximum
  calibrate(target) {
    const rail = target.parentNode;
    const sliderLength = rail.clientWidth - target.clientWidth;
    const max = parseInt(target.getAttribute('aria-valuemax')) + 10;

    return sliderLength / max;
  }

  // get the left offset of the rail, needed for conversion of mouse coordinates
  getHOffset(elem) {
    let node = elem;
    let offset = node.offsetLeft;
    while (node.offsetParent) {
      node = node.offsetParent;
      if (node.nodeName.toLowerCase() !== 'html') {
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

  handleKeyDown(event) {
    var event = event || window.event;
    let keyCode = event.keyCode || event.charCode;
    let target = event.target || event.srcElement;
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
        this.changeValue(target, 10);
        passThrough = false;
        break;
      case 35: // end
        this.changeValue(target, 90);
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
    const thumb = this.$(target.id.replace(/Rail/, 'Thumb'));
    const newPos = (event.clientX - this.getHOffset(target)) +
      (this.getHScrollOffset() - (thumb.clientWidth / 2));

    this.changeValue(thumb, this.mapPositionToValue(thumb, newPos));
    if (!document.activeElement || !document.activeElement !== thumb) {
      thumb.focus();
    }
    return false;
  }

  handleThumbMouseDown(event = window.event) {
    const target = event.target || event.srcElement;

    this.gDragging = target.id;
    this.gDragOffset = (event.clientX - this.getHOffset(target.parentNode)) -
      (target.offsetLeft + this.getHScrollOffset());
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
      const newPos = (event.clientX - this.getHOffset(target.parentNode)) +
        (this.getHScrollOffset() - this.gDragOffset);
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
    const newValue = parseInt(target.getAttribute('aria-valuenow')) +
      (byChunk ? 8 : 1);

    this.changeValue(target, newValue);
  }

  decrement(target, byChunk) {
    const newValue = parseInt(target.getAttribute('aria-valuenow')) -
      (byChunk ? 8 : 1);

    this.changeValue(target, newValue);
  }

  changeValue(target, value) {
    const ratio = this.calibrate(target);
    const min = parseInt(target.getAttribute('aria-valuemin'));
    const max = parseInt(target.getAttribute('aria-valuemax'));
    const newValue = Math.min(Math.max(value, min), max);
    const newPos = Math.round(newValue * ratio);

    target.style.left = newPos + 'px';

    target.setAttribute('aria-valuenow', newValue);
    target.setAttribute('aria-valuetext', newValue + '%');
    // this.updateValueIndicator(target.id.replace(/Thumb/, 'Value'), newValue + "%");
    this.props.updateState({ balancerValue: newValue });
  }

  // updateValueIndicator(id, value) {
  // 	let elem = this.$(id);
  // 	elem.replaceChild(document.createTextNode(value), elem.firstChild);
  // }

  setHandlers(slider) {
    slider.parentNode.onmousedown = this.handleRailMouseDown;
    slider.onmousedown = this.handleThumbMouseDown;
    slider.onkeydown = this.handleKeyDown;

    slider.parentNode.onfocus = function(event) { // temp IE fix
      event = event || window.event;
      let target = event.target || event.srcElement;
      let thumb = this.$(target.id.replace(/Rail/, 'Thumb'));
      if (thumb)
        thumb.focus();
      }
    }

  cancelEvent(event) {
    if (typeof event.stopPropagation === 'function') {
      event.stopPropagation();
    } else if (typeof event.cancelBubble !== 'undefined') {
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
      <div className="volume-balancer" title="volume balancer">
        <span id="sliderLabel" className="floatLeft" aria-hidden="true">V</span>
        <div id="sliderRail1" className="sliderRail floatLeft">
          <button
            className="sliderThumb"
            id="sliderThumb1"
            aria-label="video description balance"
            aria-valuemin="10"
            aria-valuemax="90"
            aria-valuenow="50"
          />
        </div>
        <span className="floatLeft" aria-hidden="true">D</span>
      </div>
    );
  }
}

export default VolumeBalancer;
