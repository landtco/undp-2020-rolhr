/**********************************************
 Dependancies
**********************************************/

window.$ = window.jQuery = require('jquery');
var sb = require('Modules/scroller'); 
var countries = require('Modules/data'); //cargamos dinamicamente los datos de cada pais, el ID coincide con la key
var utils = require('Utilities/utils');
var mapsvg = require('Vendor/mapsvg')($); // default mapsvg




/**********************************************
 Variable Declarations
**********************************************/

var tileAnimateTime = 300;
var tile_sb;
var list_sb;
var tile_active = false;
var country_active = false;
var list_active = false;
var map;




/**********************************************
 Listeners
**********************************************/

var events = {

	// apply listener to document for cleanup
	document_listener : function() {
		$(document).on('click', function(e) { 

			// if not part of svg clicked
			// else ignore as svg map will call it's own clean up
			if (!$(e.target).closest('svg').length > 0) {
				state.close_open_content('none'); 
			}
		});
	},


	// prevents defined scrollable elements from affecting overal page scroll
	scroll_limiter : function(elements) {
		for (var i=0; i < elements.length; i++) {
			$(elements[i]).on( 'mousewheel DOMMouseScroll', function (e) { 
				var e0 = e.originalEvent;
				var delta = e0.wheelDelta || -e0.detail;
				this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
				e.preventDefault();  
			});
		}
	},


	//
	click_hide : function(elements) {
		for (var i=0; i < elements.length; i++) {
			$(elements[i]).on('click', function(e) { e.stopPropagation(); });
		}
	},


	//
	country_list : function() {
		// handle country list activation
		$('.list__btn').on('click', state.country_list);
		$('.list__container').on('click', function(e) { e.stopPropagation(); });
	},


	//
	country_li_click : function() {
		$('.country_list li').on('click', state.activate_country);
	},


	//
	tile_listener : function() {
		$('.footer .tile__inner, .footer .tile__content-close, .country_details .tile__content-close').on('click', state.tile_show);
	},


	//
	zoom_buttons : function() {
		$('#zoom_in').on('click', map.zoomIn);
		$('#zoom_out').on('click', map.zoomOut);
	},


	//
	instructions : function() {
		$('#instructions, #instructions .tile__content').on('click', function(e) {
			$('#instructions, #instructions .tile__content').off()
			$('#instructions').fadeOut(200);
		});
	},


	//
	list_scroll_btn : function() {
		$('.list__outer .icon-arrow_right_thick').on('click', function(e) {
			//alert('hi');

			var scrollHeight = $(".list__inner").height();
			var scrollPosition = $(".list__inner").scrollTop();

			$(".list__inner").animate({
			  scrollTop: scrollPosition + scrollHeight - 20
			}, 1000);
		});
	}

}



/**********************************************
 State
**********************************************/

var state = {

	//
	remove_loader : function() {},


	//
	country_list : function(e) {
		e.stopPropagation();
		var $list = $(this).closest('.list');

		if (!$list.hasClass('list--active')) {
			state.close_open_content('list');
			$list.addClass('list--active');

			// activate scrollbar
			list_sb = new sb({
				element : $('.list__inner'),
				scrolltrack : $('.list_sb'),
				scrolldrag : $('.list_scrub')
			});

			list_active = true;
		}
		else state.close_open_content('list');
	},


	// used to display category tile content
	tile_show : function(e) {
		e.stopPropagation(); 
		$this = $(this).closest('.tile');

		if (!$this.hasClass('tile--active')) {
			state.close_open_content('tile');

			$this.addClass('tile--active');
			var $content = $this.find('.tile__content');

			var curHeight = $content.height();
			console.log($(window).width() >= 700);
			var heightCheck = 'auto';
			$content.css('height', heightCheck);
			var autoHeight = $content.height();

			// activate scrollbar
			// tile_sb = new sb({
			// 	element : $content.find('.tile__content-inner'),
			// 	scrolltrack : $content.find('.content_sb'),
			// 	scrolldrag : $content.find('.content_scrub'),
			// 	containhide : true
			// });
			
			$content.height(curHeight);
			setTimeout(function() { 
				$content.addClass('tran').height(autoHeight); 
			}, 50);

			tile_active = true;
		}
		else state.close_open_content('none');

		return false;
	},


	map_country_clicked : function(e, mapsvg) {
		console.log('country clicked on');
		e.stopPropagation();
		state.country_selected(this.id);
	},


	//
	country_selected : function(id) {
		//state.country_selected_clear(false);
		state.close_open_content('country');

		var $details = $('.country_details');
		
		// update country menu list
		var fill = countries[id].active_fill;
		$('#country_list [data-country="' + id + '"]').css('color',fill).addClass('li--active');

		// show country data
		var countryName = '<span class="upper">' + id.replace(/_/g, ' ') + '</span>';
		if (countries[id].alt_title) {
			countryName = countries[id].alt_title;
		}
		$('.country_details h3').html(countryName);

		// populate bullet points
		var bullets = '';
		for (var i=0; i<countries[id].bullets.length; i++) {
			var li = '<li>' + countries[id].bullets[i] + '</li>';
			bullets += li;
		}
		$('.country_details ul').html(bullets);

		// update PDF link
		$details.find('.details_link').attr('href', countries[id].link);

		// animation and scroll bar
		var curHeight = $details.height();
		var winWidth = $(window).width();
		var heightCheck = (winWidth >= 700) ? 'auto' : $details.offset().top;
		$details.css('height', heightCheck);
		var autoHeight = $details.height();
		var bg_opacity = 0.75;
		var detailsAnimateTime = 350;

		if ((autoHeight > 390) && (winWidth >= 1000)) autoHeight = 390;
		else if ((autoHeight > 390) && (winWidth >= 960)) autoHeight = 390;
		else if ((autoHeight > 420) && (winWidth >= 1000)) autoHeight = 420;
		else if ((autoHeight > 400) && (winWidth >= 700)) {
			autoHeight = 400;
		}
		else if (winWidth < 700) {
			autoHeight = 415;
			bg_opacity = 1;
		}

		// activate scrollbar
		details_sb = new sb({
			element : $('.country_details .tile__content-inner'),
			scrolltrack : $details.find('.content_sb'),
			scrolldrag : $details.find('.content_scrub'),
			containhide : true,
		});

		$details.css('background', utils.hex_to_rgba(fill, bg_opacity));

		$details.height(curHeight).addClass('country_details--active')
		setTimeout(function() { 
			$details.addClass('tran').height(autoHeight);
			setTimeout(function() {
				details_sb.update();
			},500);
		}, 50);

		country_active = true;
	},


	//
	country_selected_clear : function(close_details) {
		close_details = utils.defPar(close_details, true);

		if ($('.li--active').length > 0) {
			$('.li--active').removeAttr('style').removeClass('li--active');
		}
		if (close_details) {
			// clear country bullet points
			$('.country_details').removeClass('country_details--active').animate({'height':0}, 400);
		}
		state.close_tile();

		console.log('disabled area of map clicked');
	},


	//
	activate_country : function(e) {
		$this = $(this);

		var country_id = $this.attr('data-country');

		var region = map.getRegion(country_id);
        var center = region.getCenter();
        console.log('Activate Country = ' + country_id);
        e.clientX = center[0];
        e.clientY = center[1];

		state.country_selected(country_id);
        map.regionClickHandler(e,region);
	},






	map_disabled_area_clicked : function() {
		//console.log('!! map disabled area clicked !!');
		state.close_open_content('map');
	},

	// contains logic as to determin what need cleared when
	close_open_content : function(active) {
		// active items 'map','tile','none','list','country'
		//console.log('*** CLOSE OPEN CONTENT ***');
		//console.log('--- active = ' + active + ' --- tile_active = ' + tile_active + ' --- list_active = ' + list_active + ' --- country_active = ' + country_active + ' ---');

		// if tile is open then close it
		if (tile_active) state.close_tile();

		// list active
		if (list_active && ($(window).width() >= 900) && (active == 'country')) {}
		else if (list_active) state.close_country_list();

		// country details clear
		if ((country_active) && (active == 'country')) {
			//console.log('only clear list, dont close country details');
			state.clear_list();
		}
		else if ((country_active) && (active != 'list')) {
			//console.log('clear list and country details')
			state.clear_country();
		}
		
		// clear country detail if opening list below 960 width
		if (active == 'list') {
			if ($(window).width() < 960) state.clear_country();
		}

		// clean up instructions
		if ($('#instructions').is(":visible")) {
			$('#instructions').fadeOut();
		}
	},

	close_country_list : function() {
		//console.log('close list');
		$('.list--active').removeClass('list--active');
		list_active = false;
	},

	close_tile : function() {
		//console.log('close tile');
		$tile = $('.tile--active');
	    $tile.find('.tile__content').height(0); 
	    setTimeout(function() {
	    	$tile.find('.tile__content').removeClass('tran');
	    },450)
	    $('.tile--active').removeClass('tile--active');
	    tile_active = false;
	},

	clear_country : function() {
		state.clear_list();
		$('.country_details').removeClass('country_details--active').height(0); 
		setTimeout(function() {
	    	$('.country_details').find('.tile__content').removeClass('tran');
	    },450)
		map.deselectAllRegions();
		country_active = false;
	},

	clear_list : function() {
		$('.li--active').removeAttr('style').removeClass('li--active');
	}
	
}



/**********************************************
 Build
**********************************************/

var build = {

	// 
	getTemplate : function(template) {
		// Get template HTML
		var template = $(template).html();

		// Change into jQuery object
		return $(template);
	},


	// build out LI elements for country list
	country_list : function() {

		for (var country in countries) {
			if (countries.hasOwnProperty(country)) {
				var $template = build.getTemplate('#tmp_country-list-li');
				var countryName = country.replace(/_/g, ' ');

				$template.attr('data-country',country);
				$template.find('.country-name').text(countryName);
				$template.find('span').css('background', countries[country].active_fill);
				$('#country_list').append($template);
			}
		}
	},


	//
	add_map : function() {


		map = $('#mapsvg').mapSvg({
			source: 'assets/images/map2.svg',
			zoom: {
				on: true,
				buttons: {on: false},
				limit: [0,11]
			},
			scroll: {
				on: true
			},
			tooltips: {
				mode: function(region, data) {
					return data.id.replace(/_/g, ' ');
				}
			},
			colors: {
				background: "#041524",
				base: "#3A7DB2",
				disabled: "#113E68"
			},
			menu: {
				on: false,
				containerId: "zoom_in",
				template: function(region){
					var name = region.title||region.id
					return '<li><a href="' + region.id + '">' + name.replace(/_/g, ' ') + '</a></li>'
				}
			},
			mouseOver: function(e, mapsvg) {
				var region = this;
			},
			mouseOut: function(e, mapsvg) {
				var region = this;
			},
			onClick: state.map_country_clicked,
			onDisabledClick : state.map_disabled_area_clicked,
			afterLoad: function() {
				//this.zoomOut();
			},
			responsive: true,
			disableAll: true,
			regions: countries
		});
	
	}
	
}



/**********************************************
 Init
**********************************************/

var init = function() {

	build.country_list();
	build.add_map();

	events.country_list();
	events.country_li_click();
	events.tile_listener();
	events.scroll_limiter(['.list__inner', '.tile__content-inner']);
	events.click_hide(['.tile__content','svg','path']);
	events.zoom_buttons();
	events.document_listener();
	events.instructions();
	events.list_scroll_btn();

	state.remove_loader();
}

init();
