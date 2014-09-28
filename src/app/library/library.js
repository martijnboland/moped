angular.module('moped.library', [
  'moped.mopidy',
  'moped.util',
  'ngRoute'
])

.config(function config($routeProvider) {
  $routeProvider
    .when('/library/:uri', {
      templateUrl: 'library/directory.tpl.html',
      controller: 'DirectoryCtrl',
      title: 'Directories'
    });
})

.controller('LibraryMenuCtrl', function LibraryMenuController($scope, mopidyservice) {
  $scope.libraryDirectories = [];

  function loadLibraryDirectories() {
    mopidyservice.getLibrary().then(function(data) {
      $scope.libraryDirectories = data;
    }, function(data) {
      throw data;
    });
  }

  $scope.$on('mopidy:state:online', function() {
    loadLibraryDirectories();
  });
})

.controller('DirectoryCtrl', function DirectoryController($scope, $routeParams, mopidyservice, util) {
  $scope.uri = util.urlDecode($routeParams.uri);
  $scope.directories = [];
  $scope.playlists = [];
  $scope.tracks = [];

  mopidyservice.getDirectoryItems($scope.uri).then(function(data) {
    _.forEach(data, function (item, index) {
      if (item.type === 'directory') {
        $scope.directories.push(item);
      }
      else if (item.type === 'playlist') {
        $scope.playlists.push(item);
      }
      else if (item.type === 'track') {
        mopidyservice.getTrack(item.uri).then(function(data) {
          if (data.length == 1) {
            $scope.tracks[index] = data[0];
          }
          else {
            throw new Error('Expected exactly one track in result.');
          }
        });
      }
    });
  }, console.error.bind(console));

  $scope.$on('moped:playtrackrequest', function(event, track) {
    mopidyservice.playTrack(track, $scope.tracks);
  });
})
.filter('serviceIconStyle', function () {
  return function(uri) {
    switch(uri) {
      case "internetarchive:/": return "glyphicon glyphicon-cloud";
      //case "local:directory": return "glyphicon glyphicon-server";
      //case "podcast:": return "glyphicon glyphicon-rss";
      case "spotify:directory": return "glyphicon glyphicon-signal";
      default: return "glyphicon glyphicon-folder-close";
    }
  };
});
