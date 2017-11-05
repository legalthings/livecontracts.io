var $ = require('jquery');

module.exports.init = function () {
    $('.social a[data-target]').click(function (e) {
        e.preventDefault();

        var shareURL = $(this).attr('data-social-url') || window.location.href;
        var shareTitle = $(this).attr('data-social-title') || $('meta[name=description]').text();
        // var shareText = $(this).parent().attr('data-socialtext');
        var service = $(this).attr('data-target');

        if (service == 'twitter') {
            var hrefURL = 'http://twitter.com/share?url=' + encodeURIComponent(shareURL) + '&text=' + encodeURIComponent(shareTitle);
        } else if (service == 'facebook') {
            var hrefURL = 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(shareURL) + '&t=' + encodeURIComponent(shareTitle);
        } else if (service == 'linkedin') {
            var hrefURL = 'http://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(shareURL) + '&title=' + encodeURIComponent(shareTitle);
        } else if (service == 'googleplus') {
            var hrefURL = 'https://plus.google.com/share?url=' + encodeURIComponent(shareURL);
        } else if (service == 'instapaper') {
            var hrefURL = 'http://www.instapaper.com/hello2?url=' + encodeURIComponent(shareURL) + '&title=' + encodeURIComponent(shareTitle);
        }
        if (service == 'email') {
            window.location.href = 'mailto:?subject=' + encodeURIComponent(shareTitle) + '&body=' + encodeURIComponent(shareURL);
        } else {
            window.open(hrefURL, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
        }

    });
}