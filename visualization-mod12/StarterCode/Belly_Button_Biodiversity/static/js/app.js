function buildMetadata(sample) {

  // BUILD METADATA
  // Use `.html("") to clear any existing metadata
  var metaData = d3.select("#sample-metadata").html('');

  // Use `d3.json` to fetch the metadata for a sample
  // Populate panel with each key and value object pair
  d3.json(`/metadata/${sample}`).then((metadata) => {
    Object.entries(metadata).forEach(([key,value]) => {
        metaData
        .append("p")
        .append("b")
        .text(`${key.toUpperCase()}: ${value}`)
    });
  });

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  d3.json(`/samples/${sample}`).then(response => {
    
    // PIE CHART
    var trace1 = {
      labels: response.otu_ids.slice(0,10),
      values: response.sample_values.slice(0,10),
      text: response.otu_labels.slice(0,10),
      type: 'pie'
    };

    var data1 = [trace1];

    Plotly.newPlot('pie', data1)

    // BUBBLE CHART
    var trace2 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: 'markers',
      marker: {
        color: response.otu_ids,
        size: response.sample_values
      }
    }

    var data2 = [trace2];

    Plotly.newPlot('bubble', data2);

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(`BB_${sample}`)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);

    console.log(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
