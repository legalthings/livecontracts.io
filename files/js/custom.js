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
	eventForMobileTooltip();
	populateExploreBlock();
	manipulatingHeader();
	loadTokens();
	wizardInit();
	closePopup();
	scrollToBlock();
	bindingWizardsTabs();
});



//function for showing tooltips on timeline on mobile

function eventForMobileTooltip() {
	if(window.innerHeight > window.innerWidth){
		$('.timeline .event').on('click', function () {
			$(this).find('.hover-block').toggleClass('open')
		})
	}
}

//function for same tabs in Wizard on 4 and 5 steps

function bindingWizardsTabs() {

	var bitcoinTab = $('.bitcoin-tab')
	var bitcoinContent = $('.bitcoin-content')

	var ethererumTab = $('.ethererum-tab')
	var ethererumContent = $('.ethererum-content')

	$('.tab-nav li').on('click', function () {
		if ($(this).hasClass('bitcoin-tab')) {
			bitcoinTab.addClass('active')
			bitcoinContent.addClass('active')

			ethererumTab.removeClass('active')
			ethererumContent.removeClass('active')
		}
		if ($(this).hasClass('ethererum-tab')) {
			bitcoinTab.removeClass('active')
			bitcoinContent.removeClass('active')

			ethererumTab.addClass('active')
			ethererumContent.addClass('active')
		}
	})

}

// Global variables leave here, pls

var sfw;
var next_loading = false;
var waves_server = 'https://waves.legalthings.io';

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

				block.append('' + '<div class="isotope-item blog-item" style="position: absolute; left: 0px; top: 0px;">' +
					//TODO: if we want to return hover, then should add thumb-overlay overlay-effect-1 to text-light
					'<div class="blog-media">' + '					<a href="portfolio-single-custom.html" class="text-light"> ' + '<img src=' + data.img + ' alt="SEO IMG NAME">' + '<div class="overlay-caption hidden-on-start">' + '<h6 class="caption-sub portfolio-category subtitle-2"></h6>' + '<h4 class="caption-name portfolio-name uppercase"></h4>' + '</div>' + '</a>' + '</div>' + '<div class="blog-desc align-center">' + '<div class="blog-headline">' + '<h6 class="post-category uppercase">' + data.category + '</h6>' + '<h5 class="post-name"><a href="blog-single-custom1.html"><strong>' + data.title + '</strong></a></h5>' + '</div>' + '<p>' + data.intro + '</p>' + '</div>' + '</div>');
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
		} else {
			header.removeClass('custom-visible')
		}
	})

}

//loading data about tokens status
function loadTokens() {
	var currentTokens = $('#current-tokens-sold');
	var allTokens = $('#all-tokens');
	$.ajax({
		url: waves_server + "/api/balance",
		success: function (result) {

			var total = parseInt(result.phases.presale.limit) / 100000000;
			var sold = total - (result.balance / 100000000);

			$('.progress-active').attr('data-perc', (sold / total) * 100);

			currentTokens.html(sold.formatMoney(0, '.', ','));
			allTokens.html(total.formatMoney(0, '.', ','));
		}
	})
}

//init of wizard steps
function wizardInit() {
	sfw = $("#wizard").stepFormWizard({
		onPrev: function (from) {
		},
		onSlideChanged: function (step, data) {
			sfw.activeNext(true);
		}
	});

	$(".js-open-wizard").on('click', function (e) {
		e.preventDefault();
		$('html').addClass('lock')
		$('.popup-wizard').removeClass('popup-hide')
	})

	$("#faucet-retrieve-btn").on('click', function (e) {
		e.preventDefault();
		var $recipient = $('#faucet-recipient');
		var address = $recipient.val();

		if (!address) {
			return;
		}

		$.ajax({
			type: "POST",
			url: waves_server + "/api/faucet",
			data: JSON.stringify({ recipient: address }),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (result) {
				if (!result || !result.id) {
					// something went wrong
					$('#faucet-failed').show();
					$('#faucet-success').hide();
					return;
				}

				$('#faucet-failed').hide();
				$('#faucet-success').show();
				$('#faucet-success-link').attr('href', 'https://wavesexplorer.com/tx/' + result.id);
				$('#faucet-container').hide();
			},
			error: function () {
				$('#faucet-failed').show();
				$('#faucet-success').hide();
			}
		})
	})
}


//function for close popup
function closePopup() {
	$('.popup__close, .sf-btn-finish').on('click', function (e) {
		e.preventDefault();
		$('html').removeClass('lock');
		$(this).closest('.popup').addClass('popup-hide')
	})
}

Number.prototype.formatMoney = function (c, d, t) {
	var n = this,
		c = isNaN(c = Math.abs(c))
			? 2
			: c,
		d = d == undefined
			? "."
			: d,
		t = t == undefined
			? ","
			: t,
		s = n < 0
			? "-"
			: "",
		i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
		j = (j = i.length) > 3
			? j % 3
			: 0;
	return s + (
		j
			? i.substr(0, j) + t
			: "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (
		c
			? d + Math.abs(n - i).toFixed(c).slice(2)
			: "");
};
