angular.module('moped.library', [
  'moped.mopidy',
  'moped.util',
  'ngRoute'
])

.config(function config($routeProvider) {
  $routeProvider
    .when('/library/:uri/:name?', {
      templateUrl: 'library/container.tpl.html',
      controller: 'ContainerCtrl',
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
    // Load directories when going online, but wait a little, so other commands like obtaining playback state etc
    // can be executed before this one. 
    setTimeout(loadLibraryDirectories, 200); 
  });
})

.controller('ContainerCtrl', function ContainerController($scope, $routeParams, mopidyservice, util) {
  $scope.container = { name: util.urlDecode($routeParams.name), uri: util.urlDecode($routeParams.uri) };
  $scope.directories = [];
  $scope.playlists = [];
  $scope.tracks = [];

  mopidyservice.getLibraryItems($scope.container.uri).then(function(data) {
    var currentTrackIndex = 0;
    _.forEach(data, function (item) {
      if (item.type === 'directory') {
        item.fullName = $scope.container.name + '/' + item.name;
        $scope.directories.push(item);
      }
      else if (item.type === 'playlist') {
        item.fullName = $scope.container.name + '/' + item.name;
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

.directive("directory", function () {
  return {
    restrict: "E",
    scope: { directory: '=' },
    templateUrl: 'library/directory.tpl.html',
    replace:true
  };
})

.directive("playlist", function () {
  return {
    restrict: "E",
    scope: { playlist: '=' },
    templateUrl: 'library/playlist.tpl.html',
    replace:true
  };
});