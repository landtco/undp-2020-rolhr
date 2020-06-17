// requirements
detector = require('Utilities/detector');


/*
* Event Type Functions
* version 1.3
* @param {string} t general event type string
* @param {string} e exception event type string to block
*/
var et = function(t,e) {

	var clickArray = ['c','click','mousedown','down','touchstart'];
	var releaseArray = ['r','release','up','mouseup','touchend'];
	var moveArray = ['m','move','mousemove','touchmove','drag'];
	var overArray = ['over','mouseover'];
	var outArray = ['out','mouseout'];
	var wheelArray = ['scroll','wheel'];
	var eventType = '';

	if (clickArray.indexOf(t) > -1) {
		eventType = (detector.isTablet) ? 'touchstart' : eventType;
		eventType = (detector.msPointerEnabled) ? 'MSPointerDown' : eventType;
		eventType = (detector.pointerEnabled) ? 'pointerdown' : eventType;
		eventType = (detector.isPcChromeTouch) ? 'touchstart mousedown' : eventType;
		eventType = (!eventType) ? 'mousedown' : eventType;
	}
	if (releaseArray.indexOf(t) > -1) {
		eventType = (detector.isTablet) ? 'touchend' : eventType;
		eventType = (detector.msPointerEnabled) ? 'MSPointerUp' : eventType;
		eventType = (detector.pointerEnabled) ? 'pointerup' : eventType;
		eventType = (detector.isPcChromeTouch) ? 'touchend mouseup' : eventType;
		eventType = (!eventType) ? 'mouseup' : eventType;
	}
	if (moveArray.indexOf(t) > -1) {
		eventType = (detector.isTablet) ? 'touchmove' : eventType;
		eventType = (detector.msPointerEnabled) ? 'MSPointerMove' : eventType;
		eventType = (detector.pointerEnabled) ? 'pointermove' : eventType;
		eventType = (detector.isPcChromeTouch) ? 'touchmove mousemove' : eventType;
		eventType = (!eventType) ? 'mousemove' : eventType;
	}
	if (overArray.indexOf(t) > -1) {
		eventType = (detector.msPointerEnabled) ? 'MSPointerOver' : eventType;
		eventType = (detector.pointerEnabled) ? 'pointerover' : eventType;
		eventType = (!eventType) ? 'mouseover' : eventType;
	}
	if (outArray.indexOf(t) > -1) {
		eventType = (detector.msPointerEnabled) ? 'MSPointerOut' : eventType;
		eventType = (detector.pointerEnabled) ? 'pointerout' : eventType;
		eventType = (!eventType) ? 'mouseout' : eventType;
	}
	if (wheelArray.indexOf(t) > -1) {
		eventType = 'mousewheel';
		eventType = (detector.browser.toLowerCase() == 'firefox') ? 'DOMMouseScroll' : eventType;
	}

	if (e) {
		eventType =eventType.replace(e,'');
		eventType =eventType.replace(' ','');
	}

	if (eventType) return eventType;
	alert('Please pass et() a paramater it can use.');
};


// export
module.exports = et;