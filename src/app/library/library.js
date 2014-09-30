angular.module('moped.library', [
  'moped.mopidy',
  'moped.util',
  'ngRoute'
])

.config(function config($routeProvider) {
  $routeProvider
    .when('/library/:uri/:name?', {
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
  $scope.directory = { name: util.urlDecode($routeParams.name), uri: util.urlDecode($routeParams.uri) };
  $scope.directories = [];
  $scope.playlists = [];
  $scope.tracks = [];

  mopidyservice.getDirectoryItems($scope.directory.uri).then(function(data) {
    var currentTrackIndex = 0;
    _.forEach(data, function (item) {
      if (item.type === 'directory') {
        item.fullName = $scope.directory.name + '/' + item.name;
        $scope.directories.push(item);
      }
      else if (item.type === 'playlist') {
        $scope.playlists.push(item);
      }
      else if (item.type === 'track') {
        (
          function(trackIndex) {
            mopidyservice.getTrack(item.uri).then(function (data) {
              if (data.length == 1) {
                $scope.tracks[trackIndex] = data[0];
              }
              else {
                throw new Error('Expected exactly one track in result.');
              }
            });
          }(currentTrackIndex++)
        );
      }
    });
  }, console.error.bind(console));

  $scope.$on('moped:playtrackrequest', function(event, track) {
    mopidyservice.playTrack(track, $scope.tracks);
  });
})

.directive("subDirectory", function () {
  return {
    restrict: "E",
    scope: { directory: '=' },
    templateUrl: 'library/subDirectory.tpl.html',
    replace:true
  };
});