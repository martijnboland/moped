angular.module('moped.nowplaying', [
  'moped.mopidy',
  'moped.lastfm',
  'moped.util'
])

.controller('NowPlayingCtrl', function NowPlayingController($scope, mopidyservice, lastfmservice, util) {
  var checkPositionTimer;
  var isSeeking = false;
  var defaultTrackImageUrl = 'assets/images/vinyl-icon.png';

  resetCurrentTrack();

  $scope.$on('moped:slidervaluechanging', function(event, value) {
    isSeeking = true;
  });

  $scope.$on('moped:slidervaluechanged', function(event, value) {
    seek(value);
    isSeeking = false;
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
        }, 1000);                
      }
    });
  });

  $scope.$on('mopidy:state:offline', function() {
    clearInterval(checkPositionTimer);
    resetCurrentTrack();
  });

  $scope.$on('mopidy:event:playbackStateChanged', function(event, data) {
    if (data.new_state === 'playing') {
      checkPositionTimer = setInterval(function() {
        checkTimePosition();
      }, 1000); 
    }
    else {
      clearInterval(checkPositionTimer);
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

        if (track.album.images && track.album.images.length > 0) {
          $scope.currentTrackImageUrl = track.album.images[0];
        } else {
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
      mopidyservice.getTimePosition().then(function(timePosition) {
        if ($scope.currentTrackLength > 0 && timePosition > 0) {
          $scope.currentTimePosition = (timePosition / $scope.currentTrackLength) * 100;
          $scope.currentTrackPosition = util.timeFromMilliSeconds(timePosition);
        }
        else {
          $scope.currentTimePosition = 0;
          $scope.currentTrackPosition = util.timeFromMilliSeconds(0);
        }
      });
    }
  }

  function seek(sliderValue) {
    if ($scope.currentTrackLength > 0) {
      var milliSeconds = ($scope.currentTrackLength / 100) * sliderValue;
      mopidyservice.seek(Math.round(milliSeconds));      
    }
  }

});
