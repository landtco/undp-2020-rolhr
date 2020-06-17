// dependencies
var $ = require('jquery');
var et = require('Utilities/event_type');
var utils = require('Utilities/utils');


/*







USAGE EXAMPLE
-------------------------------


var sb = require('./modules/utilities/scroller');

window.sb3 = new sb({
	element : 'scroll_stuff',
	scrolldrag : 'scrub',
	scrolltrack : 'track',
	canresize : true
});


-------------------------------
*/

var scroller = function(params) {
	var self = this;

	var el;
	var paddingadj;
	var scrollStartPos = 0;
	var scrollStopPos = 0;
	var posSet;
	var customTrack;
	var scrollMove;
	var intervalTime = 500;
	var scrollDragActive = false;
	var yOffset;
	var scrollCheckInterval;
	var scrollDrag,scrollTrack,contentMaxScroll;


	var default_args = {
		element : null,								// jQuery object of scrollable content
		callback : null,							// Function name to be called on scroll update, pass parameter of scroll percentage
		clickdrag : false,							// Allows similar scroll area manipulation with mouse click and drag as touch and drag
		wheel : true,								// Support mouse wheel/scrollers (listens for use and updates custom scroll bars)
		intervaltime : 500,							// interval time
		scrolldrag : null,							// jQuery object of scroll drag button
		scrolldragsize : true,						// Adjust height of scroll drag to match the percentage of scroll height that is visible incontainer
		scrolltrack : null,							// jQuery object of scroll track
		canresize : false,							// content can dynamically adjust so keep checking height
		containhide : false							// option when set will hide track/scrubber if content is contained in enclosure
	};



	// Custom scrollbar functions
	//******************************************

	// Function returns mouse x,y position within supplied DOM object
	function getMouseCoord(e,jqItem,rls) {
		var offset = jqItem.offset();
		var xPos,yPos;
		if (e.originalEvent.changedTouches || e.originalEvent.touches) {
			if (e.originalEvent.changedTouches && rls) {
				xPos = e.originalEvent.changedTouches[0].pageX - offset.left;
				yPos = e.originalEvent.changedTouches[0].pageY - offset.top;
			}
			else if (e.originalEvent.touches) {
				xPos = e.originalEvent.touches[0].pageX - offset.left;
				yPos = e.originalEvent.touches[0].pageY - offset.top;
			}
		}
		else {
			if (e.pageX || e.pageY) {
				xPos = e.pageX - offset.left;
				yPos = e.pageY - offset.top;
			}
			else if (e.originalEvent.pageX || e.originalEvent.pageY) {
				xPos = e.originalEvent.pageX - offset.left;
				yPos = e.originalEvent.pageY - offset.top;
			}
		}
		return {x:xPos,y:yPos};
	}


	// Fix for issue with Chrome on Touch PC double firing events
	function chromefix(e) {
		if (e.type == 'touchmove') $('body').off('mousemove');
	}


	function updateScrollBar(p) {
		if (!scrollDragActive) {
			var sbmax = scrollTrack.height() - scrollDrag.height();
			if (p > 0.95) perc = 1;
			if (p < 0.05) perc = 0;
			scrollDrag.css({'margin-top':(p * sbmax)});
		}
	}


	function scrollWheelActive(e) {
		var delta = (e.originalEvent.wheelDelta / 10) || -(e.originalEvent.detail * 10);
		var currentPos = el.scrollTop();
		var adjPos = currentPos - delta;
		el.scrollTop(adjPos);
	}


	function scrollTrackHit(e) {

		var hitPoint = getMouseCoord(e,scrollTrack);
		contentMaxScroll = el.prop("scrollHeight") - (el.height() + paddingadj);
		el.animate({ scrollTop: ((hitPoint.y / scrollTrack.height()) * contentMaxScroll) }, 200);
	}


	function scrollIndicatorDown(e) {
		scrollDragActive = true;
		scrollDrag.off();
		e.preventDefault();
		var point = getMouseCoord(e,$(this));
		yOffset = point.y;
		point = scrollTrack.position();
		min = 0;//point.top;
		max = min + (scrollTrack.height() - scrollDrag.height());
		$('body').on(et('move'),updateScrollContent);
		$('body').on(et('release'),doneUpdateScrollContent);
	}


	function updateScrollContent(e) {
		e.preventDefault();

		// Chrome touch fix
		if (detector.isPcChromeTouch) chromefix(e);

		var pos = getMouseCoord(e,scrollTrack);
		var newPos = pos.y - yOffset;
		if (newPos < min) newPos = min;
		else if (newPos > max) newPos = max;
		scrollDrag.css({'margin-top':newPos + 'px'});
		contentMaxScroll = el.prop("scrollHeight") - (el.height() + paddingadj);
		el.scrollTop((newPos / max) * contentMaxScroll);
	}


	function doneUpdateScrollContent(e) {
		scrollDragActive = false;
		e.preventDefault();
		$('body').off();
		scrollDrag.off().on(et('click'),scrollIndicatorDown);
	}


	// Callbck for interval
	function checkScrollPosition() {
		if (options.canresize) self.resize();

		if (!scrollMove) scrollStopPos = el.scrollTop();
		var scrollPerc = Math.round((el.scrollTop() / (el[0].scrollHeight - el.height() - paddingadj)) * 100) / 100;
		//console.log(scrollPerc);
		if (options.callback) options.callback(scrollPerc);
		if (customTrack) updateScrollBar(scrollPerc);
	}


	function scrollstart(e) {
		el.off(et('click'));
		$('body').on(et('release'), scrollend);
		$('body').on(et('move'), scrollmove);
		var pos = getMouseCoord(e,el);
		scrollStartPos = pos.y;
		e.preventDefault();
	}


	function scrollmove(e) {
		e.preventDefault();

		// Chrome touch fix
		if (detector.isPcChromeTouch) chromefix(e);

		scrollMove = true;
		var pos = getMouseCoord(e,el);
		el.scrollTop(scrollStopPos + scrollStartPos - pos.y);
		
		var scrollPerc = Math.round((el.scrollTop() / (el[0].scrollHeight - el.height())) * 100) / 100;
		if ((detector.isTablet) && (!detector.isTouchPc) && (options.callback)) options.callback(scrollPerc);
		if ((detector.isTablet) && (!detector.isTouchPc) && (customTrack)) updateScrollBar(scrollPerc);
	}


	function scrollend(e) {
		scrollStopPos = el.scrollTop();
		$('body').off();
		el.on(et('click'), scrollstart);
		scrollMove = false;
	}


	function makeItWork() {
		if ((detector.isTablet) || (options.clickdrag)) {
			//alert('this');
			//el.on(et('click'), scrollstart);
		}

		//if ((!detector.isTouchDevice) || (detector.isTouchPc)) {
			//if (options.callback || customTrack) {
				scrollCheckInterval = setInterval(checkScrollPosition,options.intervaltime);
			//}
		//}

		if (options.wheel) {
			el.on(et('over'), function(e) {
				el.on(et('wheel'),scrollWheelActive);
			})

			el.on(et('out'), function(e) {
				el.off(et('wheel'),scrollWheelActive);
			})
		}

		if (customTrack) {
			scrollDrag.off().on(et('click'),scrollIndicatorDown);
			scrollTrack.off().on(et('click'),scrollTrackHit);
		}
	}



	// Public Functions
	//******************************************
	self.init = function(params) {

		// assign to object and default items if needed
		options = utils.merge_options(default_args, params)
		//console.log(options);

		el = options.element;

		// Capture scrollable div pading
		paddingadj = parseInt(el.css('padding-top').replace('px'),10) + parseInt(el.css('padding-bottom').replace('px'),10);

		// Test for valid imput
		if (((options.scrolldrag == null) && (options.scrolltrack != null)) || ((options.scrolldrag != null) && (options.scrolltrack == null))) {
			alert('ERROR - if using custom scrollbar both scrolldrag and scrolltrack are required');
		}
		if ((options.scrolldrag != null) && (options.scrolltrack != null)) {
			customTrack = true;
			options.intervaltime = 25;
			scrollDrag = options.scrolldrag;
			scrollTrack = options.scrolltrack;
			contentMaxScroll = el.prop("scrollHeight") - (el.height() + paddingadj);

			if (options.scrolldragsize) {
				var perc = el.height() / el.prop("scrollHeight");
				scrollDrag.height(perc * scrollTrack.height());
			}
		}

		// hide if to small
		if (options.containhide) {
			var perc = el.height() / el.prop("scrollHeight");
			scrollDrag.height(perc * scrollTrack.height());

			if (perc < 1) scrollTrack.css('opacity',1);
			else {
				scrollTrack.css('opacity',0);
			}
		}

		makeItWork();
	}


	self.resize= function() {
		if (options.scrolldragsize) {
			var perc = el.height() / el.prop("scrollHeight");
			scrollDrag.height(perc * scrollTrack.height());

			if (options.containhide) {
				if (perc < 1) scrollTrack.css('opacity',1);
				else {
					scrollTrack.css('opacity',0);
				}
			}
		}
	}


	self.update= function() {
		//contentMaxScroll calculation moved to where actively used so this is a bit unneeded.
		if ((options.scrolldrag != null) && (options.scrolltrack != null)) {
			contentMaxScroll = el.prop("scrollHeight") - (el.height() + paddingadj);
		}

		self.resize();
	}


	self.kill = function() {
		clearInterval(scrollCheckInterval);
	}


	self.restart = function() {
		if ((!detector.isTablet) || (detector.isTouchPc)) {
			if (options.callback || customTrack) {
				var scrollCheckInterval = setInterval(checkScrollPosition,options.intervaltime);
			}
		}
	}


	self.getvar = function(vn) {
		return eval(vn);
	}


	self.init(params);
	return self;
}


// export
module.exports = scroller;