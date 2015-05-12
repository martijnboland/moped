angular.module('moped.widgets')
.directive('mopedTrack', function(util) {
  return {
    restrict: 'E',
    scope: {
      trackNo: '=',
      track: '='
    },
    replace: true,
    templateUrl: function(element, attrs) {
      var display = attrs.display || 'default';
      switch (display) {
        case 'short':
          return 'widgets/track-short.tpl.html';
        case 'medium':
          return 'widgets/track-medium.tpl.html';
        case 'default':
          return 'widgets/track.tpl.html';
      }
    }, 
    link: function(scope, element, attrs) {
      scope.artistsAsString = function() {
        return util.getTrackArtistsAsString(scope.track);
      };
      scope.trackDuration = function() {
        return util.getTrackDuration(scope.track);
      };
      scope.playTrack = function() {
        scope.$emit('moped:playtrackrequest', scope.track);
        return false;
      };
      scope.trackProvider = function() {
        var provider = scope.track.uri.split(':')[0];
        return (provider.charAt(0).toUpperCase() + provider.slice(1));
      };

      var cleanUpTrackPlaybackStarted = scope.$on('mopidy:event:trackPlaybackStarted', function(event, data) {
        scope.isPlaying = data.tl_track.track.uri === scope.track.uri;
      });

      var cleanUpTrackPlaybackPaused = scope.$on('mopidy:event:trackPlaybackPaused', function(event, data) {
        scope.isPlaying = data.tl_track.track.uri === scope.track.uri;
      });

      var cleanUpCurrentTrackRequested = scope.$on('moped:currenttrackrequested', function(event, track) {
        scope.isPlaying = track.uri === scope.track.uri;
        util.safeApply(scope);
      });

      scope.$on('$destroy', function() {
        cleanUpTrackPlaybackStarted();
        cleanUpTrackPlaybackPaused();
        cleanUpCurrentTrackRequested();
      });
    }
  };
});