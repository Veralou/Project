    var pcz;

  // color scale for zscores
  var zcolorscale = d3.scale.linear()
                  .domain([0, 0.01, 0.05, 0.08, 0.1])
                  .range(["#A0FF1F", "#E8781A", "#FF2A9A", "#331AE8", "#32FBFF"])
                  .interpolate(d3.interpolateLab);


  // var xAxis = d3.svg.axis()
  //     .scale(y)
  //     .tickValues([1, 2, 3, 5, 8, 13, 21]);


  // load csv file and create the chart
  d3.csv('data/data.csv', function(data) {
    pcz = d3.parcoords()("#graph")
      .data(data)
      .render()
      .alpha(0.6)
      .brushMode("1D-axes")  // enable brushing
      .interactive()  // command line mode

    change_color("Percentage");

    // click label to activate coloring
    pcz.svg.selectAll(".dimension")
      .selectAll(".label")
      .style("font-size", "14px");
  });

  // update color
  function change_color(dimension) {
    pcz.svg.selectAll(".dimension")
      .style("font-weight", "normal")
      .filter(function(d) { return d == dimension; })
      .style("font-weight", "bold")

    pcz.color(zcolor(pcz.data(),dimension)).render()
  }

  // return color function based on plot and dimension
  function zcolor(col, dimension) {
    var z = zscore(_(col).pluck(dimension).map(parseFloat))
    return function(d) { return zcolorscale(z(d[dimension])) }
  };

  // color by zscore
  function zscore(col) {
    var n = col.length,
        mean = _(col).mean(),
        sigma = _(col).stdDeviation();
    return function(d) {
      return (d-mean)/sigma;
    };
  };