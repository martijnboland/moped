angular.module('moped.search', [
  'moped.util',
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

.controller('SearchCtrl', function SearchController($scope, $location, util) {

  $scope.query = '';
  
  $scope.find = function() {
    if ($scope.query !== '' && $scope.query.length > 1) {
        document.activeElement.blur();
        $location.path('/search/' + util.urlEncode($scope.query));
      }
      else {
        alert('Enter at least 2 characters');
      }
  };
})

.controller('SearchResultsCtrl', function SearchResultsController($scope, $routeParams, util, mopidyservice) {
  $scope.artists = [];
  $scope.albums = [];
  $scope.tracks = [];

  $scope.query = util.urlDecode($routeParams.query);
  if ($scope.query.length > 1) {
    mopidyservice.search($scope.query).then(function(results) {
      _.forEach(results, function(result) {
        var artists = _.take(result.artists, 6);
        _.forEach(artists, function(artist) {
          $scope.artists.push(artist);
        });
        var albums = _.take(result.albums, 6);
        _.forEach(albums, function(album) {
          $scope.albums.push(album);
        });
        var tracks = _.take(result.tracks, 20);
        _.forEach(tracks, function(track) {
          $scope.tracks.push(track);
        });
      });
    });
  }

  $scope.$on('moped:playtrackrequest', function(event, track) {
    mopidyservice.playTrack(track, $scope.tracks);
  });
});

