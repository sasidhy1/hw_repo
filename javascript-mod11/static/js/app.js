// from data.js
var tableData = data;

// select filter button
var submit = d3.select('#filter-btn');

submit.on('click', function() {

	// prevent form reset
	d3.event.preventDefault();

	// select input form
	var inputElement = d3.select('#datetime');

	// return entered value
	var inputValue = inputElement.property('value');

	// filter data for matching datetime
	var filteredData = data.filter(entry => entry.datetime == inputValue);

	// create new row for each entry
	filteredData.forEach(entry => {
		var newRow = d3.select('.table-data').append('tr');

		// enter table data for each value
		Object.values(entry).forEach(value => {
			newRow.append('td').text(value);
		});
		
	});

});


