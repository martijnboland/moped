angular.module('moped.widgets')
  .directive('mopedPlaylist', function() {
    return {
      restrict: "E",
      scope: { playlist: '=' },
      templateUrl: 'widgets/playlist.tpl.html',
      replace:true
    };
  });