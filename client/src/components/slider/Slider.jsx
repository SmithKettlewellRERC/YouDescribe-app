import React from 'react';

const Slider = (props) => {
    /**
   * This is a 'bare minimum' slider, create purely for the purpose of demonstrating the application of ARIA.
   * This code is not recommended, as it does not provide a flexible approach to managing sliders, does not scale well and has very limited features
   * It's recommended to use the officisl TPG Slider code instead (link will follow later)
   */

  // globals
  var gDragging = "";
  var gDragOffset = 0;

  function $(id) {
  	return document.getElementById(id);
  }

  //get the ratio between the slider length and the slider's value maximum
  function calibrate(target) {
    var rail = target.parentNode;
  	var sliderLength = rail.clientWidth - target.clientWidth;
  	var max = parseInt(target.getAttribute('aria-valuemax'));
  	return sliderLength / max;
  }

  //get the left offset of the rail, needed for conversion of mouse coordinates
  function getHOffset(elem) {
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

  function getHScrollOffset() {
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

  function handleKeyDown(event) {
      var event = event || window.event;
  	var keyCode = event.keyCode || event.charCode;
  	var target = event.target || event.srcElement;
  	var passThrough = true;
  	switch (keyCode) {
  		case 37: // left arrow
  			decrement(target, false);
  			passThrough = false;
  		break;
  		case 39: //right arrow
  			increment(target, false);

  			passThrough = false;
  		break;
  		case 33: // page up
  			increment(target, true);
  			passThrough = false;
  		break;
  		case 34: // page down
  			decrement(target, true);
  			passThrough = false;
  		break;
  		case 36: // home
  			changeValue(target, 0);
  			passThrough = false;
  		break;
  		case 35: // end
  			changeValue(target, 100);
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
          return cancelEvent(event);
      }
  }

  function handleRailMouseDown(event) {
  	event = event || window.event;
  	var target = event.target || event.srcElement;
  	var thumb = $(target.id.replace(/Rail/, 'Thumb'));
  	var newPos = event.clientX - getHOffset(target)+ getHScrollOffset() - (thumb.clientWidth / 2);
  	changeValue(thumb, mapPositionToValue(thumb, newPos));
  	if (!document.activeElement || !document.activeElement !== thumb) {
  		thumb.focus();
  	}
  	return false;
  }

  function handleThumbMouseDown(event) {
  	event = event || window.event;
  	var target = event.target || event.srcElement;
  	gDragging = target.id;
  	gDragOffset = event.clientX - getHOffset(target.parentNode) - target.offsetLeft + getHScrollOffset();
  	document.onmousemove = handleDrag;
  	document.onmouseup = stopDrag;
  	if (!document.activeElement || document.activeElement !== target) {
  		target.focus();
  	}
  	cancelEvent(event);
  	return false;
  }

  function handleDrag(event) {
  	event = event || window.event;
  	if (gDragging === "") {
  		return;
  	}
  	else {
  		var target = $(gDragging);
  		var newPos = event.clientX - getHOffset(target.parentNode) + getHScrollOffset() - gDragOffset;
  		changeValue(target, mapPositionToValue(target, newPos));
  	}
  }

  function stopDrag(event) {
  	gDragging = "";
  	gDragOffset = 0;

  	document.onmousemove = null;
  	document.onmouseup = null;
  }

  function mapPositionToValue(target, pos) {
  	return Math.round(pos / calibrate(target));
  }

  function increment(target, byChunk) {

      var newValue = parseInt(target.getAttribute('aria-valuenow')) + (byChunk ? 10 : 1);

      changeValue(target, newValue);
  }

  function decrement(target, byChunk) {
  	var newValue = parseInt(target.getAttribute('aria-valuenow')) - (byChunk ? 10 : 1);
  	changeValue(target, newValue);
  }

  function changeValue(target, value) {
  	var ratio = calibrate(target);
  	var min = parseInt(target.getAttribute('aria-valuemin'));
  	var max = parseInt(target.getAttribute('aria-valuemax'));
  	var newValue = Math.min(Math.max(value, min), max);
  	var newPos = Math.round(newValue * ratio);
  	target.style.left = newPos + "px";

  	target.setAttribute('aria-valuenow', newValue);
  	target.setAttribute('aria-valuetext', newValue + "%");
  	updateValueIndicator(target.id.replace(/Thumb/, 'Value'), newValue + "%");
    props.updateState({ sliderValue: newValue });
  }

  function updateValueIndicator(id, value) {
  	var elem = $(id);
  	elem.replaceChild(document.createTextNode(value), elem.firstChild);
  }

  function setHandlers(slider) {
  	slider.parentNode.onmousedown 	= handleRailMouseDown;
  	slider.onmousedown 	= handleThumbMouseDown;
  	slider.onkeydown 	= handleKeyDown;

  	slider.parentNode.onfocus = function(event) { //temp IE fix
  		event = event || window.event;
  		var target = event.target || event.srcElement;
  		var thumb = $(target.id.replace(/Rail/, 'Thumb'));
  		if (thumb)
  			thumb.focus();
  	}
  }

  function cancelEvent(event) {
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

  function init() {
  	setHandlers($('sliderThumb1'));
  }
  window.onload = init;

  return (
    <div>
      <div className="clearfix">
      	<span id="sliderLabel" className="floatLeft">Volume:</span>
      	<div id="sliderRail1" className="sliderRail floatLeft">
      		<button className="sliderThumb" id="sliderThumb1" role="slider" aria-labelledby="sliderLabel" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-valuetext="50%"></button>
      	</div>
      	<span id="sliderValue1"className="floatLeft">
      		50%
      	</span>
      </div>

    </div>
  );
};

export default Slider;
