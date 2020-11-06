var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("http://localhost:8888/lab1/iris.csv", function(data) {

  var x = d3.scaleLinear()
    .domain([0, data.length])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  var y = d3.scaleLinear()
    .domain([0, 10])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));
  
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.Id); } )
      .attr("cy", function (d) { return y(d.SepalLengthCm); } )
      .attr("r", 3)
      .style("fill", "red")

  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("path")
      .attr("d", d3.symbol().type(d3.symbolSquare).size(20))
      .attr("transform", function(d) { return "translate(" +  x(d.Id) + "," + y(d.PetalLengthCm) + ")";} )
      .style("fill", "blue")

})