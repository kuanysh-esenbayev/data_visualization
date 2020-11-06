var margin = 200;
var svg = d3.select("svg");
var width = svg.attr("width") - margin;
var height = svg.attr("height") - margin;

svg.append("text")
.attr("transform","translate(100,0)")
.attr("x",50)
.attr("y",50)
.attr("class","title")
.text("Total cost of selled products");

var xScale = d3.scaleBand().range([0, width]).padding(0.4);
var yScale = d3.scaleLinear().range([height,0]);

var g = svg.append("g");
g.attr("transform","translate(100,100)");


d3.csv("http://localhost:8888/lab3/store.csv", function(data){

  var parsed = data.map(function(el) {
    function getYear(el) {
      return parseInt(el.Date.split(".")[2]); 
    }
    
    return {
      year: getYear(el),
      cost: parseInt(el.Total)
    }
  })
  
  var allGroup = d3.map(parsed, function(d){
    return d.year
  }).keys()


  function calculateSum(year){ 
    var filtered = parsed.filter(function(fe) {
      return fe.year === parseInt(year);
    });
    return d3.sum(filtered, (fs) => fs.cost);
  };

  function calculateAvg(year) {
    var filtered = parsed.filter(function(fe) {
      return fe.year === parseInt(year);
    });
    return d3.mean(filtered, (fs) => fs.cost);
  };
  
  var DATA = [];

  for(i in allGroup){
      DATA.push({
        year: allGroup[i],
        sum: calculateSum(allGroup[i]),
        mean: calculateAvg(allGroup[i])
      });
  };


  var data = DATA;
  
  xScale.domain(data.map(function(d) { return d.year;}));
  yScale.domain([0,d3.max(data, function(d) {return d.sum;})]);
  
  g.append("g")
  .attr("transform","translate(0,"+height+")")
  .call(d3.axisBottom(xScale));
  
  
  g.append("g")
  .call(d3.axisLeft(yScale));
  

  var Tooltip = d3.select("#tooltip")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")
  .style("position", "absolute")
  

  var onMouseover = function(d) {
    Tooltip
      .style("opacity", 1)
  }
  var onMousemove = function(d) {
    Tooltip
      .html("<p> Sum is: " + d.sum + " </p> <p> Mean is: " + d.mean + " </p>")
      .style("left", (d3.mouse(this)[0]+120) + "px")
      .style("top", (d3.mouse(this)[1]) + "px");
  }
  var onMouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
      .style("left", 0)
      .style("top", 0)
  }
  
  g.selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("class","bar")
  .attr("x", (d)=>xScale(d.year))
  .attr("y", (d)=>yScale(d.sum))
  .attr("width", xScale.bandwidth())
  .on("mouseover", onMouseover)
  .on("mousemove", onMousemove)
  .on("mouseleave", onMouseleave)
  .transition()
  .ease(d3.easeLinear)
  .duration(500)
  .delay((d,i)=>i*50)
  .attr("height", (d)=>height-yScale(d.sum));
});