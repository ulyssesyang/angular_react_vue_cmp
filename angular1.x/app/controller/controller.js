angular.module('angularApp')
    .controller('appController', ['$scope', 'angularService', function($scope, angularService) {
        $scope.$on('data finish load', function() {
            $scope.data = angularService.data[0];
        });
    }]);