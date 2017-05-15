angular.module('angularApp')
    .directive('donutView', ['angularService', '$timeout', function(angularService, $timeout) {
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

            var pie = d3.layout.pie()
                .value(function(d) { return d.Value; })
                .sort(null);

            var arc = d3.svg.arc()
                .innerRadius(radius - 70)
                .outerRadius(radius - 10);

            // initial colors
            var colors = d3.scale.category20();

            var svg = d3.select($element[0])
                .append('svg')
                .attr({
                    width: width,
                    height: height
                })
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            console.log(svg);

            var renderChart = function(data) {

                // render chart
                var g = svg.selectAll(".arc")
                    .data(pie(data))
                    .enter().append("g")
                    .attr("class", "arc")
                    .attr('stroke', 'white');

                g.append("path")
                    .attr("d", arc)
                    .style("fill", function(d) { return colors(d.data.Value); });

                // add click listener
                g.on('click', function(d, i) {
                    $timeout(function() {
                        $scope.data = d.data;
                        console.log('selected data', d);
                    });
                });

                g.append("text")
                    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                    .attr({
                        fill: '#fff',
                        dx: "-.15em"
                    })
                    .text(function(d) { return d.data.Value });
            }

            var updateDonutChart = function(data) {
                var path = svg.selectAll("path").data(data, function(d) { return d.id; });
                console.log(path);
                path.transition()
                    .duration(750)
                    .attrTween('d',
                        function() {
                            var i = d3.interpolate(this._current, a);
                            this._current = i(0);
                            return function(t) {
                                return arc(i(t));
                            };
                        });
            }


            $scope.$on('data finish load', function(event, args) {
                // initial load data
                var data = angularService.data;
                // rendering after loading data
                renderChart(data);
            })

            $scope.$on('data changed', function(event, args) {
                console.log('update donut chart:', args.data);
                // rendering after changing data
                updateDonutChart(args.data);
            })

        }
    }])