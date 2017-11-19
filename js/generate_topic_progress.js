//todo put this in a function and call on windows.onload
var svg = d3.select("#topic_progress_svg"),
    margin = {top: 10, left: 10, right: 10, bottom: 10},
    width = $("#topic_progress_svg").width() - margin.left - margin.right,
    height = $("#topic_progress_svg").height() - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + ", " + margin.right + ")");

    var x = d3.scaleBand();
    x.domain(d3.range([1, 30]));
    x.range([0, width]);
    x.padding(0.1);

    var y = d3.scaleLinear();
    y.domain([1, 30]);
    y.range([0 , height]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y));

