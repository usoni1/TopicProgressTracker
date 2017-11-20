//todo put this in a function and call on windows.onload
var svg = d3.select("#topic_progress_svg"),
    margin = {top: 5, left: 25, right: 10, bottom: 30},
    width = $("#topic_progress_svg").width() - margin.left - margin.right,
    height = $("#topic_progress_svg").height() - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + ", " + margin.right + ")"),
    padding = 0.6;

    var username = "user1"; //todo use this as a function argument
    var data = user_session_history;

    data = data.filter(function(t) {
        return t.username === username;
    })[0]["user_sessions"];

    var session_no = 0;
    data.forEach(function (t)
    {
        var acc = 0;
        session_no += 1;
        t = t.map(function (x) {
           acc += x.number_of_questions;
           x.running_total = acc;
           x.session_no = session_no;
           return x;
        });
    });

    var x = d3.scaleBand();
    x.domain(d3.range(1, data.length + 1));
    x.range([0, width]);
    x.padding(padding);

    var max_questions =
        d3.max(data.map(function (t) { return t.reduce(function(acc, value) {return acc + value.number_of_questions}, 0)}));

    var y = d3.scaleLinear();
    y.domain([0, max_questions]);
    y.range([height , 0]);

    var z = d3.scaleOrdinal(d3.schemeCategory20)
        .domain(topic_list);


    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y));

    g.selectAll("#topic_progress .bar")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar")
        .selectAll("rect")
        .data(function (d) { return d;})
        .enter()
        .append("rect")
        .attr("fill", function(d) {return z(d.topic_name);})
        .attr("x", function(d) {return x(d.session_no);})
        .attr("y", function(d) {return y(d.running_total);})
        .attr("width", x.bandwidth())
        .attr("height", function(d) {return y(d.running_total - d.number_of_questions) - y(d.running_total);});
