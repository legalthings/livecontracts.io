var chart = bb.generate({
	"data": {
		"columns": [
			["Pre sale", 6204614],
			["Company reserve", 10000000],
			["Team and advisors", 18000000],
			["Bounty program", 2000000],
			["Public sale", 63795386]
		],
		"type": "donut",
		"onclick": function (d, i) {
		},
		"onover": function (d, i) {
		},
		"onout": function (d, i) {
		}
	},
	"color": {
		"pattern": [
			"#C424FD",
			"#6e1b84",
			"#9867cf",
			"#9fbfff",
			"#507dec"
		]
	},
	"legend": {
		"show": false,
		"position": "right",
		"contents": {
			"bindto": "#pie-legend",
			"template": "<span style='color:#fff;padding:5px;background-color:{=COLOR}'>{=TITLE} {=DATA}</span>"
		}
	},
	"tooltip": {
		"show": false,
		"format": {
			"title": function (d) {
				return 'Data ' + d;
			},
			"value": function (value, ratio, id) {
				var format = id === 'data1' ? d3.format(',') : d3.format('$');
				
				return format(value);
			}
		}
	},
	"bindto": "#pie"
});

// setTimeout(function () {
// 	chart.load({
// 		columns: [
// 			["setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
// 			["versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
// 			["virginica", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8],
// 		]
// 	});
// }, 1500);
//
// setTimeout(function () {
// 	chart.unload({
// 		ids: 'data1'
// 	});
// 	chart.unload({
// 		ids: 'data2'
// 	});
// }, 2500);
