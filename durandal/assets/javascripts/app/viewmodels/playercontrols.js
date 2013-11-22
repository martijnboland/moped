define(['bootstraplib/bootstrap-slider', 'durandal/app', 'services/mopidyservice', 'jquery'], function (slider, app, mopidyservice, $) {
  return {
    isPlaying: false,
    attached: function(view) {
      var self = this;
      var $slider = $(view).find('.volume-slider').slider()
        .on('slideStop', function(ev) {
          mopidyservice.setVolume(ev.value);
        });

      app.on('mopidy:event:playbackStateChanged')
        .then(function(data) {
          self.isPlaying = data.new_state === 'playing';
        });
      app.on('mopidy:state:online')
        .then(function(data) {
          mopidyservice.getVolume()
            .then(function(volume) {
              $slider.slider('setValue', volume);
            });
          mopidyservice.getState()
            .then(function (state) {
              self.isPlaying = state === 'playing';
            });
        });
      app.on('mopidy:event:volumeChanged')
        .then(function(data) {
          $slider.slider('setValue', data.volume);
        });
    },
    play: function() {
      if (this.isPlaying) {
        // pause
        mopidyservice.pause();
      }
      else {
        // play
        mopidyservice.play();
      }
    },
    previous: function() {
      mopidyservice.previous();
    },
    next: function() {
      mopidyservice.next();
    }
  };
});