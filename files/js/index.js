$(function () {
	var $content = $('#jsonContent');
	var data = {
		rss_url: 'https://medium.com/feed/@legalthingsone'
	};
	$.get('https://api.rss2json.com/v1/api.json', data, function (response) {
		if (response.status == 'ok') {
			var output = '';
			$.each(response.items, function (k, item) {
				var visibleSm;
				if(k < 3){
					visibleSm = '';
				 } else {
					 visibleSm = ' visible-sm';
				 }
				output += '<div class="col-sm-6 col-md-4' + visibleSm + '">';
				output += '<div class="medium-post"><header>';
				/*output += '<h4 class="date">' + $.format.date(item.pubDate, "dd<br>MMM") + "</h4>";*/
				var tagIndex = item.description.indexOf('<img'); // Find where the img tag starts
				var srcIndex = item.description.substring(tagIndex).indexOf('src=') + tagIndex; // Find where the src attribute starts
				var srcStart = srcIndex + 5; // Find where the actual image URL starts; 5 for the length of 'src="'
				var srcEnd = item.description.substring(srcStart).indexOf('"') + srcStart; // Find where the URL ends
				var src = item.description.substring(srcStart, srcEnd); // Extract just the URL
				output += '<div class="medium-element"><img class="img-responsive" src="' + src + '" width="340px" height="180px"></div></header>';
				output += '<div class="medium-content"><h4><a href="'+ item.link + '">' + item.title + '</a></h4>';
				output += '<span><hr></span>';
				var yourString = item.description.replace(/<img[^>]*>/g,""); //replace with your string.
				var maxLength = 100 // maximum number of characters to extract
				//trim the string to the maximum length
				var trimmedString = yourString.substr(0, maxLength);
				//re-trim if we are in the middle of a word
				trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
				output += '<div class="medium-text"><p>' + trimmedString + '..</p></div>';
				output += '<div class="read-more"><a href="'+ item.link + ' class="read-more"> Read the full article </a></div>';
				output += '</div></div></div>';
				return k < 2;
			});
			$content.html(output);
		}
	});
});