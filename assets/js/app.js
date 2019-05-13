// set up svg dimensions
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

// Import Data
d3.csv("assets/data/data.csv")
  .then(function(data) {

    // Parse Data and cast as numbers
    data.forEach(function(d) {
      d.income = +d.income;
      d.obesity = +d.obesity;
    });

    // console.log("I made it past CSV read/parse");

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([38000, d3.max(data, d => d.income)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([20, d3.max(data, d => d.obesity)])
      .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Set up circles based on income vs obesity
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "stateCircle")
        .attr("cx", data => xLinearScale(data.income))
        .attr("cy", data => yLinearScale(data.obesity))
        .attr("r", "12")
        .attr("fill", "gray")
        .attr("opacity", ".5");

    // Set up state abbreviation text to align with circles
    var textGroup = chartGroup.selectAll("tspan")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "stateText")
      .attr("x", data => xLinearScale(data.income))
      .attr("y", data => yLinearScale(data.obesity) +6)
      .text(data => data.abbr);


    // Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Income: ${d.income}<br>Obesity: ${d.obesity}`);
      });

    // Create tooltip in the chart    
    chartGroup.call(toolTip);

    // Create event listeners for displaying and hiding the tooltip
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Household Income (Median)");
  });
