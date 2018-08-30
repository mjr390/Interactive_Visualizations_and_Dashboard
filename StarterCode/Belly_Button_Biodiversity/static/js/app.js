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
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var plotData = `/samples/${sample}`
  d3.json(plotData).then(function(plotInfo){
    console.log(plotInfo)

    var pieChart = {
      values: plotInfo.sample_values.slice(0,10),
      labels: plotInfo.otu_ids.slice(0,10),
      hoverinfo: plotInfo.otu_labels.slice(0,10),
      type: "pie"
    };
   var testP = [pieChart]

   var pieLayout = {
     height: 600,
     width: 600
   }
   
    Plotly.newPlot("pie", testP, pieLayout)


  });

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

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
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  console.log("optionChanged Worked!");
}

// Initialize the dashboard
init();
