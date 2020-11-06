const DATA = [
  {id:1,value:10,name:"Kaz"},
  {id:2,value:5,name:"Rus"},
  {id:3,value:3,name:"Kyr"},
  {id:4,value:1,name:"Ukr"}
]

let showData = DATA;

const listItems = d3.select('ul')
.selectAll('li')
.data(DATA, (data)=>data.name)
.enter()
.append('li');

listItems.append('span')
.text((data)=>data.name);


const xScale = d3.scaleBand()
.domain(DATA.map( (dp) => dp.name )).rangeRound([0,250]).padding(0.1);

const yScale = d3.scaleLinear().domain([0,12]).rangeRound([0,200]);


const container = d3.select("svg")
.append('g')
.call(d3.axisBottom(xScale))
.attr('color','#DD1111')

const bars = container
.selectAll(".bar")
.data(showData)
.enter()
.append('rect')
.classed('bar',true)
.attr('width',xScale.bandwidth())
.attr('height',data=>yScale(data.value))
.attr('x',data=>xScale(data.name))
.attr('y', data=>200-yScale(data.value));


listItems
.append('input')
.attr('type','checkbox')
.attr('checked',true)
.attr('id',(data)=>data.id)
.on('change', (event)=>{
  target = event.target;
  cid = parseInt(target.id);
  selectedData = DATA.filter((el) => el.id === cid);

  if (target.checked === true) {
    if (showData.includes(selectedData[0]) === false) {
      showData.push(selectedData[0]);
    }
  } else {
    if (showData.includes(selectedData[0]) === true) {
      showData = showData.filter(function(el) { 
        return el.id !== selectedData[0].id;
      });
    }
  }

  console.log(showData);
  update(showData);
});

function update(data) {
  var u = container
    .selectAll('.bar')
    .data(data, (data) => data.name);

  u.enter()
    .append('rect')
    .classed('bar',true)
    .attr('width',xScale.bandwidth())
    .attr('height',data=>yScale(data.value))
    .attr('x',data=>xScale(data.name))
    .attr('y', data=>200-yScale(data.value))
    .merge(u);

  u.exit().remove();
}