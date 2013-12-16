angular.module('moped.browse', [
  'moped.mopidy',
  'ngRoute'
])

.config(function config($routeProvider) {
  $routeProvider
    .when('/album/:uri', {
      templateUrl: 'browse/album.tpl.html',
      controller: 'AlbumCtrl',
      title: 'Album'
    })
    .when('/artist/:uri', {
      templateUrl: 'browse/artist.tpl.html',
      controller: 'ArtistCtrl',
      title: 'Artist'
    });
})

.controller('AlbumCtrl', function AlbumController($scope, $timeout, $routeParams, mopidyservice) {
  var defaultAlbumImageUrl = 'images/noalbum.png';

  $scope.album = {};
  $scope.tracks = [];

  mopidyservice.getAlbum($routeParams.uri).then(function(data) {

    // data comes as a list of tracks.
    if (data.length > 0) {

      _.forEach(data, function(track) {
        $scope.tracks.push(track);
      });

      // Extract album and artist(s) from first track.
      var firstTrack = data[0];
      $scope.album = firstTrack.album;
    }
  }, console.error);

  $timeout(function() {
    mopidyservice.getCurrentTrack().then(function(track) {
      $scope.$broadcast('moped:currenttrackrequested', track);
    });
  }, 500);

  $scope.$on('moped:playtrackrequest', function(event, track) {
    mopidyservice.playTrack(track, $scope.tracks);
  });
})

.controller('ArtistCtrl', function ArtistController($scope) {
  
});