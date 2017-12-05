$(window).load(function () {
	/* only if you want use mcustom scrollbar */
	$(".sf-step").mCustomScrollbar({
		theme: "dark-3",
		scrollButtons: {
			enable: true
		}
	});
});

var wavesWallet = null;
var ltoRates = {};
var bonusRate = 0.6;

$(document).ready(function () {
	var isShowingMore = false;

	if ($(".quote").length > 0) {
		quotesAnimation();
	}

	$('#wallet').on('change', function(newValue) {
		validateWavesAddress(newValue.target.value);
	});

	 $("#lto-amount").on("keypress blur",function (event) {
        $(this).val($(this).val().replace(/[^0-9\.]/g,''));
        if ((event.which != 8 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
	        event.preventDefault();
        }
    });

	$('#lto-amount').on('input', function (newValue) {
		calculateRate();
	});

	$('#price-currency').on('change', function (newValue) {
		calculateRate();
	});


	$('#show-more').click(function() {
		if(!isShowingMore) {
			isShowingMore = true;
			$('.show-more').slideDown(500);
			$('#show-more').text('Less team members');
		}
		else {
			isShowingMore = false;
			$('.show-more').slideUp(500);
			$('#show-more').text('More team members');
		}
	});

	eventForMobileTooltip();
	// populateExploreBlock();
	manipulatingHeader();
	loadTokens();
	wizardInit();
	openWishlistPopup();
	closePopup();
	scrollToBlock();
	bindingWizardsTabs();
	initSubscribeMailChimp();
	initTimer();
	timelineInit();
	stripeCheckoutInit();
  initWalletChoice();
  createWavesWallet();
  handlePayment();
});


//init for pie chart

//opening Wishlist popup
function openWishlistPopup() {
	$('.js-open-wishlistPopup').on('click', function (e) {
		e.preventDefault();
		$('html').addClass('lock');
		$('.popup.js-wishlist-popup').removeClass('popup-hide');
		$('.popup__close').on('click', function (e) {
			e.preventDefault();
			$('html').removeClass('lock');
			$('.popup.js-wishlist-popup').addClass('popup-hide')
		})
	})
}

// init add open wallet choice
function initWalletChoice() {
	$("#create-wallet").show();
  $("#enter-wallet").hide();
  $('#generated-address').hide();
  $('#generate-address').show();

  if (wavesWallet) {
    $('#generated-address').show();
    $('#generate-address').hide();
  }

  $("#wallet-choice").change(function() {
    var value = $( this ).val();
    if (value === 'yes') {
      showEnterWallet();
		} else {
      showCreateWallet();
		}
  });
}

function showCreateWallet() {

  $("#create-wallet").show();
  $("#enter-wallet").hide();

  if (wavesWallet) {
    $('#generated-address').show();
    $('#generate-address').hide();
	} else {
  	$('#generated-address').hide();
    $('#generate-address').show();
	}
}

function showEnterWallet() {
  $("#create-wallet").hide();
  $("#enter-wallet").show();
}

function createWavesWallet() {
	$('#create-waves-wallet').click(function(){
    $.ajax({
      url: waves_server + "/api/wallet",
      success: function (result) {
				wavesWallet = result.address;
				$('#wallet').val(result.address);
        $('#seed').html(result.seed);
        $('#wallet-address').html(result.address);
        $('#download-seed').attr('href','data:application/octet-stream;charset=utf-8;base64,' + result.base64);
        showCreateWallet();
      }
    });
	});
}

function getRates() {
  $.ajax({
    url: waves_server + "/api/rates",
    success: function (result) {
		ltoRates = result;

		$.each(ltoRates, function (i, item) {
		    $('#price-currency').append($('<option>', { 
		        value: item.currency,
		        text : item.currency 
		    }));
		});

		$('#price').val('0');
		calculateRate();
    }
  });
}

function calculateRate() {
	if (!ltoRates.length) {
		return;
	}

	var selectedCurrency = $('#price-currency').val();
	var ltoAmount = $('#lto-amount').val();

	if (ltoAmount === '') {
		return;
	}

	var currentCurrency = ltoRates.find(r => r.currency === selectedCurrency);
	var bonusTokens = Math.ceil(parseFloat(ltoAmount * 0.6));
	var totalLtos = parseInt(ltoAmount) + parseInt(bonusTokens);

	if (currentCurrency) {
		var total = parseFloat(parseInt(ltoAmount) * parseFloat(currentCurrency.rate)).toFixed(6);
		$('#price').val(total);
		$('#amount-bonus').html(bonusTokens);
		$('#amount-total').html(totalLtos);
	}
}


function handlePayment() {
	$('#pay').click(function() {
    $('#pay').attr("disabled","disabled");

		var user = collectUserInfo();
		var organization = convertUserToOrg(user);
    var amount = $('#number-lto').val();
    var wallet = $('#wallet').val();
    var currency = $('#currency-choice').val();

		var data = {};
		data.user = user;
		data.organization = organization;
		data.return_url = 'https://livecontracts.io/paid';
		data.notify_url = waves_server + '/api/payment/notify';
		data.quantity = parseInt(amount);
		data.wallet = wallet;
		data.currency = currency;
		data.payment_identifier = getPaymentProvider(currency);

    $.ajax({
      url: waves_server + "/api/payment/start",
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      dataType: "json",
      success: function (result) {
        $('#pay').attr("disabled",false);

        window.location.href = result.transaction.external_payment_url;
      }
    });
	})
}

function collectUserInfo() {
	var user = {};
	user.first_name = $('#billing-firstname').val();
	user.last_name = $('#billing-lastname').val();
	user.email = $('#billing-email').val();
	user.company = $('#billing-company').val();
	user.address = $('#billing-address').val();
	user.postcode = $('#billing-postcode').val();
	user.city = $('#billing-city').val();
	user.country = $('#billing-country').val();

	return user;
}

function convertUserToOrg(user) {

	var address = {};
	address.street = user.address;
	address.postcode = user.postcode;
	address.city = user.city;
	address.country = user.country;

	var organization = {};
	organization.id = user.email;
 	organization.name = user.company == "" ? user.first_name + " " + user.last_name : user.company;
 	organization.email = user.email;
 	organization.address = address;

 	return organization;
}

function getPaymentProvider(currency) {

	if (currency === "EUR" || currency == "USD") {
		return $('payment-choice').val();
	}

	return 'coinpayments';
}

function loadCheckoutInformation() {

	var user = collectUserInfo();

	if (user.company == "") {
    $('#checkout-company').hide();
	} else {
    $('#checkout-company').show();
    $('#checkout-company').html(user.company);
	}

  $('#checkout-name').html(user.first_name + " " + user.last_name);
	$('#checkout-email').html(user.email);
  $('#checkout-address').html(user.address);
  $('#checkout-city').html(user.postcode + ", " + user.city);
  $('#checkout-country').html(user.country);
  $('#checkout-wallet').html($('#wallet').val());

  var tokens = $('#lto-amount').val();
  var bonusTokens = $('#amount-bonus').text();
  var totalTokens = $('#amount-total').text();
  var price = $('#price').val();
  var currency = $('#price-currency').val();


  $('#checkout-tokens').html("<strong>" + tokens + "</strong>");
  $('#checkout-bonus').html("<strong>" + bonusTokens + "</strong>");
  $('#checkout-total-tokens').html("<strong>" + totalTokens + "</strong>");
  $('#checkout-total-price').html("<strong>" + price + " " + currency + "</strong>");
}

//function for animating quotes on scroll
//function for animating quotes on scroll
function quotesAnimation() {

	var quote = document.getElementsByClassName('quote');
	quote[0].classList.add('quoteActive');

	for (let i = 0; i < quote.length; i++) {
		window.addEventListener('scroll', function () {
			var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			var parent = $('.top-quotes-block');
			var main = parent.offset().top - (parent.height());

			if (scrollTop <= main) {
				quote[i].classList.remove('quoteActive');
				quote[0].classList.add('quoteActive');
			} else if (scrollTop <= (main + 200)) {
				quote[i].classList.remove('quoteActive');
				quote[1].classList.add('quoteActive');
			} else if (scrollTop <= (main + 400)) {
				quote[i].classList.remove('quoteActive');
				quote[2].classList.add('quoteActive');
			}
		})
	}

}


// animation for quotes

$.fn.extend({
	animateCss: function (animationName, callback) {
		var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		this.addClass('animated ' + animationName).one(animationEnd, function () {
			$(this).removeClass('animated ' + animationName);
			if (callback) {
				callback();
			}
		});
		return this;
	}
});

//function for timeline init and animation

function timelineInit() {
	(function ($) {
		$.fn.timeline = function () {
			var selectors = {
				id: $(this),
				item: $(this).find(".timeline-item"),
				activeClass: "timeline-item--active",
				img: ".timeline__img"
			};
			selectors.item.eq(0).addClass(selectors.activeClass);
			$("#timeline-background").css(
				"background-image",
				"url(" +
				selectors.item
					.first()
					.find(selectors.img)
					.attr("src") +
				")"
			);
			var itemLength = selectors.item.length;
			$(window).scroll(function () {
				var max, min;
				var pos = $(this).scrollTop() + 150;
				selectors.item.each(function (i) {
					min = $(this).offset().top;
					max = $(this).height() + $(this).offset().top;
					var that = $(this);
					if (i == itemLength - 2 && pos > min + $(this).height() / 6) {
						selectors.item.removeClass(selectors.activeClass);
						$("#timeline-background").css(
							"background-image",
							"url(" +
							selectors.item
								.last()
								.find(selectors.img)
								.attr("src") +
							")"
						);
						selectors.item.last().addClass(selectors.activeClass);
					} else if (pos <= max && pos >= min) {
						$("#timeline-background").css(
							"background-image",
							"url(" +
							$(this)
								.find(selectors.img)
								.attr("src") +
							")"
						);
						selectors.item.removeClass(selectors.activeClass);
						$(this).addClass(selectors.activeClass);
					}
				});
			});
		};
	})(jQuery);

	$("#timeline-1").timeline();

}


//function for showing tooltips on timeline on mobile

function eventForMobileTooltip() {
	if (window.innerHeight > window.innerWidth) {
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
	var explore = [
		{
			"link": "documents/contract-as-automaton.pdf",
			"img": "img/explore/contract-as-automaton.png",
			"title": "Live Contracts — What’s all the fuss about?",
			"intro": "We show that the fundamental legal structure of a well-written financial contract follows a " +
			"statetransition logic that can be formalized mathematically as a finite-state machine (also known as a " +
			"finitestate automaton)."
		},
		{
			"link": "https://medium.com/@rick_42072/live-contracts-whats-all-the-fuss-about-62b167d9a4d4",
			"img": "img/three_common.jpg",
			"title": "Live Contracts — What’s all the fuss about?",
			"intro": "Picture this. A contract or law visualized in such a way that it is understandable for humans and " +
			"computers. Not only the rules that you are agreeing upon in the contract, but also the consequences behind " +
			"those rules. With our solution Live Contracts, we enable equality of rights for all parties involved."
		},
		{
			"link": "documents/livecontracts-at-codex.pdf",
			"img": "img/explore/livecontracts-at-codex.png",
			"title": "Introducing Live Contracts @ Stanford CodeX",
			"intro": "A Live Contract is an agreement that is formalized as a Finite State Machine. LegalThings One runs" +
			" Live Contracts and stores information in a provable, immutable way on a public decentralized storage."
		}
	];

	$('.populate-block .loading .fa').addClass('spinning')
	var block = $('#blog-grid');
	var count = explore.length;


	$.each(explore, function (key, value) {
		block.append([
			'<div class="isotope-item blog-item" style="position: absolute; left: 0px; top: 0px;">',
			'<div class="blog-media">',
			'<a href="' + value.link + '" target="_blank" class="text-light blog-image">',
			'<img src=' + value.img + ' alt="SEO IMG NAME">' + '<div class="overlay-caption hidden-on-start">',
			'<h6 class="caption-sub portfolio-category subtitle-2"></h6>',
			'<h4 class="caption-name portfolio-name uppercase"></h4>',
			'</a>',
			'</div>',
			'<div class="blog-desc align-center">',
			'<div class="blog-headline">',
			'<h5 class="post-name"><a href="' + value.link + '" target="_blank"><strong>' + value.title + '</strong></a></h5>',
			'</div>',
			'<p>' + value.intro + '</p>',
			'</div>',
			'</div>'
		].join(''));
		if (key + 1 === count) {
			setTimeout(function () {
				$('.populate-block .loading').addClass('close');
				block.css('opacity', "1");
			}, 3000)
		}
	})
}

//Show/hide header
function manipulatingHeader() {
	var header = $('#header');
	var topBlockHeight = $('#hero').height();
	var new_offset = 100;

	$(window).resize(function () {
		topBlockHeight = $('#hero').height();
	});
	$(window).scroll(function () {
		var scrollFromTop = $(document).scrollTop();

		if (scrollFromTop > new_offset) {
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
			var cap = 10000000;

			$('.progress-active').attr('data-perc', (sold / cap) * 100);

			currentTokens.html(sold.formatMoney(0, '.', ','));
			allTokens.html(cap.formatMoney(0, '.', ','));
		}
	})
}

//loading data about tokens status
function validateWavesAddress(address) {
	$('#wallet').parsley().removeError('required');

	if (!address || !address.length) {
		return;
	}

	$.ajax({
		url: waves_server + `/api/wallet/${address}/validate`,
		success: function (result) {
			if (!result.valid) {
				$('#wallet').parsley().addError('required', { message: 'Invalid Waves address', updateClass: true });
			} else {
				$('#wallet').parsley().removeError('required');
			}
		}
	})
}


//init of wizard steps
function wizardInit() {
	sfw = $("#wizard").stepFormWizard({
    markPrevSteps: true,
    onNext: function(i) {
      loadCheckoutInformation();
      return $("#wizard").parsley().validate('block' + i);
    },
    onFinish: function() {
      return $("#wizard").parsley().validate();
    },
    onSlideChanged: function(to, data) {
      // if we transition to token selection step, fetch the rates and start calculation
      if (to === 1) {
      	var myOpts = document.getElementById('price-currency').options;

      	if (!myOpts.length) {
      	  getRates();
	    }
      }
    }
});

	$(".js-open-wizard").on('click', function (e) {
		e.preventDefault();
		$('html').addClass('lock')
		$('.popup-container').removeClass('popup-hide')
		$('.popup-backdrop').removeClass('popup-hide')
		$('.popup').removeClass('popup-hide')
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
			data: JSON.stringify({recipient: address}),
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
		$('.popup-container').addClass('popup-hide')
		$('.popup-backdrop').addClass('popup-hide')
		$('.popup').addClass('popup-hide')
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

function initSubscribeMailChimp() {
	var $form = null;

	$('.newsletter-form').submit(function (e) {
		e.preventDefault();
		$form = $(this);
	});

	$('.newsletter-form').ajaxChimp({
		callback: function (resp) {
			var $error = $form.find('.newsletter-error');
			var $success = $form.find('.newsletter-success');

			$error.hide();
			$success.hide();

			if (resp.result === 'error') {
				$error.show().html(resp.msg);
				$success.hide();
			} else {
				$error.hide();
				$success.show();
			}
		},
		url: 'https://legalthings.us17.list-manage.com/subscribe/post?u=1508bdb96b4379a9aeb07c6e8&amp;id=6d17a10ae2'
	});
}


function initTimer() {
	var time = $('.count-down');

	if (!time || !time.length) {
		return;
	}

	var endDate = new Date(time.data("end-date"));
	time.countdown({
		date: endDate,
		render: function (data) {
			$(this.el).html('<div class="cd-row"><div><h1>' + data.days
				+ '</h1><p>days</p></div><div><h1>'
				+ this.leadingZeros(data.hours, 2)
				+ '</h1><p>hrs</p></div></div><div class="cd-row"><div><h1>'
				+ this.leadingZeros(data.min, 2)
				+ '</h1><p>min</p></div><div><h1>'
				+ this.leadingZeros(data.sec, 2)
				+ '</h1><p>sec</p></div></div>');
		}
	});
}

function stripeCheckoutInit() {
	var handler = StripeCheckout.configure({
		key: 'pk_test_Vvo4uuQl1pb1DF7hJj4hDhHP',
		image: 'https://s3-eu-west-1.amazonaws.com/livecontracts/img/logo/icon-purple.png',
		locale: 'auto',
		token: function (token) {
			// pass token.id and email to the server
		}
	});

	if ($('#checkout-presale').length) {
		document.getElementById('checkout-presale').addEventListener('click', function (e) {
			// Open Checkout with further options:
			handler.open({
				name: 'LTO Pre-sale',
				description: 'Purchase LTO tokens',
				zipCode: false,
				currency: 'usd',

				// this needs to be set dynamically: https://stripe.com/docs/recipes/variable-amount-checkout
				// based on <num_tokens> * $0.25
				amount: 2000,
				bitcoin: false,
				allowRememberMe: false
			});
			e.preventDefault();
		});
	}


	// Close Checkout on page navigation:
	window.addEventListener('popstate', function () {
		handler.close();
	});
}
