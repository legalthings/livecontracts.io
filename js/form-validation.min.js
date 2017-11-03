/*-----------------------------------------------------------------------------------

 	Script - Form Validation and Send Email
 
-----------------------------------------------------------------------------------*/
(function($){
'use strict';

jQuery(window).load(function($) {	
			
	jQuery(".checkform").on("click", 'input[type="submit"]', function() {
		
		var form = jQuery(this).parents('form');
		var formAction = form.attr('action');
					
		var errors = false;
		form.find('.req').each(function(){ 
			var thisEl = jQuery(this);
			var value = thisEl.val();
			
			if (thisEl.attr('name') === 'email') {
				var re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
				if (!value.match(re)) {  thisEl.addClass('check-error'); thisEl.parent('.form-row').addClass('check-error'); errors = true; } 
				else { thisEl.removeClass('check-error'); thisEl.parent('.form-row').removeClass('check-error'); }
			} else {
				if ( value === '' ) { 
					thisEl.addClass('check-error'); thisEl.parent('.form-row').addClass('check-error'); errors = true;
				} else { 
					thisEl.removeClass('check-error'); thisEl.parent('.form-row').removeClass('check-error');
				}
			}
		}); // END each loop
		
		if (errors) { 
			// The fields have errors - The alert is shown
			form.find(".form-note").fadeIn(200);
			return false;
		} else if (form.hasClass("sendemail")) {
			// The fields are ok - if sendemail is true we call the contact-send.php
			form.find(".form-note").fadeOut(200);
				
			if (formAction && formAction !== '') {
				var str = form.serialize();
			   	jQuery.ajax({
					type: "POST",
					url: formAction,
					data: str,
					success: function(msg){
						form.find(".form-note").html(msg);
						form.find(".form-note").delay(200).fadeIn(200);
					}
				});
			}
			return false;
		}
			
	});
	
	
});  // END jQuery(window).load(function($) {


})(jQuery)