/*-----------------------------------------------------------------------------------

 	Script - All Custom frontend jQuery scripts & functions
 
-----------------------------------------------------------------------------------*/
(function(){
'use strict';

/* transform to small header function
------------------------------------------------*/
function smallHeader() {
	
	if (jQuery(window).scrollTop() > 40) {var delDarkHeader = false;
	var addTransHeader = false;
	jQuery('nav#main-nav > ul > li.mega-menu').on({
		mouseenter: function() {
			if (jQuery(window).width() > 1023 && !jQuery("header").hasClass("header-style-vertical")) {
				if (jQuery("header").hasClass("sub-dark")) {
					if (!jQuery("header").hasClass("header-dark")) {
						delDarkHeader = true;
						jQuery("header").addClass('header-dark');
					}
					if (!jQuery("header").hasClass("transparent-light")) {
						addTransHeader = true;
						jQuery("header").addClass('transparent-light');
					}
				} else if (jQuery("header").hasClass("header-dark") || jQuery("header").hasClass("transparent-light")) {
					jQuery("header").addClass('mega-hover');
				}
			}
		},
		mouseleave: function() {
			if (jQuery(window).width() > 1023 && !jQuery("header").hasClass("header-style-vertical")) {
				jQuery("header").removeClass('mega-hover');
				if (delDarkHeader) { jQuery("header").removeClass('header-dark'); }
				if (addTransHeader) { jQuery("header").removeClass('transparent-light'); }
			}
		}
	});
		jQuery("header").addClass("small-header");	
	} else {
		jQuery("header").removeClass("small-header");	
	}
	
}


/* show fixed items after scroll amount function (back to top / fixed share)
------------------------------------------------*/
function showFixedItems() {
	
	if (jQuery(window).scrollTop() > jQuery(window).height()) {
		jQuery( '#backtotop, #share.share-fixed' ).addClass("visible");	
	} else { 
		jQuery( '#backtotop, #share.share-fixed' ).removeClass("visible");	
	}
	
}


/* adapt height function
------------------------------------------------*/
function adaptHeight() {
	
	/* - Columns - */
	var cols = ".column";
	if (jQuery(window).width() < 960) { cols = ".one-half, .one-third, .two-third"; }
	jQuery('.column-section.adapt-height').each(function() { 
		var thisEl = jQuery(this);
		jQuery(thisEl).children(".column").css('minHeight','inherit');
		jQuery(thisEl).children(".column").find(".col-content").css('marginTop', '0');
						
		if (jQuery(window).width() > 767) {
			var maxHeight = 0;
			var tallestEl = '';
			jQuery(thisEl).children(cols).each(function() {
				var theHeight = jQuery(this).outerHeight();
				var theBorder = parseInt(jQuery(this).css('border-top-width'), 10) + parseInt(jQuery(this).css('border-bottom-width'), 10);
				if (theHeight + theBorder > maxHeight) { maxHeight = theHeight + theBorder+1; tallestEl = jQuery(this); }
				// +1 is hack for bordered sticky
			});
			if (maxHeight) {
				jQuery(thisEl).children(".column").css('minHeight',maxHeight+'px');
				jQuery(tallestEl).addClass("tallest");	
			}
			
			// apply vertical-center
			if (jQuery(thisEl).hasClass("vertical-center")) {
				jQuery(thisEl).children(".column:not(.tallest)").each(function() {
					if (jQuery(this).find(".col-content").length > 0 && !jQuery(this).find(".col-content").is(':empty')) {
						var theContent = jQuery(this).find(".col-content");
						var elHeight = maxHeight - (parseInt(jQuery(this).css('paddingTop'), 10) + parseInt(jQuery(this).css('paddingBottom'), 10));
						var contentHeight = jQuery(theContent).height();
						if (contentHeight < elHeight) { 
							var centerMargin = (elHeight - (contentHeight)) / 2;
							jQuery(theContent).css('marginTop', centerMargin + 'px');
						}
					} 
				});
			}
		} // end if window > 767
	});
	
	/* - Fullheight Section - */
	if (jQuery(".fullwidth-section.fullheight").length > 0) {
		jQuery(".fullwidth-section.fullheight").each(function() { 
			var theContent = jQuery(this).find(".fullwidth-content");
			var contentHeight = jQuery(theContent).height();
			var contentPadding = parseInt(jQuery(theContent).css('paddingTop')) + parseInt(jQuery(theContent).css('paddingBottom'), 10);
			if (contentHeight+contentPadding < jQuery(this).height()) { 
				var centerMargin = (jQuery(this).height() - (contentHeight+contentPadding)) / 2;
				jQuery(theContent).css('transform', 'translateY(' + centerMargin + 'px)');
			}
		});
	}
	
	/* - Hero / Pagetitle (if pagetitle is taller than hero) - */
	if (jQuery(".hero-full #page-title").length > 0 || jQuery(".hero-big #page-title").length > 0) { 
		var pageTitle = jQuery("#hero #page-title").outerHeight() + parseInt(jQuery("#hero #page-title").css('marginTop'),10);
		if (jQuery("header").hasClass("header-style-vertical")) { headerHeight = 0; }
		
		var addMargin = 0;
		if ((pageTitle + headerHeight*2) > jQuery("#hero").outerHeight() && parseInt(jQuery("#hero #page-title").css('marginTop'),10) < 1) {
			jQuery("#hero #page-title").addClass("title-adapt");
			addMargin = parseInt(jQuery("#hero #page-title").css('top'),10);
		} else {
			jQuery("#hero #page-title").removeClass("title-adapt");
		}
		
		/*if (pageTitle+addMargin >  jQuery("#hero").outerHeight()) {
			jQuery("#hero").css('height',pageTitle+addMargin-2+'px'); // -2 is for prevend jumping
		} else  {
			jQuery("#hero").css('height','auto');
		}*/
	} 
	
}


/* do animations if element is visible
------------------------------------------------*/
function animateOnScroll() {
	
	/* has-animation elements */
	jQuery('.has-animation').each(function() {
		var thisItem = jQuery(this);
		if (jQuery(window).width() > 1024) {
			var visible = thisItem.visible(true);
			var delay = thisItem.attr("data-delay");
			if (!delay) { delay = 0; }
			if (thisItem.hasClass( "animated" )) {} 
			else if (visible) {
				thisItem.delay(delay).queue(function(){thisItem.addClass('animated');});
			}
		} else {
			thisItem.addClass('animated');	
		}
	});
	
	/* counter elements */
	jQuery('.counter-value').each(function(){
		var counter = jQuery(this);
		if (jQuery(window).width() > 767 && counter.visible(true)) {		
			counter.addClass('animated');
			counter.find('.counter-animator').each(function(){
				var animator = jQuery(this);
				var value = animator.data('value') * 10;
					animator.find('ul').css({
						'transform': 'translateY(-' + value + '%)',
						'-webkit-transform': 'translateY(-' + value + '%)',
						'-moz-transform': 'translateY(-' + value + '%)',
						'-ms-transform': 'translateY(-' + value + '%)',
						'-o-transform': 'translateY(-' + value + '%)'
					});
			});
		}
	});
	
	/* progress bar */
	jQuery('.progress-bar-item').each(function() {
		var thisItem = jQuery(this);
		var visible = thisItem.visible(true);
		var percent = thisItem.find('.progress-bar .progress-active ').attr('data-perc');
		if (thisItem.hasClass( "anim" )) {} 
		else if (visible) {
			var randomval = Math.floor(Math.random() * (300 - 50 + 1)) + 50;
			thisItem.addClass("anim");
			thisItem.find('.progress-bar .progress-active ').animate({'width': percent+'%',}, 2000, 'easeInOutQuart', function(){
				jQuery(this).find('.tooltip').delay(randomval).animate({'opacity':1}, 500);	
			}).css('overflow', 'visible');
		}
	});
		
}



/* do animations function
------------------------------------------------*/
function reorganizeIsotope() { 
	jQuery('.isotope-grid[class*="style-modern"]').each(function(){
		var $container = jQuery(this);
		var width = $container.find(".grid-sizer").width();
		var ratioheight = $container.data('heightratio');
		if (!ratioheight) { ratioheight = 0.8; }
		var spacing = 0; if ($container.hasClass("isotope-spaced") || $container.hasClass("isotope-spaced-mini")) { spacing = parseInt($container.find(".isotope-item").css('marginRight'),10); }
		var height = parseInt(width * ratioheight, 10);
		$container.children('.isotope-item').css({ 'height': height+'px' });
		$container.children('.isotope-item.tall, .isotope-item.wide-tall').css({ 'height': height*2+spacing+'px' });
		$container.isotope( 'reLayout' );
		
		// adapt images
		$container.children('.isotope-item').each(function() {
			var imgHeight = jQuery(this).find("img").height();
           	var imgWidth = jQuery(this).find("img").width();
			var imgRatio = imgWidth/imgHeight;
			var itemHeight = jQuery(this).height();
           	var itemWidth = jQuery(this).width();
			var itemRatio = itemWidth/itemHeight;
			var imgClass = '';
			if (imgRatio < itemRatio) { imgClass = 'wide-img'; jQuery(this).find("img").removeClass('tall-img'); }
			else { imgClass = 'tall-img'; jQuery(this).find("img").removeClass('wide-img'); }
			jQuery(this).find("img").addClass(imgClass);
        });
	});
}


var headerHeight = false;
jQuery(window).load(function() {
	
	
	/*---------------------------------------------- 
	 		 H I D E   P A G E L O A D E R
	------------------------------------------------*/
	jQuery("body").addClass("page-is-loaded");
		
	
	/*---------------------------------------------- 
	  P S E U D O   H E A D E R (if not transparent)
	------------------------------------------------*/
	headerHeight = jQuery("header").height();
	if (!jQuery("header").hasClass("header-transparent") && !jQuery("header").hasClass("header-style-floating") && !jQuery("header").hasClass("header-style-vertical")) {
		jQuery("body").append('<div id="pseudo-header" style="height:'+headerHeight+'px;position:absolute;z-index:-1;"></div>');
	}
	
	
	/*---------------------------------------------- 
	  P R E P A R E   A D A P T   H E I G H T
	------------------------------------------------*/
	jQuery('.column-section.adapt-height').each(function() {
		jQuery(this).children('.column').each(function() {
			if (!$.trim(jQuery(this).html())) {
				jQuery(this).addClass("empty-content");
			} else {
				if (jQuery(this).children('.col-content').length < 1) {  jQuery(this).wrapInner('<div class="col-content"></div>'); }	
			}
		});
	});
	

	/*---------------------------------------------- 
			O P E N / C L O S E   S E A R C H
	------------------------------------------------*/
	jQuery('#show-search').on("click", function() { jQuery(".header-search-content").addClass("search-visible"); return false; });
	jQuery('.header-search-content .search-outer').on("click", function() { jQuery(".header-search-content").removeClass("search-visible"); return false; });
	jQuery('#close-search').on("click", function() { jQuery(".header-search-content").removeClass("search-visible"); return false; });
	
	
	
	/*---------------------------------------------- 
			I S O T O P E  /  M A S O N R Y 
	------------------------------------------------*/
	if( jQuery().isotope ) {
		
		/* Call Isotope  
		------------------------------------------------*/	
		jQuery('.isotope-grid').each(function(){
			var $container = jQuery(this);
			jQuery(this).prepend('<div class="grid-sizer"></div>');
			if (!$container.hasClass("fitrows")) { 
				$container.imagesLoaded( function(){
					$container.isotope({
						layoutMode: 'masonry',
						itemSelector : '.isotope-item',
						masonry: { columnWidth: '.grid-sizer' }
					});	
				});
			} else {
				$container.imagesLoaded( function(){
					$container.isotope({
						layoutMode: 'fitRows',
						itemSelector : '.isotope-item',
						masonry: { columnWidth: '.grid-sizer' }
					});	
				});
			}
		});
			
		
		/* Filter isotope
		------------------------------------------------*/
		jQuery('.filter').on("click", "li a", function() { 
			var thisItem = jQuery(this);
			var parentul = thisItem.parents('ul.filter').data('related-grid');
			
			if (!parentul) {
				alert('Please specify the dala-related-grid');
			} else {
				thisItem.parents('ul.filter').find('li').removeClass('active');
				thisItem.parent('li').addClass('active');
				var selector = thisItem.attr('data-filter');
				jQuery('#'+parentul).isotope({ filter: selector }, function(){ });
			}
			
			return false;
		});
		
		reorganizeIsotope();
		
	}
	
	
	/*---------------------------------------------- 
		  M E G A M E N U   (color dependecies)
	------------------------------------------------*/
	var delDarkHeader = false;
	var addTransHeader = false;
	jQuery('nav#main-nav > ul > li.mega-menu').on({
		mouseenter: function() {
			if (jQuery(window).width() > 1023 && !jQuery("header").hasClass("header-style-vertical")) {
				if (jQuery("header").hasClass("sub-dark")) {
					if (!jQuery("header").hasClass("header-dark")) {
						delDarkHeader = true;
						jQuery("header").addClass('header-dark');
					}
					if (!jQuery("header").hasClass("transparent-light")) {
						addTransHeader = true;
						jQuery("header").addClass('transparent-light');
					}
				} else if (jQuery("header").hasClass("header-dark") || jQuery("header").hasClass("transparent-light")) {
					jQuery("header").addClass('mega-hover');
				}
			}
		},
		mouseleave: function() {
			if (jQuery(window).width() > 1023 && !jQuery("header").hasClass("header-style-vertical")) {
				jQuery("header").removeClass('mega-hover');
				if (delDarkHeader) { jQuery("header").removeClass('header-dark'); }
				if (addTransHeader) { jQuery("header").removeClass('transparent-light'); }
			}
		}
	});
	
	
	
	/*---------------------------------------------- 
		  S U B M E N U   (Add gap for submenu if too close to border)
	------------------------------------------------*/
	jQuery('nav#main-nav > ul > li:last-child').prev('li').andSelf().each(function() {
        if (jQuery(this).children('ul.submenu').length > 0) {
			var pageRight = parseInt(jQuery(window).width() - (jQuery("#page-content").offset().left + jQuery("#page-content").outerWidth()), 10);
			var elRight = parseInt( (jQuery(window).width() - (jQuery(this).offset().left + jQuery(this).outerWidth())) - pageRight, 10);
			if (elRight < 150) { jQuery(this).children('ul.submenu').addClass('add-gap'); }	
		}
    });
	
	
	
	/*---------------------------------------------- 
			R E S P O N S I V E   N A V
	------------------------------------------------*/
	jQuery('header').on("click", ".responsive-nav-toggle", function() { 
		jQuery('#menu').toggleClass('menu-is-open'); 
		return false;
	});
	
	jQuery('#main-nav').on("click", "li > a", function() {
		var thisItem = jQuery(this); 
		var thisParent = jQuery(this).parent('li'); 
		if (thisItem.siblings('ul').length > 0 && thisItem.siblings('ul').css('display') === 'none') {
			thisItem.siblings('ul').slideDown(400);
			thisParent.siblings('li').children('ul').slideUp(400);
			thisParent.siblings('li').find('.mega-menu-content').slideUp(400);  
			thisParent.siblings('li').find('.mega-menu-content ul li > ul').slideUp(400);  
			return false;	
		} else if (thisItem.siblings('.mega-menu-content').length > 0 && thisItem.siblings('.mega-menu-content').css('display') === 'none') { 
			thisItem.siblings('.mega-menu-content').slideDown(400);
			thisParent.siblings('li').find('.mega-menu-content').slideUp(400);
			thisParent.siblings('li').find('.mega-menu-content ul li > ul').slideUp(400);  
			thisParent.siblings('li').children('ul').slideUp(400);    
			return false;	
		}
	});
	
	jQuery('header').on("click", ".show-language", function() { 
		jQuery('#header-language > .header-language-content').toggleClass('show'); 
		return false;
	});
	
	
	/*---------------------------------------------- 
			R E V O L U T I O N   S L I D E R
	------------------------------------------------*/
	if(jQuery().revolution) {
		jQuery("#hero .revolution-slider").revolution({
			sliderType:"standard",
			sliderLayout:"fullscreen",
			fullScreenAutoWidth:"on",
			fullScreenOffsetContainer:"#pseudo-header",
			delay:9000,
			disableProgressBar:'on',
			navigation: {
				arrows:{ 
					enable:true, 
					style:"sudo-nav",
					left:{ h_offset: 0 },
					right:{  h_offset: 0 } 
				},
				bullets:{ 
					enable:false, 
					style:"sudo-bullets",
					h_align:"center",
					v_align:"bottom",
					h_offset:0,
					v_offset:20,
					space:8,  
				},
				touch:{
				 	touchenabled:"on",
				 	swipe_treshold : 75,
				 	swipe_min_touches : 1,
				 	drag_block_vertical:false,
				 	swipe_direction:"horizontal"
				}				
			},
			responsiveLevels:[2048,1024,778,480],			
			gridwidth:[1024,778,480,400],
			gridheight:[700,550,550,450],
			lazyType: 'smart'
		});
		
		jQuery("#hero .revolution-slider").bind("revolution.slide.onchange",function (e,data) {
			if (data.currentslide.hasClass('text-light')) {
				if (jQuery("header").hasClass("header-transparent")) { jQuery("header").addClass("transparent-light").removeClass("transparent-dark"); }
				if (jQuery("#hero #scroll-down").length > 0) { jQuery("#hero #scroll-down").addClass("text-light"); }
				jQuery("#hero .revolution-slider .sudo-bullets").addClass("sudo-light").removeClass("sudo-dark");
			} else {
				if (jQuery("header").hasClass("header-transparent")) { jQuery("header").addClass("transparent-dark").removeClass("transparent-light"); }
				if (jQuery("#hero #scroll-down").length > 0) { jQuery("#hero #scroll-down").removeClass("text-light"); }
				jQuery("#hero .revolution-slider .sudo-bullets").addClass("sudo-dark").removeClass("sudo-light");
			}
		});		
		
	}
	
	
	/*---------------------------------------------- 
				   S C R O L L   T O (back to top, scroll down, scroll to section)
	------------------------------------------------*/
	jQuery('body').on('click', '#backtotop,#scroll-down,.scroll-to', function() {
		var topPos = 0;
		if (jQuery(this).attr("id") === "scroll-down") { topPos = jQuery("#page-body").offset().top; }
		if (jQuery(this).hasClass("scroll-to")) { 
			var href = jQuery(this).attr('href');
			var target = jQuery(this).attr('data-target');
			if (href.charAt(0) === '#') { target = href;  }
			topPos = jQuery(target).offset().top;
			if (jQuery(window).width() < 1024) { jQuery('#menu').removeClass('menu-is-open'); } 
		}
		jQuery('html,body').animate({ scrollTop: topPos}, 1000, 'easeInOutQuart');
		return false;
	});
	
	
	
	/*---------------------------------------------- 
				   	 P A R A L L A X
	------------------------------------------------*/
	if(jQuery().parallax) { 
		jQuery('.parallax-section').parallax();
	}
	
	
	
	
	/*---------------------------------------------- 
			    I N L I N E   V I D E O
	------------------------------------------------*/
	jQuery('body').on("click", ".inline-video", function() { 
		var el = jQuery(this);
		var type = el.data('type');
		var video = el.data('videoid');
				
		if (type === 'youtube') { 
		var iframe='<iframe src="http://www.youtube.com/embed/'+video+'?autoplay=1" width="100%" height="100%" frameborder="0" allowfullscreen ></iframe>';
		} else if (type === 'vimeo') {
		var iframe='<iframe src="https://player.vimeo.com/video/'+video+'?autoplay=1" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>';
		}
		
		el.append('<div class="inline-iframe-container"></div>');
		el.find(".inline-iframe-container").html(iframe+'<div class="close-inline-video"></div>');
		
		setTimeout(function() {
			el.addClass('active');
		}, 1000);
		
		return false;
	});
	
	jQuery('body').on("click", ".close-inline-video", function() { 
		var thisItem = jQuery(this); 
		thisItem.parents( ".inline-video" ).removeClass('active');
		thisItem.parent( ".inline-iframe-container" ).remove();
		return false;
	});
	
	
	
	
	/*---------------------------------------------- 
				   	L I G H T C A S E
	------------------------------------------------*/
	if(jQuery().lightcase) { 
		jQuery('a[data-rel^=lightcase]').lightcase({ 
			showSequenceInfo: false, 
			swipe: true, 
			showCaption:false,
			overlayOpacity:0.95,
			maxWidth: 1300,
			maxHeight: 1100,
			shrinkFactor: 1,
			video: {
				width : 780,
				height : 420
				}
		});
	}
	
	
	
	/*---------------------------------------------- 
				   F I T   V I D E O S
	------------------------------------------------*/
	if(jQuery().fitVids) { 
		jQuery("body").fitVids();
	}
	
	
	
	/*---------------------------------------------- 
		O W L   S L I D E R & C A R O U S E L
	------------------------------------------------*/
	if(jQuery().owlCarousel) {
		
		jQuery(".owl-slider").owlCarousel({
			items:1,
			stopOnHover : true,
			nav: false,
			navText:false,
			dots: true,
			smartSpeed : 600,			
			singleItem : true,
			autoHeight : true,
			loop: false,
			autoplay: false,
			navRewind: false
		});
		
		jQuery(".owl-carousel").owlCarousel({
			items : 4,
			itemsDesktop:false,
			responsive: { //shop related items
			  480: { items: 1 },
			  768: { items: 2 },
			  },
			autoplay: false,
			autoHeight : true,
			nav: true,
			navText:false,
			dots: true,
			loop: false
		});
				
	}
	
	
	
	/*---------------------------------------------- 
			 P R E P A R E   C O U N T E R
	------------------------------------------------*/
	jQuery('.counter-value').each(function(){
		var thisEl = jQuery(this);
		var thisVal = thisEl.text();
		
		// put digits in a span
		var digits = thisVal.toString().replace(/(\d)/g, '<span class="digit"><span class="digit-value">$1</span></span>');
		thisEl.html(digits+'<div class="main">'+thisVal+'</span>');
		
		// add the ul list
		thisEl.find('.digit').each(function(){
			var digit = jQuery(this);
			var digitValue = digit.find('.digit-value').text();
			digit.append(
				'<div class="counter-animator" data-value="' + digitValue + '">' +
					'<ul>' +
						'<li>0</li>' +
						'<li>1</li>' +
						'<li>2</li>' +
						'<li>3</li>' +
						'<li>4</li>' +
						'<li>5</li>' +
						'<li>6</li>' +
						'<li>7</li>' +
						'<li>8</li>' +
						'<li>9</li>' +
					'</ul>'+
				'</div>'
			);
		});
		
	});
	
	
	
	/*---------------------------------------------- 
				        T A B S 
	------------------------------------------------*/	
	jQuery(".tabs").each(function() {
		var thisItem = jQuery(this); 
		thisItem.find('.tab-content').removeClass('active');
		var rel = thisItem.find('.active a').attr('href');
		thisItem.find('.'+rel).addClass('active');
	});
	
	jQuery(".tab-nav").on("click", "a", function() { 
		var thisItem = jQuery(this); 
		var parentdiv = thisItem.parents('li').parent('ul').parent('div');
		var rel = thisItem.attr('href');
		
		jQuery(parentdiv).find(".tab-nav li").removeClass("active");
		thisItem.parents('li').addClass("active");
		
		jQuery(parentdiv).find(".tab-container .tab-content").hide().removeClass('active');
		jQuery(parentdiv).find(".tab-container ."+rel).fadeIn(500).addClass('active');
		
		return false;
		
	});
	
	
	/*---------------------------------------------- 
			T O G G L E  &  A C C O R D I O N
	------------------------------------------------*/		
	jQuery(".toggle-item").each(function() {
		jQuery(this).find('.toggle-active').siblings('.toggle-inner').slideDown(300);							
	});
	
	jQuery(".toggle-item").on("click", ".toggle-title", function() { 
		var thisItem = jQuery(this); 
		var parentdiv = thisItem.parent('div').parent('div');
		var active = thisItem.parent('div').find('.toggle-inner').css('display');
		
		if (jQuery(parentdiv).attr('class') === 'accordion') {
			if (active !== 'none' ) { 
				jQuery(parentdiv).find('.toggle-item .toggle-inner').slideUp(300);
				thisItem.toggleClass('toggle-active');
			} else {
				jQuery(parentdiv).find('.toggle-item .toggle-inner').slideUp(300);
				jQuery(parentdiv).find('.toggle-item .toggle-title').removeClass('toggle-active');
				
				thisItem.toggleClass('toggle-active');
				thisItem.siblings('.toggle-inner').slideDown(300);
			}
		} else {
			thisItem.toggleClass('toggle-active');
			thisItem.siblings('.toggle-inner').slideToggle(300);
		}
		
		return false;
	});
	


	/*---------------------------------------------- 
	 S E L F H O S T E D   A U D I O   +   V I D E O
	------------------------------------------------*/
	if(jQuery().mediaelementplayer) {
		jQuery('audio,video').mediaelementplayer();
	}
	
	
	
	/*---------------------------------------------- 
				   	 V I D E O   B G
	------------------------------------------------*/
	if(jQuery().bgVideo) { 
		jQuery('.videobg-section').bgVideo();
	}
	
	
	adaptHeight();
	smallHeader();
	showFixedItems();
	animateOnScroll(); 
	
});


jQuery(window).scroll(function() { 
	smallHeader(); 
	showFixedItems();
	animateOnScroll(); 
});


jQuery(window).resize(function() { 
	adaptHeight();
	if( jQuery().isotope ) { reorganizeIsotope(); }
	if (jQuery(window).width() > 1023) { jQuery('#menu').removeClass('menu-is-open'); }
});


/* Call Feeds */
jQuery(document).ready(function() { 
	
	/*---------------------------------------------- 
				I N S T A G R A M   F E E D
	------------------------------------------------*/
	if( jQuery(".instagram-widget").length > 0  && jQuery().spectragram){
		jQuery.fn.spectragram.accessData = {
			accessToken: '36286274.b9e559e.4824cbc1d0c94c23827dc4a2267a9f6b',
			clientID: 'b9e559ec7c284375bf41e9a9fb72ae01'
		};
		
		jQuery('.instagram-widget').each(function(){
			var $theFeed = jQuery(this);
			var instaType = $theFeed.data('type');
			var instaUser = $theFeed.data('user');
			var instaTag = $theFeed.data('tag');
			var instaCount = $theFeed.data('count');
			
			if (instaType === 'user') {
				$theFeed.spectragram('getUserFeed', {
					query: instaUser, 
					max: Number(instaCount),
					size: 'medium',
					wrapEachWith: "<div></div>"
				});
			} else if (instaType === 'tag') {
				$theFeed.spectragram('getRecentTagged',{
					query: instaTag,
					max: Number(instaCount),
					size: 'medium',
					wrapEachWith: "<div></div>"
				});
			}
		});
	}
	
	/*---------------------------------------------- 
				F L I C K R   F E E D
	------------------------------------------------*/
	if( jQuery(".flickr-widget").length > 0  && jQuery().jflickrfeed){
		jQuery('.flickr-widget').each(function(index){
			var $theFeed = jQuery(this);
			var flickrId = $theFeed.data('id');
			var flickrCount = $theFeed.data('count');
			
			$theFeed.jflickrfeed({
				limit: Number(flickrCount),
				qstrings: {
					id: flickrId
				},
				itemTemplate: '<div><a href="{{image_b}}" data-rel="lightcase:flickr'+index+'"><img src="{{image_s}}" alt="{{title}}"/></a></div>'
			});
		});
	}
	
	
	/*---------------------------------------------- 
			   D R I B B B L E   F E E D
	------------------------------------------------*/
	if( jQuery(".dribbble-widget").length > 0 ){
		jQuery('.dribbble-widget').each(function(){
			var $theFeed = jQuery(this);
			var dribbbleUser = $theFeed.data('user');
			var dribbbleCount = $theFeed.data('count');
		
			jQuery.jribbble.setToken('YOURACESSTOKEN');
			
			jQuery.jribbble.users(dribbbleUser).shots({'per_page': Number(dribbbleCount)}).then(function(res) {
			  	var html = [];
			  	res.forEach(function(shot) {
					html.push('<div class="shot">');
					html.push('<a href="' + shot.html_url + '" target="_blank">');
					html.push('<img src="' + shot.images.normal + '">');
					html.push('</a></div>');
			  	});
			  	$theFeed.html(html.join(''));
			});
			
		});
	}
		
});

})(jQuery);
