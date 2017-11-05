$(window).load(function () {
	/* only if you want use mcustom scrollbar */
	$(".sf-step").mCustomScrollbar({
		theme: "dark-3",
		scrollButtons: {
			enable: true
		}
	});

});

$(document).ready(function () {
	populateExploreBlock();
	manipulatingHeader();
	loadTokens();
	wizardInit();
	closePopup();
	scrollToBlock();
	appendSkipWizardButton();
});

//added skip button for wizard control
function appendSkipWizardButton() {
	$('.sf-controls').append('' +
		'<a class="skip-btn sf-right sf-btn sf-btn-next" onclick="skipStep()" href="#">SKIP</a>'
	);
}

// Global variables leave here, pls

var sfw;
var next_loading = false;

//function for smooth scroll to block

function scrollToBlock() {
	$('.js-scrollToBlock').on('click', function (e) {
		e.preventDefault();
		// console.log($(this).attr('href'))
		var blockOffset = $($(this).attr('href')).offset().top;

		$('html, body').animate({
			scrollTop: blockOffset - 96
		}, 2000);
	})
}

//Function that populate blocks in "Explore".
function populateExploreBlock() {

	var block = $('#blog-grid');

	$.ajax({
		url: "files/data.json",
		success: function (result) {
			// data = JSON.parse(result)
			var tokens = result[0].explore
			tokens.map(function (data) {

				block.append('' +
					'<div class="isotope-item blog-item" style="position: absolute; left: 0px; top: 0px;">' +

					//TODO: if we want to return hover, then should add thumb-overlay overlay-effect-1 to text-light
					'<div class="blog-media">' +
					'					<a href="portfolio-single-custom.html" class="text-light"> ' +
					'<img src=' + data.img + ' alt="SEO IMG NAME">' +
					'<div class="overlay-caption hidden-on-start">' +
					'<h6 class="caption-sub portfolio-category subtitle-2"></h6>' +
					'<h4 class="caption-name portfolio-name uppercase"></h4>' +
					'</div>' +
					'</a>' +
					'</div>' +

					'<div class="blog-desc align-center">' +
					'<div class="blog-headline">' +
					'<h6 class="post-category uppercase">' + data.category + '</h6>' +
					'<h5 class="post-name"><a href="blog-single-custom1.html"><strong>' + data.title + '</strong></a></h5>' +
					'</div>' +
					'<p>' +
					data.intro +
					'</p>' +
					'</div>' +
					'</div>'
				);
			})
		}
	});

}

//Show/hide header
function manipulatingHeader() {
	var header = $('#header');
	var topBlockHeight = $('#hero').height();

	$(window).resize(function () {
		topBlockHeight = $('#hero').height();
	})
	$(window).scroll(function () {
		var scrollFromTop = $(document).scrollTop();

		if (scrollFromTop > topBlockHeight) {
			header.addClass('custom-visible')
		}
		else {
			header.removeClass('custom-visible')
		}
	})

}

//loading data about tokens status
function loadTokens() {
	var currentTokens = $('#current-tokens-sold');
	var allTokens = $('#all-tokens');
	$.ajax({
		url: "files/data.json",
		success: function (result) {
			var tokens = result[0].tokens;
			$('.progress-active').attr('data-perc', (tokens.current / tokens.total) * 100)

			currentTokens.html(tokens.current)
			allTokens.html(tokens.total);
		}
	})
}




//init of wizard steps
function wizardInit() {

	sfw = $("#wizard").stepFormWizard({
		height: 'auto',
		onPrev: function (from) {
			console.log(from);
			if (from === 3) {
				$('#wizard-box.sf-t2 .sf-btn.skip-btn').addClass('visible');
			}
			else {
				$('#wizard-box.sf-t2 .sf-btn.skip-btn').removeClass('visible');
			}
		},
		onNext: function (from, data) {
			if (from === 1) {
				$('#wizard-box.sf-t2 .sf-btn.skip-btn').addClass('visible');
			}
			if (from === 2) {
				$('#wizard-box.sf-t2 .sf-btn.skip-btn').removeClass('visible');

				if (next_loading) { // test if ajax is executing
					return false;
				}
				if (data !== undefined && data.done) { // if ajax is done, than data.done is set to true
					return true;
				}
				sfw.addSpinner('next'); // add spinner to next button
				next_loading = true; // to prevent stack of ajax requests if user hasn't patience

				var settings = {
					"async": true,
					"crossDomain": true,
					"url": "http://mockbin.com/request?foo=bar&foo=baz",
					"method": "POST",
					"headers": {
						"cookie": "foo=bar; bar=baz",
						"accept": "application/json",
						"content-type": "application/json",
						"x-pretty-print": "2"
					},
					"processData": false,
					"data": data
				};

				$.ajax(settings).done(function (response) {
					console.log(response);
				});

				return false;
			}
		}
	});

	// sfw.activeNext(false); // disable next button

	$("#wizard").on('keyup', '#text', function () {
		if ($(this).val() != "") {
			sfw.activeNext(true);
		} else {
			$('#wizard-box.sf-t2 .sf-btn.skip-btn').on('click', function () {

			})
			sfw.activeNext(false); // disable next button
			sfw.activeStep(1, false); // deactive next step
		}
	})


	$(".js-open-wizard").on('click', function (e) {
		e.preventDefault();
		$('.popup-wizard').removeClass('popup-hide')
	})
}

function skipStep() {
	next_loading = false; // allow next step
	sfw.next(false, {done: true}) // go to next step, additional data will be in next callback
	return false
}


//function for close popup
function closePopup() {
	$('.popup__close').on('click', function (e) {
		e.preventDefault();
		$(this).parent().addClass('popup-hide')
	})
}









