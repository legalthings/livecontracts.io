$(document).ready(function () {
	progressBar();
	timeline();
});


// Init of progressBar plugin
function progressBar() {
	var bar = new ProgressBar.Line(progressbar, {
		strokeWidth: 4,
		easing: 'easeInOut',
		duration: 1400,
		color: '#B2B2B2',
		trailColor: '#fff',
		trailWidth: 4,
		svgStyle: {
			width: '100%',
			height: '18px',
		}
	});
	bar.animate(0.3);  // Number from 0.0
}

// Init of timeline plugin
function timeline() {
	$('#timeline-container').timelineMe({
		orientation: 'horizontal',
		scrollZones: false,
		scrollBar: false,
		items: [
			{
				type: 'smallItem',
				label: 'my label'
			},
			{
				type: 'smallItem',
				label: 'html label'
			},
			{
				type: 'smallItem',
				label: 'html label'
			},
			{
				type: 'smallItem',
				label: 'html label'
			},
			{
				type: 'smallItem',
				label: 'html label'
			}
		]
	});
}