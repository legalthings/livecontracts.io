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
  initSubscribeMailChimp();
});



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
      "title": "Contract as Automaton",
      "intro": "We show that the fundamental legal structure of a well-written financial contract follows a statetransition logic that can be formalized mathematically as a finite-state machine (also known as a finitestate automaton)."
    },
    {
      "link": "https://www.linkedin.com/pulse/three-common-misconceptions-smart-contracts-olivier-rikken/",
      "img": "img/explore/common-misconceptions-smartcontracts.png",
      "title": "Three common misconceptions about smart contracts",
      "intro": "Besides cryptocurrencies, one of the most promising developments on blockchain is the use of smart contracts. The concept of smart contracts was first described by Nick Szabo in 1994 in his paper “Smart Contracts”. He describes smart contracts as ‘a computerized transaction protocol that executes the terms of a contract’."
    },
    {
      "link": "documents/livecontracts-at-codex.pdf",
      "img": "img/explore/livecontracts-at-codex.png",
      "title": "Introducing Live Contracts @ Stanford CodeX",
      "intro": "A Live Contract is an agreement that is formalized as a Finite State Machine. LegalThings One runs Live Contracts and stores information in a provable, immutable way on a public decentralized storage."
    }
  ];

  var block = $('#blog-grid');

  explore.forEach(function (data) {
    block.append([
      '<div class="isotope-item blog-item" style="position: absolute; left: 0px; top: 0px;">',
      '<div class="blog-media">',
      '<a href="' + data.link + '" target="_blank" class="text-light">',
      '<img src=' + data.img + ' alt="SEO IMG NAME">' + '<div class="overlay-caption hidden-on-start">',
      '<h6 class="caption-sub portfolio-category subtitle-2"></h6>',
      '<h4 class="caption-name portfolio-name uppercase"></h4>',
      '</a>',
      '</div>',
      '<div class="blog-desc align-center">',
      '<div class="blog-headline">',
      '<h5 class="post-name"><a href="' + data.link + '" target="_blank"><strong>' + data.title + '</strong></a></h5>',
      '</div>',
      '<p>' + data.intro + '</p>',
      '</div>',
      '</div>'
    ].join(''));
  })
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
      var cap = 10000000;

      $('.progress-active').attr('data-perc', (sold / cap) * 100);

      currentTokens.html(sold.formatMoney(0, '.', ','));
      allTokens.html(cap.formatMoney(0, '.', ','));
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
  var form = $('#newsletter-widget-form');

  if (form.length) {
    form.ajaxChimp({
      callback: mailchimpCallback,
      url: 'https://legalthings.us17.list-manage.com/subscribe/post?u=1508bdb96b4379a9aeb07c6e8&amp;id=6d17a10ae2'
    });
  }

  // callback function when the form submitted, show the notification box
  function mailchimpCallback(resp) {
    var $error = $('#newsletter-error');
    var $success = $('#newsletter-success');
    $error.hide();
    $success.hide();

    if (resp.result === 'error') {
      $error.show().html(resp.msg);
      $success.hide();
    } else {
      $error.hide();
      $success.show();
    }
  }
}
