var ctx = $('#pie');
var chartColors = {
	color_1: '#6e1b84',
	color_2: '#9867cf',
	color_3: '#9fbfff',
	color_4: '#507dec',

};
var myPieChart = new Chart(ctx, {
	type: 'pie',
	data: {
		datasets: [
			{
				data: [10000000, 18000000, 2000000, 60000000],
				backgroundColor: [
					chartColors.color_1,
					chartColors.color_2,
					chartColors.color_3,
					chartColors.color_4,
				],
				borderWidth: [0, 0, 0, 0]
			}
		],

		// These labels appear in the legend and in the tooltips when hovering different arcs
		labels: [
			"Company reserve",
			"Team and advisors",
			"Bounty program",
			"Public sale"
		]
	},
	options: {
		legend: {
			display: false,
			position: 'bottom',
		},
		cutoutPercentage: 50,
		tooltips: {
			callbacks: {
				label: function(tooltipItem, data) {
					var value = data.datasets[0].data[tooltipItem.index];
					if (parseInt(value) >= 1000) {
						value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					}
					return data.labels[tooltipItem.index] + ': ' + value;
				}
			}
		}
	}
});
