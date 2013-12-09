angular.module('moped.search', [
  'ngRoute'
])
  .config(function config($routeProvider) {
    $routeProvider
      .when('#/search/:query', {
        templateUrl: 'search/results.tpl.html',
        controller: 'SearchResultsCtrl'
      });
  })
  .controller('SearchCtrl', function SearchController($scope, $location) {

    $scope.query = '';
    
    $scope.find = function() {
      if ($scope.query !== '' && $scope.query.length > 2) {
          document.activeElement.blur();
          $location.path('/search/' + $scope.query);
        }
        else {
          alert('Enter at least 3 characters');
        }
    };
  })
  .controller('SearchResultsCtrl', function SearchResultsController($scope) {
    
  });

