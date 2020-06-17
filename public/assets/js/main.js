$(document).ready(function(){


	$("body").on('click','.nav-link .fa-chevron-down',function(e){
			$(".submenu").removeClass('submenu-s');

	        $(this).parent().next().addClass("submenu-s");


	        $(".fa-chevron-up").addClass("d-none");
	        $(".fa-chevron-up").removeClass("d-sm-block");
	        $(".fa-chevron-down").removeClass("d-none");

	        $(this).addClass("d-none");
	        $(this).removeClass("d-sm-block");
	        $(this).next().removeClass("d-none");
	    })



	$("body").on('click','.nav-link .fa-chevron-up',function(e){

	        $(this).parent().next().removeClass("submenu-s");


	        $(this).addClass("d-none");
	        $(this).removeClass("d-sm-block");
	        $(this).prev().removeClass("d-none");
	    })


	 $("body").on('click','.regional-empty-button',function(e){
	 	$(this).parents(".content-container").find(".content").removeClass("active");
	 	$("#"+$(this).prop('id').replace("button-","")).addClass("active");
	 	//$("#"+$(this).prop('id').replace("button-mobile-","")).addClass("active");
	});


	 $("body").on('change','.custom-select',function(e){
	 	$(this).parents(".content-container").find(".content").removeClass("active");
	 	$('#'+$(this).find('option:selected').prop('id').replace("button-mobile-","")).addClass("active");
	});
	 
	// $("body").on('click','.region1 .regional-empty-button',function(e){
	// 		var j = $('button').index($(this)) - 7;
	// 		$(".region-1-text .content").removeClass("active");
	// 		$(".region-1-text").children().eq(j).addClass( "active" );
	//     })	


	$("body").on('click','.nav-item',function(e){
		if(($(this).has(".submenu").length>0) && !($(this).find(".submenu").hasClass("active"))){
			event.preventDefault();
		}
		
		if($(this).find(".submenu").hasClass("active")){
			$(this).find(".submenu").removeClass("active");
		}
		else{
			$(".nav-item").find(".submenu").removeClass("active");
	 		$(this).find(".submenu").toggleClass("active");
		}
		
	 	
	});

	    $('.owl-carousel').owlCarousel({
        loop:true,
        margin:0,
        nav:true,
        dots:false,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:2
            },
            1000:{
                items:3
            }
        }
    })
});