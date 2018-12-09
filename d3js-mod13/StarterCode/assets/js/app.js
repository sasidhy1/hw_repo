// function used for updating scales on clicking axis labels
function linearScales(data, chosenXAxis, chosenYAxis) {
	var xLinearScale = d3.scaleLinear()
		.domain([d3.min(data, d => d[chosenXAxis]) * 0.8, d3.max(data, d => d[chosenXAxis]) * 1.2])
		.range([0, width]);

	var yLinearScale = d3.scaleLinear()
		.domain([d3.max(data, d => d[chosenYAxis]) * 1.2, d3.min(data, d => d[chosenYAxis]) * 0.8])
		.range([0, height]);

	return [xLinearScale, yLinearScale];
}

// function used for rendering axes on clicking axis labels
function renderAxes(newXScale, newYScale, xAxis, yAxis) {
	var bottomAxis = d3.axisBottom(newXScale);
	var leftAxis = d3.axisLeft(newYScale);

	xAxis.transition()
		.duration(1000)
		.call(bottomAxis);

	yAxis.transition()
		.duration(1000)
		.call(leftAxis);

	return [xAxis, yAxis];
}

// function used for updating circles group with transitions for new data
// keep separate from renderAbbr(), use attr('cx') instead of attr('x')
function renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {
	circlesGroup.transition()
		.duration(1000)
		.attr('cx', d => newXScale(d[chosenXAxis]))
		.attr('cy', d => newYScale(d[chosenYAxis]));

	return circlesGroup;
}

// function used for updating label group with transitions for new data
// keep separate from renderCircles(), use attr('x') instead of attr('cx')
function renderAbbr(abbrGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
	abbrGroup.transition()
		.duration(1000)
		.attr('x', d => newXScale(d[chosenXAxis]))
		.attr('y', d => newYScale(d[chosenYAxis]) + 3);

	return abbrGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

	if (chosenXAxis === "poverty") {
		var label = "Poverty";
	} else if (chosenXAxis === "age") {
		var label = "Age";
	} else {
		var label = "Income";
	}

	var toolTip = d3.tip()
		.attr("class", "tooltip")
		.offset([80, -60])
		.html(function(d) {
			return (`${d.state}<br>${label}: ${d[chosenXAxis]}%<br>Obesity: ${d.obesity}%`);
		});

	circlesGroup.call(toolTip);

	circlesGroup.on("mouseover", function(data) {
		toolTip.show(data, this);		// special this?
	})
		// onmouseout event
		.on("mouseout", function(data, index) {
			toolTip.hide(data);
		});

	return circlesGroup;
}

var svgWidth = 960;
var svgHeight = 500;

var margin = {
	top: 20,
	right: 40,
	bottom: 80,
	left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
	.select("#scatter")
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";	// age, income
var chosenYAxis = "obesity";	// smokes, noHealthInsurance

path = 'assets/data/data.csv';
d3.csv(path, (error, data) => {

	// log error if exists
	if (error) return console.warn(error);
	
	// parse data
	data.forEach(data => {
		data.poverty = +data.poverty;
		data.age = +data.age;
		data.income = +data.income;
		data.obesity = +data.obesity;
		data.smokes = +data.smokes;
		data.healthcare = +data.healthcare;
	});
	
	// print data to console
	console.log(data);

	// create linear x/y-scale functions
	var xLinearScale = linearScales(data, chosenXAxis, chosenYAxis)[0];
	var yLinearScale = linearScales(data, chosenXAxis, chosenYAxis)[1];

	// Create initial axis functions
	var bottomAxis = d3.axisBottom(xLinearScale);
	var leftAxis = d3.axisLeft(yLinearScale);

	// append x axis
	var xAxis = chartGroup.append("g")
		.classed("x-axis", true)
		.attr("transform", `translate(0, ${height})`)
		.call(bottomAxis);

	// append y axis
	var yAxis = chartGroup.append("g")
		.classed("y-axis", true)
		.call(leftAxis);

	// append initial circles
	var circlesGroup = chartGroup.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", d => xLinearScale(d[chosenXAxis]))
		.attr("cy", d => yLinearScale(d[chosenYAxis]))
		.attr("r", 12)
		.attr("stroke", "whitesmoke")
		.attr("stroke-width", 1)
		.attr("fill", "lightblue")
		.attr("opacity", 0.95)

	var abbrGroup = chartGroup.selectAll("text")
		.data(data)
		.enter()
		.append("text")
		.attr("x", d => xLinearScale(d[chosenXAxis]))
		.attr("y", d => yLinearScale(d[chosenYAxis]) + 3)
		.attr('fill','white')
		.attr('font-weight','bold')
		.attr('font-size',10)
		.attr('text-anchor','middle')
		.text(d => d.abbr);

	// Create group for	3 x-axis labels
	var xLabelsGroup = chartGroup.append("g")
		.attr("transform", `translate(${width / 2}, ${height + 20})`);

	var povertyLabel = xLabelsGroup.append("text")
		.attr("x", 0)
		.attr("y", 20)
		.attr("value", "poverty") // value to grab for event listener
		.classed("active", true)
		.text("In Poverty (%)");

	var ageLabel = xLabelsGroup.append("text")
		.attr("x", 0)
		.attr("y", 40)
		.attr("value", "age") // value to grab for event listener
		.classed("inactive", true)
		.text("Age (Median)");

	var incomeLabel = xLabelsGroup.append("text")
		.attr("x", 0)
		.attr("y", 60)
		.attr("value", "income") // value to grab for event listener
		.classed("inactive", true)
		.text("Household Income (Median)");

	// Create group for	3 y-axis labels
	var yLabelsGroup = chartGroup.append("g")
		.attr("transform", "rotate(-90)");

	var obesityLabel = yLabelsGroup.append("text")
		.attr("y", 0 - margin.left)
		.attr("x", 0 - (height / 2))
		.attr("dy", "1em")
		.attr("value", "obesity") // value to grab for event listener
		.classed("axis-text", true)
		.classed("active", true)
		.text("Obese (%)");

	var smokesLabel = yLabelsGroup.append("text")
		.attr("y", 20 - margin.left)
		.attr("x", 0 - (height / 2))
		.attr("dy", "1em")
		.attr("value", "smokes") // value to grab for event listener
		.classed("axis-text", true)
		.classed("inactive", true)
		.text("Smokes (%)");

	var healthcareLabel = yLabelsGroup.append("text")
		.attr("y", 40 - margin.left)
		.attr("x", 0 - (height / 2))
		.attr("dy", "1em")
		.attr("value", "healthcare") // value to grab for event listener
		.classed("axis-text", true)
		.classed("inactive", true)
		.text("Lacks Healthcare (%)");

	// updateToolTip function above csv import
	var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

	// x axis labels event listener
	xLabelsGroup.selectAll("text")
		.on("click", function() {
			// get value of selection
			var value = d3.select(this).attr("value");
			if (value !== chosenXAxis) {

				// update chosen x-axis
				chosenXAxis = value;

				// update x-scale and x-axis transition for chosen x-axis
				xLinearScale = linearScales(data, chosenXAxis, chosenYAxis)[0];
				xAxis = renderAxes(xLinearScale, yLinearScale, xAxis, yAxis)[0];

				// update circle and text coordinates for new data
				circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
				abbrGroup = renderAbbr(abbrGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

				// updates tooltips with new info
				circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

				// modify classes to indicate chosen x-axis
				if (chosenXAxis === 'poverty') {
					povertyLabel.classed('active', true).classed('inactive', false);
					ageLabel.classed('active', false).classed('inactive', true);
					incomeLabel.classed('active', false).classed('inactive', true);

				} else if (chosenXAxis === 'age') {
					povertyLabel.classed('active', false).classed('inactive', true);
					ageLabel.classed('active', true).classed('inactive', false);
					incomeLabel.classed('active', false).classed('inactive', true);

				} else {
					povertyLabel.classed('active', false).classed('inactive', true);
					ageLabel.classed('active', false).classed('inactive', true);
					incomeLabel.classed('active', true).classed('inactive', false);
				}
			}
		});

	// y axis labels event listener
	yLabelsGroup.selectAll("text")
		.on("click", function() {
			// get value of selection
			var value = d3.select(this).attr("value");
			if (value !== chosenYAxis) {

				// update chosen y-axis
				chosenYAxis = value;

				// update y-scale and y-axis transition for chosen y-axis
				yLinearScale = linearScales(data, chosenXAxis, chosenYAxis)[1];
				yAxis = renderAxes(xLinearScale, yLinearScale, xAxis, yAxis)[1];

				// update circle and text coordinates for new data
				circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
				abbrGroup = renderAbbr(abbrGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

				// updates tooltips with new info
				circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

				// modify classes to indicate chosen y-axis
				if (chosenYAxis === 'obesity') {
					obesityLabel.classed('active', true).classed('inactive', false);
					smokesLabel.classed('active', false).classed('inactive', true);
					healthcareLabel.classed('active', false).classed('inactive', true);

				} else if (chosenYAxis === 'smokes') {
					obesityLabel.classed('active', false).classed('inactive', true);
					smokesLabel.classed('active', true).classed('inactive', false);
					healthcareLabel.classed('active', false).classed('inactive', true);

				} else {
					obesityLabel.classed('active', false).classed('inactive', true);
					smokesLabel.classed('active', false).classed('inactive', true);
					healthcareLabel.classed('active', true).classed('inactive', false);
				}
			}
		});

});
