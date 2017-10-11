angular
    .module('angularApp')
    .directive('donutView', [
        'angularService',
        '$timeout',
        function (angularService, $timeout) {
            return {
                restrict: 'AEC',
                scope: {
                    data: '='
                },
                link: renderView
            };

            function renderView($scope, $element, $attrs) {

                // initial coordinate
                var width = $attrs.width,
                    height = $attrs.height,
                    radius = Math.min(width, height) / 2;;

                // initial colors
                var colors = d3
                    .scale
                    .category20();

                var pie = d3
                    .layout
                    .pie()
                    .value(function (d) {
                        return d.Value;
                    })
                    .sort(null);

                var arc = d3
                    .svg
                    .arc()
                    .innerRadius(radius - 70)
                    .outerRadius(radius - 10);

                var svg = d3
                    .select($element[0])
                    .append('svg')
                    .attr({width: width, height: height})
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                var renderChart = function (data) {

                    // render chart
                    var g = svg
                        .selectAll(".arc")
                        .data(pie(data));

                    g
                        .exit()
                        .remove();

                    g
                        .enter()
                        .append("g")
                        .attr("class", "arc")
                        .attr('stroke', 'white');

                    g
                        .append("path")
                        .attr("d", arc)
                        .style("fill", function (d, i) {
                            return colors(d.data.id);
                        });

                    // add click listener
                    g.on('click', function (d, i) {
                        $timeout(function () {
                            $scope.data = d.data;
                            console.log('selected data', d);
                        });
                    });

                    g
                        .append("text")
                        .attr("transform", function (d) {
                            return "translate(" + arc.centroid(d) + ")";
                        })
                        .attr({fill: '#fff', dx: "-.15em"})
                        .text(function (d) {
                            return d.data.Value
                        });
                }

                $scope.$on('data finish load', function (event, args) {
                    // rendering after loading data
                    renderChart(angularService.data);
                })

                $scope.$on('data changed', function (event, args) {
                    console.log('update donut chart:', args.data);
                    // rendering after changing data
                    renderChart(angularService.data);
                })

            }
        }
    ])