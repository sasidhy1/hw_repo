// from data.js
var tableData = data;

var submit = d3.select('#filter-btn');

submit.on('click', function() {

	d3.event.preventDefault();

	var inputElement = d3.select('#datetime');

	var inputValue = inputElement.property('value');

	console.log(inputValue);
}


