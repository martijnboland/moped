angular.module('moped.playlists', [
  'moped.mopidy',
  'moped.util',
  'ngRoute'
])

.config(function config($routeProvider) {
  $routeProvider
    .when('/playlist/:uri', {
      templateUrl: 'playlists/list.tpl.html',
      controller: 'PlaylistCtrl',
      title: 'Playlist'
    });
})

.controller('PlaylistMenuCtrl', function PlaylistMenuController($scope, mopidyservice) {
  function ensureFolderExists(folderPaths, processedPlaylists) {
    // Check if a compatible folder exists in processedPlaylists. If not, create and return it.
    var currentFolder = null;
    _.forEach(folderPaths, function (folderPath) {
      if (currentFolder === null) {
        currentFolder = _.find(processedPlaylists, function (playlistItem) {
          return playlistItem.hasOwnProperty('items') && playlistItem.name === folderPath;
        });
        if (! currentFolder) {
          currentFolder = { name: folderPath, items: [], expanded: false };
          processedPlaylists.push(currentFolder);
        }
      }
      else {
        var previousFolder = currentFolder;
        currentFolder = _.find(previousFolder.items, function (playlistItem) {
          return playlistItem.hasOwnProperty('items') && playlistItem.name === folderPath;
        });
        if (! currentFolder) {
          currentFolder = { name: folderPath, items: [], expanded: false };
          previousFolder.items.push(currentFolder);
        }
      }
    });
    return currentFolder;
  }

  function processPlaylists(playlists) {
    var processedPlaylists = [];
    // Extract playlist folders from playlist names ('/' is the separator) and shove the playlist into
    // the right folders.
    _.forEach(playlists, function (playlist) {
      var paths = playlist.name.split('/');
      if (paths.length > 1) {
        // Folders, last item in array is the playlist name
        playlist.name = paths.pop();
        var folder = ensureFolderExists(paths, processedPlaylists);
        folder.items.push(playlist);
      }
      else {
        processedPlaylists.push(playlist);
      }

    });

    return processedPlaylists;
  }

  function loadPlaylists() {
    mopidyservice.getPlaylists().then(function(data) {
      $scope.playlists = processPlaylists(data);      
    }, console.error.bind(console));
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
  function loadPlaylist() {
    mopidyservice.getPlaylist($routeParams.uri).then(function(data) {
      $scope.playlist = data;
    }, console.error.bind(console));    
  }

  $scope.playlist = {};
 
  loadPlaylist();

  $scope.$on('moped:playtrackrequest', function(event, track) {
    mopidyservice.playTrack(track, $scope.playlist.tracks);
  });
})

.directive("playlistFolder", function ($compile) {
  return {
    restrict: "E",
    scope: { folder: '=' },
    templateUrl: 'playlists/playlistfolder.tpl.html',
    controller: function ($scope) {
      $scope.toggle = function (folder) {
        folder.expanded = ! folder.expanded;
      };
    },
    compile: function (el, attr) {
      var contents = el.contents().remove();
      var compiledContents;
      return function(scope, el, attr) {
        if(! compiledContents) {
          compiledContents = $compile(contents);
        }
        compiledContents(scope, function (clone, scope) {
          el.append(clone);
        });
      };
    }
  };
});
