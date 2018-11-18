// from data.js
var tableData = data;

var arr = ['#datetime','#city','#state','#country','#shape'];

function displayData(data) {
	data.forEach(entry => {
		var newRow = d3.select('.table-data').append('tr');

		// enter table data for each value
		Object.values(entry).forEach(value => {
			newRow.append('td').text(value);
		});
	});
}

function submitHandler() {

	// prevent form reset
	d3.event.preventDefault();

	// clear table before query
	d3.selectAll('tr').remove();

	arr.forEach(filterType => {
	
		// select input form
		var inputElement = d3.select(filterType);

		// return entered value
		var inputValue = inputElement.property('value');

		// filter data for matching datetime
		var filteredData = data.filter(entry => entry[filterType.slice(1)] == inputValue);

		// create new row for each entry
		displayData(filteredData);
	});
}

// select filter button
var submit = d3.select('#filter-btn');

// display original data
displayData(data);

submit.on('click', submitHandler);