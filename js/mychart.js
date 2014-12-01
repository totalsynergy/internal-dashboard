/*var series2 = [
  {"x" : 1, "y" : 2, "name"  :"test"},
  {"x" : 3, "y" : 9},
  {"x" : 5, "y"  :4}
];


function myData() {
    var series1 = [];
    for(var i =1; i < 6; i ++) {
        series1.push({
            x: i, y: 6 / i
        });
    }

    return [
        {
            //key: "",
            values: series1,
            color: "#0000ff"
        }
    ];
}

nv.addGraph(function() {
    var chart = nv.models.discreteBarChart();


    chart.xAxis
        .tickFormat("");

    chart.yAxis
        .tickFormat("");

    d3.select("svg")
        .datum(myData())
        .transition().duration(500).call(chart)
        .showYAxis(false);


    nv.utils.windowResize(
            function() {
                chart.update();
            }
        );

    return chart;
}); */