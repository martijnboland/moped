angular.module('moped.playlists', [
  'moped.mopidy',
  'moped.util',
  'ngRoute'
])

.config(function config($routeProvider) {
  $routeProvider
    .when('/playlist/:uri', {
      templateUrl: 'playlists/list.tpl.html',
      controller: 'PlaylistCtrl'
    });
})

.controller('PlaylistMenuCtrl', function PlaylistMenuController($scope, mopidyservice) {
  function loadPlaylists() {
    mopidyservice.getPlaylists().then(function(data) {
      $scope.playlists = data;
    }, console.error);
  }

  $scope.playlists = [];

  $scope.$on('mopidy:state:online', function() {
    loadPlaylists();
  });

  $scope.$on('mopidy:event:playlistsLoaded', function() {
    loadPlaylists();
  });
})

.controller('PlaylistCtrl', function PlaylistController($scope, $routeParams, mopidyservice, util) {
  $scope.playlist = {};

  mopidyservice.getPlaylist($routeParams.uri).then(function(data) {
    $scope.playlist = data;
  }, console.error);

  $scope.$on('moped:playtrackrequest', function(event, track) {
    mopidyservice.playTrack(track, $scope.playlist.tracks);
  });
});

