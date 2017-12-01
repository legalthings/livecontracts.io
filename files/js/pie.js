var ctx = $('#pie');
var chartColors = {
	color_1: '#9867cf',
	color_2: '#507dec',
	color_3: '#000',
	color_4: '#231d39',
	color_5: '#9067c6',
	
};
var myPieChart = new Chart(ctx, {
	type: 'pie',
	data: {
		datasets: [
			{
				data: [10, 15, 14, 1, 60],
				backgroundColor: [
					chartColors.color_1,
					chartColors.color_2,
					chartColors.color_3,
					chartColors.color_4,
					chartColors.color_5,
				]
			}
		],
		
		// These labels appear in the legend and in the tooltips when hovering different arcs
		labels: [
			"Pre-sale",
			"Company reserve",
			"Team and advisers",
			"Bounty program",
			"Market"
		]
	},
	options: {
		legend: {
			display: false,
			position: 'bottom',
		},
	}
});


