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
		labels: [
			"Company reserve",
			"Team and advisors",
			"Bounty program",
			"Public sale"
		]
	},
	options: {
		showAllTooltips: true,
	}
});

Chart.pluginService.register({
	beforeRender: function (chart) {
		if (chart.config.options.showAllTooltips) {
			// create an array of tooltips
			// we can't use the chart tooltip because there is only one tooltip per chart
			chart.pluginTooltips = [];
			chart.config.data.datasets.forEach(function (dataset, i) {
				chart.getDatasetMeta(i).data.forEach(function (sector, j) {
					chart.pluginTooltips.push(new Chart.Tooltip({
						_chart: chart.chart,
						_chartInstance: chart,
						_data: chart.data,
						_options: chart.options.tooltips,
						_active: [sector]
					}, chart));
				});
			}); 
			
			// turn off normal tooltips
			chart.options.tooltips.enabled = false;
		}
	},
	afterDraw: function (chart, easing) {
		if (chart.config.options.showAllTooltips) {
			// we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
			if (!chart.allTooltipsOnce) {
				if (easing !== 1)
					return;
				chart.allTooltipsOnce = true;
			}
			
			// turn on tooltips
			chart.options.tooltips.enabled = true;
			Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
				tooltip.initialize();
				tooltip.update();
				// we don't actually need this since we are not animating tooltips
				tooltip.pivot();
				tooltip.transition(easing).draw();
			});
			chart.options.tooltips.enabled = false;
		}
	}
});