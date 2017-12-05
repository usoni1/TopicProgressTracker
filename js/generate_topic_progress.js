//todo put this in a function and call on windows.onload
var svg = d3.select("#topic_progress_svg"),
    margin = {top: 5, left: 25, right: 10, bottom: 30},
    width = $("#topic_progress_svg").width() - margin.left - margin.right,
    height = $("#topic_progress_svg").height() - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + ", " + margin.right + ")"),
    padding = 0.8;

    var username = "user20"; //todo use this as a function argument
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

    uid = 0;

    g.selectAll("#topic_progress .bar")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar")
        // .attr("transform", function(d) {return "translate(0, -" + y(d.reduce(function(acc, value) {return acc + value.number_of_questions}, 0))/2 + ")"})
        .selectAll("rect")
        .data(function (d) { return d;})
        .enter()
        .append("rect")
        .attr("class", "bars_rect")
        .attr("fill", function(d) {return z(d.topic_name);})
        .attr("x", function(d) {return x(d.session_no);})
        .attr("y", function(d) {return y(d.running_total);})
        .attr("width", x.bandwidth())
        .attr("height", function(d) {return y(d.running_total - d.number_of_questions) - y(d.running_total);});

    d3.selectAll("#topic_progress rect")
        .each(function (d) {
           uid += 1;
           d.uid = uid;
           d.is_name_req = true;
        });

    var bars = d3.selectAll('#topic_progress .bar');

    uid = 0;

    bars.selectAll("clipPath")
        .data(function(d) {return d;})
        .enter()
        .append("clipPath")
        .attr("id", function(d) {return "clipPath" + d.uid;})
        .attr("x", function(d) {return x(d.session_no);})
        .attr("y", function(d) {return y(d.running_total);})
        .attr("width", x.bandwidth())
        .attr("height", function(d) {return y(d.running_total - d.number_of_questions) - y(d.running_total);});

    d3.selectAll("#topic_progress clipPath")
        .each(function (d) {
            uid += 1;
            d.uid = uid;
        });

    bars.each(function (p, j, nodes) {
        if(typeof nodes[j+1] !== 'undefined') {
            this_node = d3.select(nodes[j]);
            next_node = d3.select(nodes[j+1]);
            this_node_rect = this_node.selectAll('rect');
            next_node_rect = next_node.selectAll('rect');
            area_data = [];

            var area = d3.area()
                            .x(function(d) {return d[0];})
                            .y0(function(d) {return d[1];})
                            .y1(function(d) {return d[2];});

            this_node_rect.each(function (p1, j1, nodes1) {
                next_node_rect.each(function (p2, j2, nodes2) {
                    if (p1.topic_name === p2.topic_name) {
                        lr = d3.select(nodes1[j1]);
                        rr = d3.select(nodes2[j2]);

                        x1 = String(parseInt(lr.attr("x")) + parseInt(lr.attr("width")));
                        y1 = lr.attr("y");
                        x0 = x1;
                        y0 = String(parseInt(lr.attr("y")) + parseInt(lr.attr("height")));

                        x3 = rr.attr("x");
                        y3 = rr.attr("y");
                        x2 = x3;
                        y2 = String(parseInt(rr.attr("y")) + parseInt(rr.attr("height")));

                        var t2 = [[x0, y0, y1], [x2, y2, y3]];
                        t2.topic_name = p1.topic_name;
                        area_data.push(t2);

                    }
                });
            });

            this_node.selectAll("path")
                    .data(area_data)
                    .enter()
                    .append("path")
                    .attr("class", "area")
                    .style("fill", function(d) { return z(d.topic_name);})
                    .attr("d", area);

        }
    });

    bars.each(function (p, j, nodes) {
        if(typeof nodes[j+1] !== 'undefined') {
            this_node = d3.select(nodes[j]);
            next_node = d3.select(nodes[j+1]);
            this_node_rect = this_node.selectAll('rect');
            next_node_rect = next_node.selectAll('rect');

            this_node_rect.each(function (p1, j1, nodes1) {
                next_node_rect.each(function (p2, j2, nodes2) {
                    if (p1.topic_name === p2.topic_name) {
                        p2.is_name_req = false;
                        if (p1.is_name_req) {
                            lr = d3.select(nodes1[j1]);
                            x1 = String(parseInt(lr.attr("x")) + parseInt(lr.attr("width")));
                            y1 = lr.attr("y");
                            x0 = x1;
                            y0 = String(parseInt(lr.attr("y")) + parseInt(lr.attr("height")));
                            this_node
                                .append("text")
                                .attr("class", "bar_text")
                                .attr("x", x0)
                                .attr("y", y0)
                                .attr("transform", "rotate(-90, "+ x0 + ", " + y0 + ")")
                                .attr("clip-path", "url(#clipPath)" + p1.uid)
                                .text("hey");

                        }

                        rr = d3.select(nodes2[j2]);



                        x3 = rr.attr("x");
                        y3 = rr.attr("y");
                        x2 = x3;
                        y2 = String(parseInt(rr.attr("y")) + parseInt(rr.attr("height")));


                    }
                });
            });
        }
    });