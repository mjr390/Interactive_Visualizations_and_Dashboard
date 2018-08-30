function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var meta = `/metadata/${sample}`
  d3.json(meta).then(function(response){
    console.log(response)
  
    // Use d3 to select the panel with id of `#sample-metadata`
      var table = d3.select("#sample-metadata").html("")
    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

      var cell = table.append("td");
        Object.entries(response).forEach(([key, value]) => {
          console.log(key, value)
          
          var row = cell.append("tr");
          row.text(`${key}: ${value}`);
      });
  
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

function buildGuage(sample){
  var data1 = `/metadata/${sample}`
  d3.json(data1).then(function(response){
    var wfreq = response.WFREQ;
    console.log(wfreq)

    // Enter a speed between 0 and 180

var degeeeScale = d3.scaleLinear()
  .domain([0, 9])
  .range([0, 180]);


// Trig to calc meter point
var degrees = 180 - degeeeScale(wfreq),
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

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    
    text: wfreq,
    },
  { values: [9/8, 9/8, 9/8, 9/8, 9/8, 9/8, 9/8, 9/8, 9],
  rotation: 180,
  text: ['8-9', '7-8', '6-7', '5-6',
            '4-5', '3-4', '2-3', '1-2', '0-1', ''],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                         'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                         'rgba(255, 255, 255, 0)']},
  labels: ['9-8', '8-7', '7-6', '6-5', '5-4', '4-3', '3-2', '2-1', '1-0', ''],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: 'WFREQ',
  height: 400,
  width: 400,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};
Plotly.newPlot('gauge', data, layout);

  })
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var plotData = `/samples/${sample}`
  d3.json(plotData).then(function(plotInfo){
    console.log(plotInfo)

    var pieChart = {
      values: plotInfo.sample_values.slice(0,10),
      labels: plotInfo.otu_ids.slice(0,10),
      hoverinfo: plotInfo.otu_labels.slice(0,10),
      text: plotInfo.otu_labels.slice(0,10),
      type: "pie"
    };
   var testP = [pieChart]

   var pieLayout = {
     height: 400,
     width: 400
   }
   
    Plotly.newPlot("pie", testP, pieLayout)

    var bubbleChart ={
      x: plotInfo.otu_ids,
      y: plotInfo.sample_values,
      mode: 'markers',
      marker: {
        color: plotInfo.otu_ids,
        size: plotInfo.sample_values
      },
      text: plotInfo.otu_labels
    };
    Plotly.newPlot("bubble", [bubbleChart])


  });

};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGuage(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGuage(newSample);
  console.log("optionChanged Worked!");
}

// Initialize the dashboard
init();
