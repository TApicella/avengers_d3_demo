//Using http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/ as a reference
//As well as https://bost.ocks.org/mike/bar/2/ and https://bl.ocks.org/mbostock/3887051

var d3 = require("d3");
var EventEmitter = require('events').EventEmitter;
var d3Chart = {};

d3Chart.create = function (node, config, state) {
	var svg = d3.select(node).append('svg').attr('class', 'd3').attr('width', config.width + config.axis_margins.left + 150) //150 is for the legend
	.attr('height', config.height + config.axis_margins.bottom);

	svg.append('g').attr('class', 'd3-bars'); //g element is a container

	svg.append('g').attr('class', 'x-axis');

	svg.append('g').attr('class', 'y-axis');

	svg.append('g').attr('class', 'legend');

	var dispatcher = new EventEmitter();

	this.update(node, config, state, dispatcher);

	return dispatcher;
};

d3Chart.update = function (node, config, state, dispatcher) {
	//Recompute scales and render
	var scales = this._scales(node, config, state.domain);
	this._drawAxes(node, config, scales);
	this._drawBars(node, config, scales, state.data, dispatcher);
	this._drawLegend(node, config, state.domain.zmap);
};

d3Chart.destroy = function (node) {
	//Cleanup code
};

d3Chart._drawAxes = function (node, config, scales) {
	//I want to show all the tick values by default
	var x_step = 1;
	var x_domain = scales.xscale.domain();
	var x_min = x_domain[0];
	var x_max = x_domain[x_domain.length - 1];

	var xAxis = d3.svg.axis().scale(scales.xscale).orient("bottom").tickValues(d3.range(x_min, x_max + 1, x_step)).tickFormat(d3.format("d")); //Removes commas from axis labels

	d3.select(node).selectAll('.d3').append("text").attr("class", "axis-label").attr("x", (config.width + config.axis_margins.left) / 2).attr("y", config.height + config.axis_margins.bottom).text(config.x_label);

	var yAxis = d3.svg.axis().scale(scales.yscale).orient("right").ticks(scales.yscale.domain()[1]).tickFormat(d3.format("d"));

	d3.select(node).selectAll('.d3').append("text").attr("class", "axis-label").attr("x", 0).attr("y", (config.height + config.axis_margins.bottom) / 2).text(config.y_label);

	var xg = d3.select(node).selectAll('.x-axis');
	xg.attr("transform", "translate(" + config.axis_margins.left + ", " + config.height + ")").call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-0.5em").attr("dy", "0.75em").attr("transform", "rotate(-65)");

	var yg = d3.select(node).selectAll('.y-axis');
	yg.attr("transform", "translate(" + config.axis_margins.left + ", 0)").call(yAxis);

	var xticks = xg.selectAll(".tick");
	d3.select(xticks[0][0]).attr("visibility", "hidden"); //Hide first tick to add left padding
	d3.select(xticks[0][xticks[0].length - 1]).attr("visibility", "hidden"); //Hide last tick to add right padding
	d3.select(yg.selectAll(".tick")[0][0]).attr("visibility", "hidden"); //Hide tick at 0
};

d3Chart._drawBars = function (node, config, scales, data, dispatcher) {
	var barwidth = scales.width / data.length - 10;

	var g = d3.select(node).selectAll('.d3-bars');

	var bar = g.selectAll('.d3-bar').data(data);

	//Enter
	bar.enter().append('rect').attr('class', function (d) {
		return 'd3-bar d3-zcolor-' + d.z;
	});

	//Update
	bar.attr('x', function (d) {
		return config.axis_margins.left + scales.xscale(d.x) + barwidth * scales.zscale(d.z);
	}).attr('y', function (d) {
		return scales.yscale(d.y);
	}).attr('width', barwidth).attr('height', function (d) {
		return scales.height - scales.yscale(d.y);
	}).on('click', function (d) {
		var this_bar = d3.select(this);
		var myclass = this_bar.attr('class');
		var highlight = "-highlight";
		if (myclass.indexOf(highlight) > -1) {
			//if it is highlighted
			myclass = myclass.replace(highlight, "");
		} else {
			myclass = myclass + highlight;
		}
		this_bar.attr('class', myclass);
		dispatcher.emit('bar:click', d);
	});
};

d3Chart._drawLegend = function (node, config, zmap) {
	var legend = d3.select(node).selectAll(".legend").attr("transform", function (d) {
		return "translate(" + (config.width + config.axis_margins.left) + ", 150)";
	});

	var label = legend.selectAll('.label').data(zmap);

	label.enter().append("text").attr("class", "label").attr("x", 24).attr("y", function (d) {
		return 9 + 30 * d.value;
	}).attr("dy", ".35em").style("text-anchor", "end").text(function (d) {
		return d.text;
	});

	label.enter().append("rect").attr("class", function (d) {
		return 'label d3-zcolor-' + d.value;
	}).attr("x", 50).attr("y", function (d) {
		return 30 * d.value;
	}).attr("width", 18).attr("height", 18);
};

d3Chart._scales = function (node, config, domain) {
	if (!domain) {
		return null;
	}
	var x_min = domain.xdomain[0];
	var x_max = domain.xdomain[domain.xdomain.length - 1];
	var shifted_xdomain = [x_min - 1, x_max + 1]; //Adds x-axis padding on either end, ticks will be hidden

	console.log(shifted_xdomain);
	var width = config.width - 20; //To avoid cutting off the right side of the x axis
	var height = config.height;

	var x = d3.scale.linear().range([0, width]).domain(shifted_xdomain);

	var y = d3.scale.linear().range([height, 20]) //To avoid cutting off the top of the y axis
	.domain(domain.ydomain);

	//We want to use the zdomain to shift the columns to be centered around their x values
	var max_z = domain.zdomain[domain.zdomain.length - 1];
	var halfpoint = max_z * 1.0 * 0.5;

	var zrange = [];

	for (i = 0; i < domain.zdomain.length; i++) {
		zrange.push(domain.zdomain[i] - halfpoint);
	}

	var z = d3.scale.ordinal().range(zrange).domain(domain.zdomain);

	return { xscale: x, yscale: y, zscale: z, width: width, height: height };
};

module.exports = d3Chart;