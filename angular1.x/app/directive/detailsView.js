 angular.module('angularApp')
     .directive('detailsView', function() {
         return {
             restrict: 'AEC',
             scope: { data: "=" },
             templateUrl: './app/directive/details-view.html',
             controller: ['$scope', '$rootScope', function($scope, $rootScope) {
                 $scope.dataChanged = function() {
                     console.log('data changed:', $scope.data);
                     $rootScope.$broadcast('data changed', { data: $scope.data });
                 }
             }]
         };
     });