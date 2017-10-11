angular
    .module('angularApp')
    .directive('detailsView', function () {
        return {
            restrict: 'AEC',
            scope: {
                data: "="
            },
            templateUrl: './app/directive/details-view.html',
            controller: [
                '$scope',
                '$rootScope',
                'angularService',
                function ($scope, $rootScope, angularService) {
                    $scope.dataChanged = function () {
                        console.log('data changed:', $scope.data);
                        angularService
                            .data
                            .forEach(function (el) {
                                if (el.id == $scope.data) {
                                    el.value = $scope.value;
                                }
                            });
                        $rootScope.$broadcast('data changed', {data: $scope.data});
                    }
                }
            ]
        };
    });