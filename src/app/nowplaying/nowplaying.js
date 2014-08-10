angular.module('moped.nowplaying', [
  'moped.mopidy',
  'moped.lastfm',
  'moped.util'
])

.controller('NowPlayingCtrl', function NowPlayingController($scope, mopidyservice, lastfmservice, util) {
  var CHECK_POSITION_INTERVAL = 10000;
  var INCREASE_POSITION_INTERVAL = 1000;
  var checkPositionTimer;
  var increasePositionTimer;
  var isSeeking = false;
  var defaultTrackImageUrl = 'assets/images/vinyl-icon.png';

  resetCurrentTrack();

  $scope.$on('moped:slidervaluechanging', function(event, value) {
    isSeeking = true;
  });

  $scope.$on('moped:slidervaluechanged', function(event, value) {
    seek(value);
    isSeeking = false;
    checkTimePosition();
  });

  $scope.$on('mopidy:state:online', function(event, data) {
    mopidyservice.getCurrentTrack().then(function(track) {
      mopidyservice.getTimePosition().then(function(timePosition) {
        updateCurrentTrack(track, timePosition);
      });
    });
    mopidyservice.getState().then(function (state) {
      if (state === 'playing') {
        checkPositionTimer = setInterval(function() {
          checkTimePosition();
        }, CHECK_POSITION_INTERVAL);                
        checkTimePosition();
      }
    });
  });

  $scope.$on('mopidy:state:offline', function() {
    clearInterval(checkPositionTimer);
    clearInterval(increasePositionTimer);
    resetCurrentTrack();
  });

  $scope.$on('mopidy:event:playbackStateChanged', function(event, data) {
    if (data.new_state === 'playing') {
      checkPositionTimer = setInterval(function() {
        checkTimePosition();
      }, CHECK_POSITION_INTERVAL); 
      checkTimePosition();
    }
    else {
      clearInterval(checkPositionTimer);
      clearInterval(increasePositionTimer);
    }
  });

  $scope.$on('mopidy:event:trackPlaybackStarted', function(event, data) {
    updateCurrentTrack(data.tl_track.track, data.time_position);
  });

  $scope.$on('mopidy:event:trackPlaybackPaused', function(event, data) {
    updateCurrentTrack(data.tl_track.track, data.time_position);
  });

  function updateCurrentTrack(track, timePosition) {
    if (track) {
      $scope.currentTrack = track.name;
      $scope.currentArtists = track.artists;
      $scope.currentTrackLength = track.length;
      $scope.currentTrackLengthString = util.timeFromMilliSeconds(track.length);

      if (track !== null && timePosition !== null && track.length > 0) {
        $scope.currentTimePosition = (timePosition / track.length) * 100;
        $scope.currentTrackPosition = util.timeFromMilliSeconds(timePosition);
      }
      else
      {
        $scope.currentTimePosition = 0;
        $scope.currentTrackPosition = util.timeFromMilliSeconds(0);
      }

      if (track.album !== undefined) {
        $scope.currentAlbumUri = track.album.uri;
        lastfmservice.getTrackImage(track, 'medium', function(err, trackImageUrl) {
          if (! err && trackImageUrl !== undefined && trackImageUrl !== '') {
            $scope.currentTrackImageUrl = trackImageUrl;
          }
          else
          {
            $scope.currentTrackImageUrl = defaultTrackImageUrl;
          }
          $scope.$apply();
        });
      }
      else {
        $scope.currentAlbumUri = null;
      }
    }
  }

  function resetCurrentTrack() {
    $scope.currentTrack = '';
    $scope.currentAlbumUri = '';
    $scope.currentArtists = [];
    $scope.currentTrackLength = 0;
    $scope.currentTrackLengthString = '';
    $scope.currentTimePosition = 0; // 0-100
    $scope.currentTrackPosition = util.timeFromMilliSeconds(0);
    $scope.currentTrackImageUrl = defaultTrackImageUrl;
  }

  function checkTimePosition() {
    if (! isSeeking) {

      clearInterval(increasePositionTimer);

      mopidyservice.getTimePosition().then(function(timePosition) {
        if ($scope.currentTrackLength > 0) {
          $scope.currentTimePosition = (timePosition / $scope.currentTrackLength) * 100;
          $scope.currentTrackPosition = util.timeFromMilliSeconds(timePosition);
          // start timer that updates position without checking mopidy
          increasePositionTimer = setInterval(function() {
            updateTimePosition(INCREASE_POSITION_INTERVAL);
          }, INCREASE_POSITION_INTERVAL);    
        }
        else {
          $scope.currentTimePosition = 0;
          $scope.currentTrackPosition = util.timeFromMilliSeconds(0);
        }
      });
    }
  }

  function updateTimePosition(msToUpdate) {
    if (! isSeeking && checkPositionTimer && $scope.currentTrackLength > 0) {
      var previousTimePositionMs = ($scope.currentTimePosition / 100) * $scope.currentTrackLength;
      var newTimePositionMs = previousTimePositionMs + msToUpdate;
      $scope.currentTimePosition = (newTimePositionMs / $scope.currentTrackLength) * 100;
      $scope.currentTrackPosition = util.timeFromMilliSeconds(newTimePositionMs);
      $scope.$apply();
    }
  }

  function seek(sliderValue) {
    if ($scope.currentTrackLength > 0) {
      var milliSeconds = ($scope.currentTrackLength / 100) * sliderValue;
      mopidyservice.seek(milliSeconds);
    }
  }

});
