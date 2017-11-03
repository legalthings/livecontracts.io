/**
 * Phat Video Background
 * @version 1.0
 * @author Spab Rice (spab-rice.com)
 * @copyright	Author
**/
(function(){
'use strict';

var youtubeScript = document.createElement('script');
youtubeScript.src = "http://www.youtube.com/iframe_api";
var vimeoScript = document.createElement('script');
vimeoScript.src = "http://f.vimeocdn.com/js/froogaloop2.min.js";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(youtubeScript, firstScriptTag);
firstScriptTag.parentNode.insertBefore(vimeoScript, firstScriptTag);

(function($){
    $.fn.extend({
        bgVideo: function(options) {
			return this.each(function(index) {
				var el = jQuery(this);
				
				var settings = $.extend({}, defaults, options,el.data());
				var defaults = {
					videotype: false,
					videovimeoid: false,
					videoyoutubeid: false,
					videomp4: false,
					videowebm: false,
					videoogv: false,
					videoratio: "16/9",
					videoloop: true,
					videoposter: false,
					videooverlaycolor: false,
					videooverlayopacity: 0.6,
					videomute: true
				};
				
				buildVideo(el,settings,index);
				//alert(index);
				if (settings.videotype === 'youtube' && jQuery(window).width() > 1024) { onYouTubePlayerAPIReady(index); }
				if (settings.videotype === 'vimeo' && jQuery(window).width() > 1024) { onVimeoAPIReady(index); }
								
			});
		}
    });
})(jQuery);


function buildVideo(el,settings,i){
	
	// PREPARE
	if (el.css('position') !== 'absolute' || el.css('position') !== 'relative') { el.css({'position':'relative'}); }
	
	el.css('background','none');
	
	el.append('<div class="bgvideo-container" style="position:absolute;width:100%;height:100%;top:0;left:0;z-index:-2;overflow:hidden;"></div>');
	var elBgContainer = el.find('.bgvideo-container');
	
	if (settings.videoposter) {
		elBgContainer.css({ 'background': 'url('+settings.videoposter+') center center', 'background-size': 'cover' });
	}
	
	if (settings.videooverlaycolor) {
		elBgContainer.prepend('<div class="bgvideo-overlay" style="position:absolute;width:100%;height:100%;top:0;left:0;z-index:1;"></div>');
		elBgContainer.find('.bgvideo-overlay').css({ 'background': settings.videooverlaycolor, 'opacity': settings.videooverlayopacity });
	}
	// PREPARE
	
	switch (settings.videotype) {
		case "youtube":
			
			var loop = "loop=0"; if ( settings.videoloop || settings.videoloop === "true" ) { loop =  'loop=1&playlist='+settings.videoyoutubeid; }
			var mute = ""; if ( settings.videomute || settings.videomute == "true" ) { mute =  ' youtube-muted'; }
			
			var markup = '<iframe id="bgvid-'+i+'" class="video-background'+mute+'" style="width:100%;height:100%;" src="https://www.youtube.com/embed/'+settings.videoyoutubeid+'?autoplay=1&amp;controls=0&amp;'+loop+'&amp;showinfo=0&amp;modestbranding=1&amp;disablekb=1&amp;enablejsapi=1" frameborder="0"></iframe>';
						
			break;
			
		case "vimeo":
		
			var loop = "loop=0"; if ( settings.videoloop || settings.videoloop === "true" ) { loop =  'loop=1'; }
			var mute = ""; if ( settings.videomute || settings.videomute == "true" ) { mute =  ' vimeo-muted'; }
			
			var markup = '<iframe id="bgvid-'+i+'" class="video-background'+mute+'" style="width:100%;height:100%;" src="https://player.vimeo.com/video/'+settings.videovimeoid+'?api=1&'+loop+'&autoplay=1&player_id=bgvid-'+i+'"></iframe>';
		
			break;
			
		case "html5":
			
			var loop = ''; if ( settings.videoloop || settings.videoloop == "true" ) { loop =  ' loop="true"'; }
			var mute = ""; if ( settings.videomute || settings.videomute == "true" ) { mute =  ' muted="muted"'; }
			
			var markup = '<video style="object-fit:cover;width:100%;height:100%;" class="video-background" preload="auto" autoplay="autoplay"'+loop+mute+'>';
			if (settings.videomp4) { markup += '<source src="'+settings.videomp4+'" type="video/mp4" />'; }
			if (settings.videowebm) {markup += '<source src="'+settings.videowebm+'" type="video/webm" />'; }
			if (settings.videoogv) {markup += '<source src="'+settings.videoogv+'" type="video/ogg" />'; }
			markup += '</video>';
								
			break;
	}
	
	if (jQuery(window).width() > 1024) {
		if ( !settings.videomute || settings.videomute == "false" ) {
			el.append('<a href="#" id="mute-video-'+i+'" class="mute-video mute-'+settings.videotype+'" data-rel="bgvid-'+i+'" style="position:absolute;bottom:15px;left:15px;">Sound</a>');	
		}
			
		elBgContainer.prepend(markup);
		if (settings.videotype === 'youtube' || settings.videotype === 'vimeo') { setRatio(el,settings.videoratio); }
	}
}

function setRatio(el,ratio){
	
	var elWidth = el.find('.bgvideo-container').width();
	var elHeight = el.find('.bgvideo-container').height();
	var elRatio = elWidth / elHeight;
	var videoWidth = 16;
	var videoHeight = 9; 
	if (ratio == "4/3") { videoWidth = 4; videoHeight = 3; } 
	if (ratio == "21/9") { videoWidth = 21; videoHeight = 9; } 
	var videoRatio = videoWidth / videoHeight;
		
	if (elRatio > videoRatio) {
		var multiplicator = elRatio / videoRatio;
		// +30 to force the fullwidth with 30px overlay
		var newHeight = (parseInt(multiplicator * elHeight,10)) + 30;
		var newWidth = (parseInt(elWidth) ) + 30;
		el.find("iframe.video-background").css({
			'width' : newWidth+'px',
			'height' : newHeight+'px',
			'position': 'relative',
			'top': '50%',
			'-webkit-transform' : 'translateY(-50%)',
			'-moz-transform'    : 'translateY(-50%)',
			'-ms-transform'     : 'translateY(-50%)',
			'-o-transform'      : 'translateY(-50%)',
			'transform'         : 'translateY(-50%)'
		});
	} else {
		var multiplicator = videoRatio / elRatio;
		var newWidth = (parseInt(multiplicator * elWidth,10)) +30;
		var newHeight = (parseInt(elHeight)) + 30;
		el.find("iframe.video-background").css({
			'height' : newHeight+'px',
			'width' : newWidth+'px',
			'position': 'relative',
			'left': '50%',
			'top':'-15px',
			'-webkit-transform' : 'translateX(-50%)',
			'-moz-transform'    : 'translateX(-50%)',
			'-ms-transform'     : 'translateX(-50%)',
			'-o-transform'      : 'translateX(-50%)',
			'transform'         : 'translateX(-50%)'
		});
	}
	
}
	
jQuery('body').on("click", ".mute-video", function() { 
	if (jQuery(this).hasClass("mute-html5")) {
		var video = jQuery(this).siblings('.bgvideo-container').find('video');
		if (video.prop('muted') == false) { video.prop('muted',true); } 
		else { video.prop('muted',false); }
	}
	else if (jQuery(this).hasClass("mute-vimeo")) {
		var relIframe = jQuery(this).data("rel");
		var iframe = document.getElementById(relIframe); var relPlayer = $f(iframe); // $f == Froogaloop
		if (!jQuery(this).hasClass("unmute")) { relPlayer.api('setVolume', 0); } 
		else { relPlayer.api('setVolume', 1); }
	}
	jQuery(this).toggleClass("unmute");
	return false;
});
		
function onYouTubePlayerAPIReady(i) {
	var ytplayer = new YT.Player('bgvid-'+i, {
		events: {
			'onReady': function() {
				if (jQuery('#bgvid-'+i).hasClass("youtube-muted")) { ytplayer.mute(); }
				jQuery('body').on("click", "#mute-video-"+i+".mute-video", function() {
					if (ytplayer.isMuted()) { ytplayer.unMute(); } 
					else { ytplayer.mute(); }
				});	
			}
		}
	});
}

function onVimeoAPIReady(i) {
	var iframe = document.getElementById('bgvid-'+i);
	var player = $f(iframe); // $f == Froogaloop
	
	player.addEvent('ready', function() {
		// settimeout workaround if multiple videos are embedded and conflict each other
		setTimeout(function(){ player.api('play'); }, 500);
		if (jQuery('#bgvid-'+i).hasClass("vimeo-muted")) {
			player.api('setVolume', 0);
		}
    });
}

})(jQuery);