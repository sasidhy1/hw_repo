// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
	// create scales
	var xLinearScale = d3.scaleLinear()
		.domain([d3.min(data, d => d[chosenXAxis]) * 0.8, d3.max(data, d => d[chosenXAxis]) * 1.2])
		.range([0, width]);

	return xLinearScale;
}

function yScale(data, chosenYAxis) {
	// create scales
	var yLinearScale = d3.scaleLinear()
		.domain([d3.max(data, d => d[chosenYAxis]) * 1.2, d3.min(data, d => d[chosenYAxis]) * 0.8])
		.range([0, height]);

	return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
	var bottomAxis = d3.axisBottom(newXScale);

	xAxis.transition()
		.duration(1000)
		.call(bottomAxis);

	return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

	circlesGroup.transition()
		.duration(1000)
		.attr("cx", d => newXScale(d[chosenXAxis]));

	return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

	if (chosenXAxis === "poverty") {
		var label = "Poverty %:";
	} else if (chosenXAxis === "age") {
		var label = "Median age:";
	} else {
		var label = "Household Income:";
	}

	var toolTip = d3.tip()
		.attr("class", "tooltip")
		.offset([80, -60])
		.html(function(d) {
			return (`${d.state}<br>${label}: ${d[chosenXAxis]}`);
		});

	circlesGroup.call(toolTip);

	circlesGroup.on("mouseover", function(data) {
		toolTip.show(data);
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

	// xLinearScale function above csv import
	var xLinearScale = xScale(data, chosenXAxis);

	// Create y scale function
	var yLinearScale = yScale(data, chosenYAxis);

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

});
