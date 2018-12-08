// @TODO: YOUR CODE HERE!

path = 'assets/data/data.csv';

d3.csv(path, (error, data) => {

	// log error if exists
	if (error) return console.warn(error);
	
	// print data to console
	console.log(data);
});
