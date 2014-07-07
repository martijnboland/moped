angular.module('moped.search', [
  'moped.mopidy',
  'ngRoute'
])

.config(function config($routeProvider) {
  $routeProvider
    .when('/search/:query', {
      templateUrl: 'search/results.tpl.html',
      controller: 'SearchResultsCtrl',
      title: 'Search results'
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

.controller('SearchResultsCtrl', function SearchResultsController($scope, $routeParams, mopidyservice) {
  $scope.artists = [];
  $scope.albums = [];
  $scope.tracks = [];

  $scope.query = $routeParams.query;
  if ($scope.query.length > 3) {
    mopidyservice.search($scope.query).then(function(results) {
      _.forEach(results, function(result) {
        _.chain(result.artists)
          .first(6)
          .forEach(function(artist) {
            $scope.artists.push(artist);
          });
        _.chain(result.albums)
          .first(6)
          .forEach(function(album) {
            $scope.albums.push(album);
          });
        _.chain(result.tracks)
          .first(20)
          .forEach(function(track) {
            $scope.tracks.push(track);
          });
      });
    });
  }

  $scope.$on('moped:playtrackrequest', function(event, track) {
    mopidyservice.playTrack(track, $scope.tracks);
  });
});

