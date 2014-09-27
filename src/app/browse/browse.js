angular.module('moped.browse', [
  'moped.mopidy',
  'moped.lastfm',
  'ngRoute',
  'ngSanitize'
])

.config(function config($routeProvider) {
  $routeProvider
    .when('/album/:uri', {
      templateUrl: 'browse/album.tpl.html',
      controller: 'AlbumCtrl',
      title: 'Album'
    })
    .when('/artist/:uri/:name', {
      templateUrl: 'browse/artist.tpl.html',
      controller: 'ArtistCtrl',
      title: 'Artist'
    });
})

.controller('AlbumCtrl', function AlbumController($scope, $timeout, $routeParams, mopidyservice) {
  var defaultAlbumImageUrl = 'assets/images/noalbum.png';

  $scope.album = {};
  $scope.tracks = [];

  mopidyservice.getAlbum($routeParams.uri).then(function(data) {

    // data comes as a list of tracks.
    if (data.length > 0) {

      _.forEach(data, function(track) {
        // don't add unplayable tracks
        if (track.name.indexOf('[unplayable]') === -1) {
          $scope.tracks.push(track);
        }
      });

      // Extract album and artist(s) from first track.
      var firstTrack = $scope.tracks[0];
      $scope.album = firstTrack.album;
    }
  }, console.error);

  $timeout(function() {
    mopidyservice.getCurrentTrack().then(function(track) {
      if (track) {
        $scope.$broadcast('moped:currenttrackrequested', track);
      }
    });
  }, 500);

  $scope.$on('moped:playtrackrequest', function(event, track) {
    mopidyservice.playTrack(track, $scope.tracks);
  });
})

.controller('ArtistCtrl', function ArtistController($scope, $timeout, $routeParams, util, mopidyservice, lastfmservice) {
  var defaultAlbumImageUrl = 'assets/images/noalbum.png';

  var uri = $routeParams.uri;
  var name = util.urlDecode($routeParams.name);

  $scope.artistSummary = '';
  $scope.albums = [];
  $scope.singles = [];
  $scope.appearsOn = [];

  $scope.artist = { name: name };

  lastfmservice.getArtistInfo(name, function(err, artistInfo) {
    if (! err) {
      $scope.artistSummary = artistInfo.artist.bio.summary;
    }
  });

  mopidyservice.getArtist(uri).then(function(data) {

    // data comes as a list of tracks.
    if (data.length > 0) {
      // First filter unplayable tracks
      _.remove(data, function(track) { 
        return track.name.indexOf('[unplayable]') > -1;
      });

      // Get artist object from list of tracks
      $scope.artist = _.chain(data)
        .map(function(track) {
          return track.artists[0];
        })
        .find({ uri: uri })
        .value();

      // Extract albums from list of tracks
      var allAlbums = _.chain(data)
        .map(function(track) {
          return track.album;
        })
        .uniq(function(album) {
          return album.uri;
        })
        .sortBy('date')
        .value();

      var tracksByAlbum = _.groupBy(data, function(track) {
        return track.album.uri;
      });

      _.forEachRight(allAlbums, function(album) {
        var tracks = tracksByAlbum[album.uri];
        var albumObject = { album: album, tracks: tracks };
        if (album.artists[0].uri === uri) { // Main artist, otherwise appears on.
          if (tracks.length > 4) { // If an album has 4 tracks or less, we're categorizing it as single.
            $scope.albums.push(albumObject);
          }
          else {
            $scope.singles.push(albumObject);
          }
        }
        else {
          $scope.appearsOn.push(albumObject);
        }
      });
    }
  }, console.error);

  $timeout(function() {
    mopidyservice.getCurrentTrack().then(function(track) {
      if (track) {
        $scope.$broadcast('moped:currenttrackrequested', track);
      }
    });
  }, 500);

  $scope.$on('moped:playtrackalbumrequest', function(event, album) {
    mopidyservice.playTrack(album.currenttrack, album.tracks);
  });

});