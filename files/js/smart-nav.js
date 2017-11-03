/*-----------------------------------------------------------------------------------

 	Smart Nav
 
-----------------------------------------------------------------------------------*/
(function(){
'use strict';

var showNav = false;
var hideNav = false;
var activeStatus = false;
var cashSections = [];

function getShowAndHide() {
	if (jQuery('.smart-nav-section').length > 0) { 			
		showNav = jQuery('.smart-nav-section').first().offset().top - 100;
		hideNav = jQuery('.smart-nav-section').last().offset().top + jQuery('.smart-nav-section').last().height() - jQuery(window).height();
	}
}

jQuery(window).load(function() {
	
	jQuery('.smart-nav-section').each(function() {
		cashSections.push({id: jQuery(this).attr("id"), position: jQuery(this).offset().top-100});
    });		
			
	getShowAndHide();
});

jQuery(window).scroll(function() {
		
	if (!activeStatus && showNav && jQuery(window).scrollTop() > showNav && jQuery(window).scrollTop() < hideNav) {
		activeStatus = true;
		jQuery('#smart-nav').addClass("visible");
	}
	
	if ((activeStatus && hideNav && jQuery(window).scrollTop() > hideNav) || (activeStatus && jQuery(window).scrollTop() < showNav)) {	
		activeStatus = false;
		jQuery('#smart-nav').removeClass("visible");
	}
	
	jQuery.each(cashSections, function(index,value) {
		var nextIndex = index+1;
		var linkedAnchor = jQuery('a.scroll-to[href="#'+value.id+'"]').parent('li');
		if (cashSections.length !== nextIndex && jQuery(window).scrollTop() > value.position && jQuery(window).scrollTop() < cashSections[nextIndex].position) {
			if (!linkedAnchor.hasClass('current-menu-item')) {
				linkedAnchor.siblings("li").removeClass('current-menu-item');
				linkedAnchor.addClass('current-menu-item');
			}
		} else if (cashSections.length === nextIndex && jQuery(window).scrollTop() > value.position) {
			if (!linkedAnchor.hasClass('current-menu-item')) {
				linkedAnchor.siblings("li").removeClass('current-menu-item');
				linkedAnchor.addClass('current-menu-item');
			}
		}
	});	
	
});

jQuery(window).resize(function() { 
	getShowAndHide();
});

})(jQuery);
