angular
    .module('angularApp')
    .directive('barsView', [
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
                    height = $attrs.height;

                var barHeight = 30,
                    leftMargin = 15,
                    barTextOffsetY = 22;

                // initial colors
                var colors = d3
                    .scale
                    .category20();

                var svg = d3
                    .select($element[0])
                    .append("svg")
                    .attr({width: width, height: height});

                var renderChart = function (data) {
                    // set max range
                    var max = d3.max(data, function (d) {
                        return d.Value;
                    });

                    // render bar
                    var rect = svg
                        .selectAll('rect')
                        .data(data);

                    rect
                        .exit()
                        .remove();

                    rect
                        .enter()
                        .append('rect')
                        .attr({
                            height: barHeight,
                            width: 0,
                            x: 0,
                            y: function (d, i) {
                                return i * barHeight;
                            },
                            stroke: 'white'
                        })
                        .style('fill', function (d, i) {
                            return colors(i);
                        });
                    // add click listener
                    rect.on('click', function (d, i) {
                        $timeout(function () {
                            $scope.data = d;
                            console.log('selected data', d);
                        });
                    });
                    // add transition
                    rect
                        .transition()
                        .duration(1000)
                        .attr('width', function (d) {
                            return d.Value / (max / width);
                        });
                    // render text
                    var text = svg
                        .selectAll('text')
                        .data(data);

                    text
                        .exit()
                        .remove();

                    text
                        .enter()
                        .append('text')
                        .attr({
                            fill: '#fff',
                            x: leftMargin,
                            y: function (d, i) {
                                return i * barHeight + barTextOffsetY;
                            }
                        })
                        .text(function (d) {
                            return d.Name + ' (' + d.Value + ')';
                        });
                    // add click listener
                    text.on('click', function (d, i) {
                        $timeout(function () {
                            $scope.data = d;
                            console.log('selected data', d);
                        });
                    });

                }

                $scope.$on('data finish load', function (event, args) {
                    // rendering after loading data
                    renderChart(angularService.data);
                });

                $scope.$on('data changed', function (event, args) {
                    console.log('updata bar Chart:', args.data);
                    // rendering after changing data
                    renderChart(angularService.data);
                });

            }
        }
    ])