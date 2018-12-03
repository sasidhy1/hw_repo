function buildGauge(wfreq) {

var scaledFreq = d3.scaleLinear()
  .domain([0, 9])
  .range([0, 180]);

// Enter a speed between 0 and 180
var level = scaledFreq(wfreq);

// Trig to calc meter point
var degrees = 180 - level,
     radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

trace1 = {
  type: 'scatter',
  x: [0],
  y:[0],
  marker: { size: 28, color:'850000' },
  showlegend: false,
  name: 'Freq',
  text: wfreq,
  hoverinfo: 'text+name'
}

trace2 = {
  values: [20/9, 20/9, 20/9, 20/9, 20/9, 20/9, 20/9, 20/9, 20/9, 20],
  rotation: 90,
  text: [ '8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', '' ],
  textinfo: 'text',
  textposition:'inside',
  marker: { colors: [ '#84B589', '#91BE8C', '#A2C694', '#B4CE9D', '#C5D5A7', '#D6DCB1', '#E5E3C0', '#F0EAD8', '#F8F3EC', '#FFFFFF' ]},
  labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', '' ],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}

var data = [trace1, trace2];

var layout = {
  shapes: [{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: { color: '850000' } }],
  title: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week',
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout);

}

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

  // GAUGE CHART
  buildGauge(metadata.WFREQ);

  });

}

function buildCharts(sample) {

  d3.json(`/samples/${sample}`).then(response => {
    
    // PIE CHART
    var trace1 = {
      labels: response.otu_ids.slice(0,10),
      values: response.sample_values.slice(0,10),
      hovertext: response.otu_labels.slice(0,10),
      hoverinfo: 'label+value+text+percent',
      type: 'pie'
    };

    var data1 = [trace1];

    var layout = {
      title: '<b>Top 10 Belly Button Samples</b>'
    };

    Plotly.newPlot('pie', data1, layout)

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

    var layout = {
      title: '<b>Belly Button Samples Collected</b><br>Listed by ID',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: '# of Samples' }
    };

    Plotly.newPlot('bubble', data2, layout);

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
