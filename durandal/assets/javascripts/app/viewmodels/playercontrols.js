define(['bootstraplib/bootstrap-slider', 'durandal/app', 'services/mopidyservice', 'jquery'], function (slider, app, mopidyservice, $) {
  return {
    isPlaying: false,
    attached: function(view) {
      var self = this;
      $(view).find('.slider').slider();
      app.on('mopidy:event:playbackStateChanged')
        .then(function(data) {
          if (data.new_state === 'playing') {
            self.isPlaying = true;
          }
          else {
            self.isPlaying = false;
          }
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