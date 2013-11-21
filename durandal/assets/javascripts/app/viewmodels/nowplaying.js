define(['bootstraplib/bootstrap-slider', 'durandal/app', 'services/mopidyservice', 'services/artservice', 'jquery', 'util'], 
  function (slider, app, mopidyservice, artservice, $, util) {
  
  var self;
  var $slider;
  var checkPositionTimer;
  var isSeeking = false;
  var defaultTrackImageUrl = 'images/vinyl-icon.png';

  function updateCurrentTrack(track, timePosition) {
    self.currentTrack = track.name;
    self.currentAlbumUri = track.album.uri;
    self.currentArtists = track.artists;
    self.currentTrackLength = track.length;
    self.currentTrackLengthString = util.timeFromMilliSeconds(track.length);

    if (track !== null && timePosition !== null && track.length > 0) {
      $slider.slider('setValue', (timePosition / track.length) * 100);
      self.currentTrackPosition = util.timeFromMilliSeconds(timePosition);
    }
    else
    {
      $slider.slider('setValue', 0);
      self.currentTrackPosition = util.timeFromMilliSeconds(0);
    }

    artservice.getTrackImage(track, 'medium', function(trackImageUrl, err) {
      if (trackImageUrl !== undefined && trackImageUrl !== '') {
        self.currentTrackImageUrl = trackImageUrl;
      }
      else
      {
        self.currentTrackImageUrl = defaultTrackImageUrl;
      }
    });
  }

  function clearCurrentTrack() {
    self.currentTrack = '';
    self.currentAlbumUri = '';
    self.currentArtists = [];
    self.currentTrackLength = 0;
    self.currentTrackLengthString = '';
    self.currentTrackPosition = util.timeFromMilliSeconds(0);
    self.currentTrackImageUrl = defaultTrackImageUrl;
  }

  function checkTimePosition() {
    if (! isSeeking) {
      mopidyservice.getTimePosition().then(function(timePosition) {
        if (self.currentTrackLength > 0 && timePosition > 0) {
          $slider.slider('setValue', (timePosition / self.currentTrackLength) * 100);
          self.currentTrackPosition = util.timeFromMilliSeconds(timePosition);
        }
        else {
          $slider.slider('setValue', 0);
          self.currentTrackPosition = util.timeFromMilliSeconds(0);
        }
      });
    }
  }

  function seek(sliderValue) {
    if (self.currentTrackLength > 0) {
      var milliSeconds = (self.currentTrackLength / 100) * sliderValue;
      mopidyservice.seek(milliSeconds);      
    }
  }

  return {
    currentTrack: '',
    currentAlbumUri: '',
    currentArtists: [],
    currentTrackLength: 0,
    currentTrackLengthString: '',
    currentTrackPosition: util.timeFromMilliSeconds(0),
    currentTrackImageUrl: defaultTrackImageUrl,
    attached: function(view) {
      self = this;
      $slider = $(view).find('.time-slider').slider()
        .on('slideStart', function() {
          isSeeking = true;
        })
        .on('slideStop', function(ev) {
          seek(ev.value);
          isSeeking = false;
        });

      app.on('mopidy:state:online')
        .then(function(data) {
          mopidyservice.getCurrentTrack()
            .then(function(track) {
              mopidyservice.getTimePosition().then(function(timePosition) {
                updateCurrentTrack(track, timePosition, self);
              });
            });
          mopidyservice.getState()
            .then(function (state) {
              if (state === 'playing') {
                checkPositionTimer = setInterval(function() {
                  checkTimePosition();
                }, 1000);                
              }
            });
        });

      app.on('mopidy:state:offline')
        .then(function() {
          clearInterval(checkPositionTimer);
          clearCurrentTrack(self);
        });

      app.on('mopidy:event:playbackStateChanged')
        .then(function(data) {
          if (data.new_state === 'playing') {
            checkPositionTimer = setInterval(function() {
              checkTimePosition();
            }, 1000); 
          }
          else {
            clearInterval(checkPositionTimer);
          }
        });

      app.on('mopidy:event:trackPlaybackStarted')
        .then(function(data) {
          updateCurrentTrack(data.tl_track.track, data.time_position, self);
        });

      app.on('mopidy:event:trackPlaybackPaused')
        .then(function(data) {
          updateCurrentTrack(data.tl_track.track, data.time_position, self);
        });
    }
  };
});