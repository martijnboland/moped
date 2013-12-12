angular.module('moped.widgets', [
  'moped.util'
])
.directive('mopedTrack', function(util) {
  return {
    restrict: 'EA',
    scope: {
      trackNo: '=',
      track: '='
    },
    replace: true,
    templateUrl: 'widgets/track.tpl.html',
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
      var cleanUpTrackPlaybackStarted = scope.$on('mopidy:event:trackPlaybackStarted', function(event, data) {
        scope.isPlaying = data.tl_track.track.uri === scope.track.uri;
        scope.$apply();
      });

      var cleanUpTrackPlaybackPaused = scope.$on('mopidy:event:trackPlaybackPaused', function(event, data) {
        scope.isPlaying = data.tl_track.track.uri === scope.track.uri;
        scope.$apply();
      });

      var cleanUpCurrentTrackRequested = scope.$on('moped:currenttrackrequested', function(track) {
        scope.isPlaying = track.uri === scope.track.uri;
        scope.$apply();
      });

      $scope.$on('$destroy', function() {
        cleanUpTrackPlaybackStarted();
        cleanUpTrackPlaybackPaused();
        cleanUpCurrentTrackRequested();
      };
    }
  };
});